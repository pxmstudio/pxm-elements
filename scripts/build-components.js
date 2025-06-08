#!/usr/bin/env node

/**
 * Simple component build script
 * Automatically discovers and builds all components
 */

import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

// Get all component directories
function getComponents() {
  const srcDir = join(process.cwd(), 'src');
  return readdirSync(srcDir)
    .filter(item => {
      const itemPath = join(srcDir, item);
      return statSync(itemPath).isDirectory() && 
             !['core', 'types'].includes(item) && // Skip utility directories
             readdirSync(itemPath).includes('index.ts'); // Must have index.ts
    });
}

// Build UMD version of a component
function buildComponent(component) {
  console.log(`📦 Building ${component}...`);
  try {
    execSync(`vite build --config vite.config.umd.ts --mode ${component}`, { 
      stdio: 'inherit' 
    });
    console.log(`✅ Built ${component}`);
  } catch (error) {
    console.error(`❌ Failed to build ${component}:`, error.message);
    process.exit(1);
  }
}

// Main build process
function main() {
  const buildType = process.argv[2]; // 'esm', 'umd', or undefined for both
  
  if (buildType === 'esm' || !buildType) {
    console.log('🏗️  Building ESM...');
    execSync('tsc && vite build --config vite.config.esm.ts', { stdio: 'inherit' });
  }
  
  if (buildType === 'umd' || !buildType) {
    console.log('🏗️  Building UMD components...');
    
    // Build main index first
    buildComponent('index');
    
    // Build all individual components
    const components = getComponents();
    console.log(`Found components: ${components.join(', ')}`);
    
    for (const component of components) {
      buildComponent(component);
    }
  }
  
  console.log('🎉 Build complete!');
}

main(); 