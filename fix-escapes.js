import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.join(__dirname, 'components');

const fixFile = (filePath) => {
  if (fs.statSync(filePath).isDirectory()) {
    fs.readdirSync(filePath).forEach(file => fixFile(path.join(filePath, file)));
  } else if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    content = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${filePath}`);
    }
  }
};

fixFile(componentsDir);
