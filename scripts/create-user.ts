import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface UserData {
  email: string
  password: string
  equipo: string
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
    // Support both single object and array
    if (!Array.isArray(users)) {
      users = [users]
    }
  } catch (e) {
    console.error('Error parsing users.json:', e)
    process.exit(1)
  }

  console.log(`Found ${users.length} user(s) to process...`)

  for (const userData of users) {
    const { email, password, equipo } = userData

    if (!email || !password || !equipo) {
      console.warn(`Skipping invalid user entry: ${JSON.stringify(userData)}`)
      continue
    }

    console.log(`Processing user ${email} for team ${equipo}...`)

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          team: {
            connectOrCreate: {
              where: { name: equipo },
              create: { name: equipo }
            }
          }
        },
        include: {
          team: true
        }
      })
      console.log(`User ${email} created successfully.`)
    } catch (e: any) {
      if (e.code === 'P2002') {
        console.error(`User with email ${email} already exists.`)
      } else {
        console.error(`Error creating user ${email}:`, e)
      }
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
