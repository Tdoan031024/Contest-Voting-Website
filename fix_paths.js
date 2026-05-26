const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'apps', 'web', 'app');

function fixDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixDir(full);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      let content = fs.readFileSync(full, 'utf8');
      let newContent = content;
      
      // Fix /_next/image -> /images/image
      newContent = newContent.split('/_next/image').join('/images/image');
      // Fix /_next/static/media/ -> /images/
      newContent = newContent.split('/_next/static/media/').join('/images/');
      // Fix /_next/static/css/ -> /css/
      newContent = newContent.split('/_next/static/css/').join('/css/');
      
      if (newContent !== content) {
        fs.writeFileSync(full, newContent, 'utf8');
        console.log('Fixed: ' + path.relative(appDir, full));
      }
    }
  }
}

fixDir(appDir);
console.log('All done!');
