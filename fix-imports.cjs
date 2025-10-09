const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\ecom4450\\Desktop\\proyectos\\Vital-red\\resources\\js';

function fixImports(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        
        // Fix @/types import
        if (content.includes("from '@/types'")) {
            content = content.replace(/from ['"]@\/types['"]/g, "from '@/types'");
            changed = true;
        }
        
        // Remove 'use client' directives
        if (content.includes('"use client"') || content.includes("'use client'")) {
            content = content.replace(/^['"]use client['"][\r\n]+/gm, '');
            changed = true;
        }
        
        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed: ${path.relative(baseDir, filePath)}`);
        }
        
    } catch (error) {
        console.error(`Error fixing ${filePath}: ${error.message}`);
    }
}

function scanAndFix(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            scanAndFix(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            fixImports(fullPath);
        }
    }
}

console.log('🔧 Fixing imports and removing use client directives...\n');
scanAndFix(baseDir);
console.log('\n✅ Fix complete!');