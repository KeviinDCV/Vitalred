const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\ecom4450\\Desktop\\proyectos\\Vital-red\\resources\\js';
const errors = [];
const warnings = [];
const viewIssues = [];

function analyzeView(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(baseDir, filePath);
        
        // Check for common React/JSX issues
        const issues = [];
        
        // 1. Missing export default
        if (!content.includes('export default') && filePath.includes('pages/')) {
            issues.push('Missing export default function');
        }
        
        // 2. Missing Head component for pages
        if (filePath.includes('pages/') && !content.includes('import { Head }') && !content.includes('<Head')) {
            issues.push('Missing Head component import/usage');
        }
        
        // 3. Missing layout wrapper for pages
        if (filePath.includes('pages/') && !content.includes('Layout') && !filePath.includes('auth/') && !filePath.includes('welcome')) {
            issues.push('Missing Layout wrapper');
        }
        
        // 4. Unused imports
        const importMatches = content.match(/import\s+.*?\s+from\s+['"][^'"]+['"]/g) || [];
        importMatches.forEach(importLine => {
            const match = importLine.match(/import\s+(?:\{([^}]+)\}|\*\s+as\s+(\w+)|(\w+))/);
            if (match) {
                const imported = match[1] || match[2] || match[3];
                if (imported && imported.includes(',')) {
                    imported.split(',').forEach(item => {
                        const cleanItem = item.trim();
                        if (cleanItem && !content.includes(cleanItem.replace(/\s+as\s+\w+/, '').trim())) {
                            issues.push(`Unused import: ${cleanItem}`);
                        }
                    });
                } else if (imported && !content.includes(imported.trim())) {
                    issues.push(`Unused import: ${imported}`);
                }
            }
        });
        
        // 5. Console.log statements
        if (content.includes('console.log') || content.includes('console.error')) {
            issues.push('Contains console statements');
        }
        
        // 6. Hardcoded strings that should be constants
        const hardcodedStrings = content.match(/"[^"]{20,}"/g) || [];
        if (hardcodedStrings.length > 3) {
            issues.push('Contains many hardcoded strings');
        }
        
        // 7. Missing error boundaries
        if (filePath.includes('pages/') && !content.includes('try') && !content.includes('catch')) {
            issues.push('No error handling');
        }
        
        // 8. Large component (>500 lines)
        const lineCount = content.split('\n').length;
        if (lineCount > 500) {
            issues.push(`Large component: ${lineCount} lines`);
        }
        
        // 9. Missing TypeScript types
        if (content.includes('any') || content.includes(': {}')) {
            issues.push('Using any type or empty object type');
        }
        
        // 10. Inline styles
        if (content.includes('style={{')) {
            issues.push('Contains inline styles');
        }
        
        if (issues.length > 0) {
            viewIssues.push({
                file: relativePath,
                issues: issues,
                lines: lineCount
            });
        }
        
    } catch (error) {
        errors.push(`Error analyzing ${filePath}: ${error.message}`);
    }
}

function scanViews(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            scanViews(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            analyzeView(fullPath);
        }
    }
}

console.log('🔍 Analizando todas las vistas en busca de fallas...\n');

scanViews(baseDir);

console.log('📊 RESULTADOS DEL ANÁLISIS:');
console.log(`Archivos analizados: ${fs.readdirSync(baseDir, { recursive: true }).filter(f => f.endsWith('.tsx') || f.endsWith('.ts')).length}`);
console.log(`Vistas con problemas: ${viewIssues.length}`);
console.log(`Errores: ${errors.length}\n`);

if (errors.length > 0) {
    console.log('❌ ERRORES:');
    errors.forEach(error => console.log(`  ${error}`));
    console.log('');
}

if (viewIssues.length > 0) {
    console.log('⚠️  PROBLEMAS EN VISTAS:');
    viewIssues.forEach(view => {
        console.log(`\n📄 ${view.file} (${view.lines} líneas):`);
        view.issues.forEach(issue => console.log(`  • ${issue}`));
    });
    console.log('');
}

if (viewIssues.length === 0 && errors.length === 0) {
    console.log('✅ Todas las vistas están en buen estado!');
} else {
    console.log(`${viewIssues.length === 0 ? '✅' : '⚠️'} Análisis de vistas completo`);
}