import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Prisma client has been generated. If you see type errors, please restart the TS server.
const prisma = new PrismaClient()

interface ContractData {
  contractNumber: string
  title: string
  type: string
  status: string
  summary?: string
  conditions?: string
  contractOwner?: string
  deputy?: string
  contractManager?: string
  contractValue?: string
  startDate?: string
  endDate?: string
  renewalDate?: string
}

interface TaskData {
  title: string
  status: string
  type?: string
  dueDate?: string
}

interface ActivityData {
  description: string
  action: string
  timestamp?: string
}

interface UserData {
  email: string
  password: string
  name?: string
  equipo: string
  contracts?: ContractData[]
  tasks?: TaskData[]
  activities?: ActivityData[]
}

async function main() {
  const jsonPath = path.join(__dirname, 'users.json')
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: Could not find users.json at ${jsonPath}`)
    process.exit(1)
  }

  const fileContent = fs.readFileSync(jsonPath, 'utf-8')
  let users: UserData[]

  try {
    users = JSON.parse(fileContent)
    if (!Array.isArray(users)) {
      users = [users]
    }
  } catch (e) {
    console.error('Error parsing users.json:', e)
    process.exit(1)
  }

  console.log(`Found ${users.length} user(s) to process...`)

  for (const userData of users) {
    const { email, password, name, equipo, contracts, tasks, activities } = userData

    if (!email || !password || !equipo) {
      console.warn(`Skipping invalid user entry: ${JSON.stringify(userData)}`)
      continue
    }

    console.log(`Processing user ${email} (${name || 'No Name'}) for team ${equipo}...`)

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      // Create User
      const user = await prisma.user.upsert({
        where: { email },
        update: {
          name,
          password: hashedPassword,
        },
        create: {
          email,
          password: hashedPassword,
          name,
        },
      })
      
      console.log(`User ${email} upserted successfully. ID: ${user.id}`)

      // Create Contracts
      if (contracts && contracts.length > 0) {
        console.log(`Processing ${contracts.length} contracts...`)
        for (const contract of contracts) {
          const existing = await prisma.contract.findFirst({
            where: { contractNumber: contract.contractNumber, userId: user.id },
          })

          if (existing) {
            await prisma.contract.update({
              where: { id: existing.id },
              data: {
                title: contract.title,
                type: contract.type,
                status: contract.status,
                summary: contract.summary,
                conditions: contract.conditions,
                contractOwner: contract.contractOwner,
                deputy: contract.deputy,
                contractManager: contract.contractManager,
                contractValue: contract.contractValue,
                startDate: contract.startDate,
                endDate: contract.endDate,
                renewalDate: contract.renewalDate,
              },
            })
          } else {
            // Find user's org membership for organizationId
            const membership = await prisma.membership.findFirst({
              where: { userId: user.id },
              select: { organizationId: true },
            })
            if (!membership) {
              console.warn(`  Skipping contract ${contract.contractNumber}: user has no org membership`)
              continue
            }

            await prisma.contract.create({
              data: {
                contractNumber: contract.contractNumber,
                title: contract.title,
                type: contract.type,
                status: contract.status,
                summary: contract.summary,
                conditions: contract.conditions,
                contractOwner: contract.contractOwner,
                deputy: contract.deputy,
                contractManager: contract.contractManager,
                contractValue: contract.contractValue,
                startDate: contract.startDate,
                endDate: contract.endDate,
                renewalDate: contract.renewalDate,
                userId: user.id,
                organizationId: membership.organizationId,
              },
            })
          }
        }
      }

      // Create Tasks
      if (tasks && tasks.length > 0) {
        console.log(`Processing ${tasks.length} tasks...`)
        for (const task of tasks) {
          // Tasks don't have a unique ID in JSON, so we create them blindly or we could try to find by title+user
          // For simplicity/seeding, let's create if not exists (approximate match) or just create.
          // To avoid duplicates on re-run, let's try to find first.
          const existingTask = await prisma.task.findFirst({
            where: {
              userId: user.id,
              title: task.title
            }
          })

          if (!existingTask) {
            await prisma.task.create({
              data: {
                title: task.title,
                status: task.status,
                type: task.type,
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
                userId: user.id
              }
            })
          }
        }
      }

      // Create Activities
      if (activities && activities.length > 0) {
        console.log(`Processing ${activities.length} activities...`)
        for (const activity of activities) {
          const existingActivity = await prisma.activity.findFirst({
            where: {
              userId: user.id,
              description: activity.description,
              timestamp: activity.timestamp ? new Date(activity.timestamp) : undefined
            }
          })

          if (!existingActivity) {
            await prisma.activity.create({
              data: {
                description: activity.description,
                action: activity.action,
                timestamp: activity.timestamp ? new Date(activity.timestamp) : undefined,
                userId: user.id
              }
            })
          }
        }
      }

    } catch (e: any) {
      console.error(`Error processing user ${email}:`, e)
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
