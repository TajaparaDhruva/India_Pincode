/**
 * CSV Import Script for PIN Code Data
 * ------------------------------------
 * Usage: node utils/importCSV.js <path-to-csv-file>
 * Example: node utils/importCSV.js ../data/pincode.csv
 *
 * This script reads a CSV file, cleans the data, and bulk-inserts
 * it into the MongoDB "pincodes" collection.
 *
 * Expected CSV columns (case-insensitive matching):
 *   officename, pincode, officeType, Deliverystatus,
 *   divisionname, regionname, circlename, Taluk,
 *   Districtname, statename
 *
 * If your CSV has different column names, edit the mapRow() function below.
 */

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Use Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const Pincode = require("../models/Pincode");

// ---- Column Mapping ----
// Maps CSV column headers (lowercased) → our schema fields.
// Edit this if your CSV has different headers.
const COLUMN_MAP = {
  officename: "officeName",
  pincode: "pincode",
  officetype: "branchType",
  deliverystatus: "deliveryStatus",
  divisionname: "divisionName",
  regionname: "regionName",
  circlename: "circleName",
  taluk: "taluk",
  districtname: "district",
  statename: "state",
  // Also support exact camelCase from CSV
  officeType: "branchType",
  deliveryStatus: "deliveryStatus",
  divisionName: "divisionName",
  regionName: "regionName",
  circleName: "circleName",
  districtName: "district",
  stateName: "state",
};

function clean(value) {
  if (!value || value === "NA" || value === "N/A" || value === "null") {
    return "";
  }
  return value.toString().trim().toUpperCase();
}

function mapRow(row) {
  const doc = {};
  const keys = Object.keys(row);

  for (const [csvCol, schemaField] of Object.entries(COLUMN_MAP)) {
    // Try exact match first, then case-insensitive
    const matchedKey = keys.find(
      (k) => k === csvCol || k.toLowerCase().trim() === csvCol.toLowerCase()
    );
    if (matchedKey && !doc[schemaField]) {
      doc[schemaField] = clean(row[matchedKey]);
    }
  }

  // Skip rows without pincode or officeName
  if (!doc.pincode || !doc.officeName) return null;

  return doc;
}

async function importCSV(filePath) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ File not found: ${absolutePath}`);
    process.exit(1);
  }

  console.log(`📂 Reading CSV: ${absolutePath}`);

  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }

  const rows = [];
  let skipped = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(absolutePath)
      .pipe(csv())
      .on("data", (row) => {
        const mapped = mapRow(row);
        if (mapped) {
          rows.push(mapped);
        } else {
          skipped++;
        }
      })
      .on("end", async () => {
        console.log(`📊 Parsed ${rows.length} valid rows (${skipped} skipped)`);

        if (rows.length === 0) {
          console.log("⚠️  No valid rows to insert.");
          await mongoose.disconnect();
          return resolve();
        }

        // Clear existing data
        console.log("🗑️  Clearing existing collection...");
        await Pincode.deleteMany({});

        // Bulk insert in batches of 5000
        const BATCH_SIZE = 5000;
        let inserted = 0;

        for (let i = 0; i < rows.length; i += BATCH_SIZE) {
          const batch = rows.slice(i, i + BATCH_SIZE);
          await Pincode.insertMany(batch, { ordered: false });
          inserted += batch.length;
          console.log(
            `   ✅ Inserted ${inserted} / ${rows.length} (${Math.round(
              (inserted / rows.length) * 100
            )}%)`
          );
        }

        console.log(`\n🎉 Import complete! ${inserted} documents inserted.`);
        await mongoose.disconnect();
        resolve();
      })
      .on("error", (err) => {
        console.error("❌ CSV read error:", err.message);
        reject(err);
      });
  });
}

// --- Run ---
const csvFilePath = process.argv[2];
if (!csvFilePath) {
  console.log("Usage: node utils/importCSV.js <path-to-csv-file>");
  console.log("Example: node utils/importCSV.js ../data/pincode.csv");
  process.exit(1);
}

importCSV(csvFilePath).catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
