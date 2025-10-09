const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\ecom4450\\Desktop\\proyectos\\Vital-red\\resources\\js';
const errors = [];
const warnings = [];

function checkFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(baseDir, filePath);
        
        // Check imports
        const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
        let match;
        
        while ((match = importRegex.exec(content)) !== null) {
            const importPath = match[1];
            
            // Skip external packages
            if (!importPath.startsWith('@/') && !importPath.startsWith('./') && !importPath.startsWith('../')) {
                continue;
            }
            
            let resolvedPath;
            if (importPath.startsWith('@/')) {
                resolvedPath = path.join(baseDir, importPath.substring(2));
            } else {
                resolvedPath = path.resolve(path.dirname(filePath), importPath);
            }
            
            // Add extensions to check
            const extensions = ['.tsx', '.ts', '.jsx', '.js'];
            let exists = false;
            
            for (const ext of extensions) {
                if (fs.existsSync(resolvedPath + ext)) {
                    exists = true;
                    break;
                }
            }
            
            if (!exists && fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
                // Check for index files
                for (const ext of extensions) {
                    if (fs.existsSync(path.join(resolvedPath, 'index' + ext))) {
                        exists = true;
                        break;
                    }
                }
            }
            
            if (!exists) {
                errors.push(`${relativePath}: Import not found: ${importPath}`);
            }
        }
        
        // Check for Next.js specific code
        if (content.includes('"use client"') || content.includes("'use client'")) {
            warnings.push(`${relativePath}: Contains 'use client' directive`);
        }
        
        if (content.includes('next/')) {
            warnings.push(`${relativePath}: Contains Next.js imports`);
        }
        
    } catch (error) {
        errors.push(`Error reading ${filePath}: ${error.message}`);
    }
}

function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            scanDirectory(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
            checkFile(fullPath);
        }
    }
}

console.log('🔍 Checking imports and routes...\n');

scanDirectory(baseDir);

console.log('📊 RESULTS:');
console.log(`Files scanned: ${fs.readdirSync(baseDir, { recursive: true }).filter(f => f.endsWith('.tsx') || f.endsWith('.ts')).length}`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}\n`);

if (errors.length > 0) {
    console.log('❌ ERRORS:');
    errors.forEach(error => console.log(`  ${error}`));
    console.log('');
}

if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    warnings.forEach(warning => console.log(`  ${warning}`));
    console.log('');
}

if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All imports are valid!');
} else {
    console.log(`${errors.length === 0 ? '✅' : '❌'} Import check complete`);
}