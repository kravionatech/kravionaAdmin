import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, 'components');

const modules = [
  'Services',
  'Projects',
  'Testimonials',
  'Team',
  'Analytics',
  'Campaigns',
  'AuditLogs',
  'Notifications'
];

modules.forEach(mod => {
  const modDir = path.join(baseDir, mod);
  if (!fs.existsSync(modDir)) {
    fs.mkdirSync(modDir, { recursive: true });
  }

  const componentCode = `import React from 'react';

const ${mod} = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">${mod}</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your platform's ${mod.toLowerCase()}</p>
        
        <div className="mt-8 flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-400">Content for ${mod} will go here.</p>
        </div>
      </div>
    </div>
  );
};

export default ${mod};
`;

  fs.writeFileSync(path.join(modDir, `${mod}.jsx`), componentCode);
});

console.log('Components scaffolded successfully.');
