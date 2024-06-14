/* eslint-disable no-console */
import { writeFile } from 'fs/promises'
import * as path from 'path'

if (process.argv.length !== 3) {
  console.error('Please provide migration name as argument.')
  process.exit(1)
}

function generateMigrationFilename(description: string) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9T]/g, '')
    .slice(0, -3)

  return `${timestamp}Z-${description}.ts`
}

async function createFile(filePath: string) {
  try {
    await writeFile(filePath, '')
    console.log(`File "${filePath}" has been created.`)
  } catch (error) {
    console.error('Error creating file:', error)
    process.exit(1)
  }
}

const dirName = path.dirname(process.argv[1])
const filePath = path.join(
  `${dirName}/migrations`,
  generateMigrationFilename(process.argv[2])
)

createFile(filePath)
process.exit(0)
