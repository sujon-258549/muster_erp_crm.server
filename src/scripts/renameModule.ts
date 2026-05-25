import fs from 'fs';
import path from 'path';

const appDir = path.join(__dirname, '../', 'app', 'modules');

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

const renameModule = (oldName: string, newName: string): void => {
  const oldDir = path.join(appDir, oldName);
  const newDir = path.join(appDir, newName);

  if (!fs.existsSync(oldDir)) {
    console.error(`❌ Module "${oldName}" does not exist.`);
    process.exit(1);
  }

  // যদি আগে থেকেই newName module থাকে
  if (fs.existsSync(newDir)) {
    console.error(`⚠️ Module "${newName}" already exists.`);
    process.exit(1);
  }

  // STEP 1: ফোল্ডার rename করা
  fs.renameSync(oldDir, newDir);
  console.log(`📂 Renamed directory: ${oldDir} → ${newDir}`);

  // STEP 2: ফাইল কনটেন্টে replace করা
  const files = fs.readdirSync(newDir);
  files.forEach((file) => {
    const filePath = path.join(newDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    const oldCap = capitalize(oldName);
    const newCap = capitalize(newName);

    // Replace lowercase ও Capitalized নাম
    content = content
      .replace(new RegExp(oldName, 'g'), newName)
      .replace(new RegExp(oldCap, 'g'), newCap);

    // ফাইল নামেও replace করা
    let newFilePath = filePath;
    if (file.includes(oldName)) {
      newFilePath = path.join(newDir, file.replace(oldName, newName));
    }

    fs.writeFileSync(newFilePath, content, 'utf-8');

    if (filePath !== newFilePath) {
      fs.unlinkSync(filePath);
      console.log(`✏️  File renamed: ${filePath} → ${newFilePath}`);
    } else {
      console.log(`✅ File updated: ${filePath}`);
    }
  });
};

// ------------------------------
// CLI Usage
// ------------------------------
const oldName = process.argv[2];
const newName = process.argv[3];

if (!oldName || !newName) {
  console.error('❌ Usage: ts-node module-generator.ts <oldName> <newName>');
  process.exit(1);
}

renameModule(oldName, newName);
