#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Script to remove keys from translation files that don't exist in the French (reference) file.
 * This ensures all language files only contain keys that exist in the French translation.
 */

const fs = require("fs");
const path = require("path");

const LOCALES_DIR = path.join(__dirname, "..", "public", "locales");
const REFERENCE_LANG = "fr";
const REFERENCE_FILE = path.join(LOCALES_DIR, REFERENCE_LANG, "common.json");

/**
 * Recursively get all keys from an object with dot notation
 * e.g., { "Homepage": { "title": "..." } } => ["Homepage.title"]
 */
function getAllKeys(obj, prefix = "") {
  const keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

/**
 * Recursively remove keys from an object that are not in the reference set
 */
function removeExtraKeys(obj, referenceKeys, prefix = "") {
  const keysToDelete = [];

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      // Recursively process nested objects
      removeExtraKeys(obj[key], referenceKeys, fullKey);

      // If the nested object is now empty, mark it for deletion
      if (Object.keys(obj[key]).length === 0) {
        keysToDelete.push(key);
      }
    } else {
      // Check if this leaf key exists in reference
      if (!referenceKeys.has(fullKey)) {
        keysToDelete.push(key);
      }
    }
  }

  // Delete marked keys
  keysToDelete.forEach((key) => {
    delete obj[key];
  });

  return keysToDelete;
}

/**
 * Main function
 */
function main() {
  console.log("🔍 Reading reference file (French)...");

  // Read reference file
  const referenceContent = fs.readFileSync(REFERENCE_FILE, "utf8");
  const referenceData = JSON.parse(referenceContent);
  const referenceKeys = new Set(getAllKeys(referenceData));

  console.log(`✅ Found ${referenceKeys.size} keys in French translation\n`);

  // Get all language directories
  const langDirs = fs
    .readdirSync(LOCALES_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== REFERENCE_LANG)
    .map((dirent) => dirent.name);

  console.log(`📁 Processing ${langDirs.length} language files: ${langDirs.join(", ")}\n`);

  // Process each language file
  langDirs.forEach((lang) => {
    const langFile = path.join(LOCALES_DIR, lang, "common.json");

    if (!fs.existsSync(langFile)) {
      console.log(`⚠️  Skipping ${lang}: common.json not found`);
      return;
    }

    console.log(`🔧 Processing ${lang}/common.json...`);

    // Read language file
    const langContent = fs.readFileSync(langFile, "utf8");
    const langData = JSON.parse(langContent);

    // Get keys before removal
    const beforeKeys = getAllKeys(langData);

    // Remove extra keys
    const removedKeys = [];
    beforeKeys.forEach((key) => {
      if (!referenceKeys.has(key)) {
        removedKeys.push(key);
      }
    });

    if (removedKeys.length === 0) {
      console.log("   ✅ No extra keys found\n");
      return;
    }

    console.log(`   ❌ Found ${removedKeys.length} extra keys to remove:`);
    removedKeys.forEach((key) => console.log(`      - ${key}`));

    // Remove the keys
    removeExtraKeys(langData, referenceKeys);

    // Write back to file
    const updatedContent = JSON.stringify(langData, null, 2) + "\n";
    fs.writeFileSync(langFile, updatedContent, "utf8");

    console.log(`   💾 Updated ${lang}/common.json\n`);
  });

  console.log("✨ Done! All language files have been synchronized with French.");
}

// Run the script
try {
  main();
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
