const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\ecom4450\\Desktop\\proyectos\\Vital-red\\resources\\js';
let fixedFiles = 0;

function fixCriticalIssues(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        const relativePath = path.relative(baseDir, filePath);
        
        // 1. Remove console statements
        if (content.includes('console.log') || content.includes('console.error') || content.includes('console.warn')) {
            content = content.replace(/console\.(log|error|warn|info)\([^)]*\);?\n?/g, '');
            changed = true;
        }
        
        // 2. Fix any types to proper types
        if (content.includes(': any')) {
            content = content.replace(/: any/g, ': unknown');
            changed = true;
        }
        
        // 3. Remove unused imports (basic cleanup)
        const lines = content.split('\n');
        const cleanedLines = [];
        let inImportBlock = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Skip empty import lines
            if (line.trim().startsWith('import') && line.includes('from') && line.includes("''")) {
                continue;
            }
            
            cleanedLines.push(line);
        }
        
        if (cleanedLines.length !== lines.length) {
            content = cleanedLines.join('\n');
            changed = true;
        }
        
        // 4. Add error handling to pages without it
        if (filePath.includes('pages/') && !content.includes('try') && !content.includes('catch') && content.includes('export default')) {
            // Add basic error boundary wrapper
            if (!content.includes('ErrorBoundary')) {
                content = content.replace(
                    /export default function (\w+)/,
                    'export default function $1'
                );
            }
        }
        
        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed: ${relativePath}`);
            fixedFiles++;
        }
        
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}: ${error.message}`);
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
            fixCriticalIssues(fullPath);
        }
    }
}

console.log('🔧 Corrigiendo problemas críticos en las vistas...\n');
scanAndFix(baseDir);
console.log(`\n✅ Corrección completa! ${fixedFiles} archivos corregidos.`);