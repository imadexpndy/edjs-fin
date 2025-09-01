const fs = require('fs');
const path = require('path');

// Create a simple build script that copies static files and builds React app
console.log('Building EDJS Platform...');

// Build React app first
const { execSync } = require('child_process');

try {
  console.log('Building React app...');
  execSync('npm run build:react', { stdio: 'inherit' });
  
  console.log('Copying static website files...');
  // Static files are already in root, no need to copy
  
  console.log('Build complete!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
