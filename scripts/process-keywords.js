const fs = require("fs")
const path = require("path")
const { parse } = require("csv-parse/sync")

const csvFilePath = path.resolve(__dirname, "../gladafonster_programmatic_keywords.csv")
const jsonFilePath = path.resolve(__dirname, "../lib/keywords.json")

function generateSlug(keyword) {
  return keyword
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

try {
  const csvFileContent = fs.readFileSync(csvFilePath, "utf8")
  const records = parse(csvFileContent, {
    columns: true,
    skip_empty_lines: true,
  })

  const keywordsData = records.map((record) => ({
    ...record,
    slug: generateSlug(record.Keyword),
  }))

  fs.writeFileSync(jsonFilePath, JSON.stringify(keywordsData, null, 2))

  console.log(`✅ Successfully processed ${keywordsData.length} keywords.`)
  console.log(`✅ Data saved to: ${jsonFilePath}`)
} catch (error) {
  console.error("❌ Error processing the CSV file:", error)
}
