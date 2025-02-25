#!/usr/bin/env node

// Print all environment variables
console.log("Environment Variables:");
console.log("=====================");
Object.entries(process.env)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });
