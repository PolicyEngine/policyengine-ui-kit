/**
 * Convert .ts data files to .json by extracting the JSON object literal,
 * then update loaders.ts to import from .json instead of .ts.
 *
 * Run: node convert-data.mjs
 *
 * For each .ts file, finds the '= {' assignment, extracts the JSON object
 * (stripping the TS wrapper), writes it as .json, validates it parses,
 * then deletes the original .ts file.
 */
import fs from 'fs';
import path from 'path';

const dataDir = 'src/visualization/data';

const tsFiles = [
  'congressionalDistrictsGeo.ts',
  'congressionalDistrictsHex.ts',
  'ukConstituenciesGeo.ts',
  'ukConstituenciesHex.ts',
  'stateSenateDistrictsGeo.ts',
  'stateHouseDistrictsGeo.ts',
];

const exportNames = {
  'congressionalDistrictsGeo.ts': 'CONGRESSIONAL_DISTRICTS_GEO',
  'congressionalDistrictsHex.ts': 'CONGRESSIONAL_DISTRICTS_HEX',
  'ukConstituenciesGeo.ts': 'UK_CONSTITUENCIES_GEO',
  'ukConstituenciesHex.ts': 'UK_CONSTITUENCIES_HEX',
  'stateSenateDistrictsGeo.ts': 'STATE_SENATE_DISTRICTS_GEO',
  'stateHouseDistrictsGeo.ts': 'STATE_HOUSE_DISTRICTS_GEO',
};

let allOk = true;

for (const tsFile of tsFiles) {
  const tsPath = path.join(dataDir, tsFile);
  const jsonFile = tsFile.replace('.ts', '.json');
  const jsonPath = path.join(dataDir, jsonFile);

  console.log(`Processing ${tsFile}...`);

  const content = fs.readFileSync(tsPath, 'utf8');

  // Find the '= {' which starts the JSON/object literal
  const idx = content.indexOf('= {');
  if (idx === -1) {
    console.error(`  ERROR: could not find '= {' in ${tsFile}`);
    allOk = false;
    continue;
  }

  // Extract from '{' onwards (skip '= ')
  let jsonStr = content.substring(idx + 2).trim();

  // Remove trailing semicolon
  if (jsonStr.endsWith(';')) {
    jsonStr = jsonStr.slice(0, -1);
  }

  // Validate JSON
  try {
    JSON.parse(jsonStr);
    console.log(`  Valid JSON (${jsonStr.length} bytes)`);
  } catch (e) {
    console.error(`  INVALID JSON: ${e.message}`);
    allOk = false;
    continue;
  }

  // Write .json
  fs.writeFileSync(jsonPath, jsonStr);
  console.log(`  Written to ${jsonPath}`);

  // Delete original .ts
  fs.unlinkSync(tsPath);
  console.log(`  Deleted ${tsPath}`);
}

if (!allOk) {
  console.error('\nSome files had errors!');
  process.exit(1);
}

// Update loaders.ts to import from .json files with default exports
console.log('\nUpdating loaders.ts...');

const loadersPath = path.join(dataDir, 'loaders.ts');
let loadersContent = fs.readFileSync(loadersPath, 'utf8');

for (const tsFile of tsFiles) {
  const baseName = tsFile.replace('.ts', '');
  const exportName = exportNames[tsFile];
  // Replace: const mod = await import('./foo');  return mod.FOO;
  // With:    const mod = await import('./foo.json');  return mod.default as ...;
  loadersContent = loadersContent.replace(
    `import('./${baseName}');\n  return mod.${exportName};`,
    `import('./${baseName}.json');\n  return mod.default as typeof mod.default;`,
  );
}

fs.writeFileSync(loadersPath, loadersContent);
console.log('  Updated loaders.ts');

console.log('\nAll files converted successfully.');
console.log('You can now run: bun run build');
