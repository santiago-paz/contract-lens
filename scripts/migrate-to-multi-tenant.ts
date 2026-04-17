/**
 * Migration script: Single-user → Multi-tenant
 *
 * For each existing user:
 * 1. Creates a personal Organization
 * 2. Creates a Membership with role "owner"
 * 3. Sets organizationId on all their contracts
 *
 * This script is idempotent — safe to run multiple times.
 *
 * Usage:
 *   npx tsx scripts/migrate-to-multi-tenant.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

async function main() {
  console.log('Starting multi-tenant migration...\n');

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
  });

  console.log(`Found ${users.length} user(s) to process.\n`);

  let created = 0;
  let skipped = 0;
  let contractsUpdated = 0;

  for (const user of users) {
    // Check if user already has a membership (idempotent)
    const existing = await prisma.membership.findFirst({
      where: { userId: user.id },
    });

    if (existing) {
      console.log(`  [SKIP] ${user.email} — already has membership in org ${existing.organizationId}`);

      // Still ensure all their contracts have an organizationId
      // Use raw query to find contracts missing organizationId (handles post-migration schema)
      const updated = await prisma.$executeRaw`
        UPDATE "Contract" SET "organizationId" = ${existing.organizationId}
        WHERE "userId" = ${user.id} AND "organizationId" IS NULL
      `;

      if (updated > 0) {
        console.log(`    -> Backfilled ${updated} contract(s) with missing organizationId`);
        contractsUpdated += updated;
      }

      skipped++;
      continue;
    }

    // Create organization for this user
    const orgName = user.name ? `${user.name}'s Organization` : `Organization`;
    const baseSlug = slugify(user.name || user.email.split('@')[0]);

    // Ensure slug uniqueness
    let slug = baseSlug;
    let attempt = 0;
    while (await prisma.organization.findUnique({ where: { slug } })) {
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    const org = await prisma.organization.create({
      data: {
        name: orgName,
        slug,
      },
    });

    // Create membership as owner
    await prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        role: 'owner',
      },
    });

    // Assign all user's contracts to this organization
    const updated = await prisma.$executeRaw`
      UPDATE "Contract" SET "organizationId" = ${org.id}
      WHERE "userId" = ${user.id} AND "organizationId" IS NULL
    `;

    contractsUpdated += updated;
    created++;

    console.log(`  [OK] ${user.email} → org "${org.name}" (${org.slug}), ${updated} contract(s) linked`);
  }

  console.log(`\nMigration complete.`);
  console.log(`  Organizations created: ${created}`);
  console.log(`  Users skipped (already migrated): ${skipped}`);
  console.log(`  Contracts updated: ${contractsUpdated}`);
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
