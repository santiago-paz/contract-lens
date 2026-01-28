import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const args = process.argv.slice(2)
  if (args.length < 3) {
    console.error('Usage: npx ts-node scripts/create-user.ts <email> <password> <teamName>')
    process.exit(1)
  }

  const [email, password, teamName] = args

  console.log(`Creating user ${email} for team ${teamName}...`)

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        team: {
          connectOrCreate: {
            where: { name: teamName },
            create: { name: teamName }
          }
        }
      },
      include: {
        team: true
      }
    })
    console.log('User created successfully:')
    console.log(user)
  } catch (e: any) {
    if (e.code === 'P2002') {
      console.error('User with this email already exists.')
    } else {
      console.error('Error creating user:', e)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
