const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\ecom4450\\Desktop\\proyectos\\Vital-red\\resources\\js';

function fixChartImports(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        
        // Remove recharts imports and components
        if (content.includes('recharts')) {
            content = content.replace(/import.*from ['"]recharts['"];?\n/g, '');
            content = content.replace(/<ResponsiveContainer[\s\S]*?<\/ResponsiveContainer>/g, '<div className="h-[300px] flex items-center justify-center bg-muted rounded-lg"><p className="text-muted-foreground">Gráfico no disponible</p></div>');
            content = content.replace(/<LineChart[\s\S]*?<\/LineChart>/g, '<div className="h-[300px] flex items-center justify-center bg-muted rounded-lg"><p className="text-muted-foreground">Gráfico no disponible</p></div>');
            content = content.replace(/<BarChart[\s\S]*?<\/BarChart>/g, '<div className="h-[300px] flex items-center justify-center bg-muted rounded-lg"><p className="text-muted-foreground">Gráfico no disponible</p></div>');
            changed = true;
        }
        
        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed charts: ${path.relative(baseDir, filePath)}`);
        }
        
    } catch (error) {
        console.error(`Error fixing ${filePath}: ${error.message}`);
    }
}

function scanAndFixCharts(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            scanAndFixCharts(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            fixChartImports(fullPath);
        }
    }
}

console.log('🔧 Fixing chart imports...\n');
scanAndFixCharts(baseDir);
console.log('\n✅ Charts fixed!');