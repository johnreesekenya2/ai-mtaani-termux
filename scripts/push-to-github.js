
import { Octokit } from "@octokit/rest";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const REPO_OWNER = 'johnreesekenya2';
const REPO_NAME = 'ai-mtaani-project';
const PROJECT_ROOT = path.join(__dirname, '..');

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// Files and directories to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  'uploads',
  'attached_assets',
  '.env',
  '.DS_Store',
  'Thumbs.db',
  '*.log',
  'dist',
  'build',
  '.replit',
  'replit.md'
];

function shouldExclude(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(path.basename(filePath));
    }
    return filePath.includes(pattern);
  });
}

async function getAllFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (shouldExclude(relativePath)) {
      console.log(`⏭️  Skipping: ${relativePath}`);
      continue;
    }

    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...await getAllFiles(fullPath, baseDir));
    } else {
      files.push({
        path: relativePath.replace(/\\/g, '/'), // Normalize path separators
        fullPath: fullPath,
        size: stat.size
      });
    }
  }

  return files;
}

async function uploadFile(file) {
  try {
    let content;
    
    // Read file content
    if (file.path.match(/\.(png|jpg|jpeg|gif|ico|pdf|zip|tar|gz)$/i)) {
      // Binary files
      content = fs.readFileSync(file.fullPath).toString('base64');
    } else {
      // Text files
      content = Buffer.from(fs.readFileSync(file.fullPath, 'utf8')).toString('base64');
    }

    // Check if file exists
    let existingFileSha = null;
    try {
      const { data: existingFile } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: file.path,
      });

      if ('sha' in existingFile) {
        existingFileSha = existingFile.sha;
      }
    } catch (error) {
      if (error.status !== 404) {
        console.error(`Error checking existing file ${file.path}:`, error.message);
      }
    }

    // Upload or update file
    const fileData = {
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: file.path,
      message: `Update ${file.path} via AI Mtaani upload script`,
      content: content,
    };

    if (existingFileSha) {
      fileData.sha = existingFileSha;
    }

    await octokit.repos.createOrUpdateFileContents(fileData);
    console.log(`✅ Uploaded: ${file.path} (${(file.size / 1024).toFixed(1)}KB)`);

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to upload ${file.path}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting GitHub upload process...\n');
  console.log(`Repository: ${REPO_OWNER}/${REPO_NAME}`);
  console.log(`Project Root: ${PROJECT_ROOT}\n`);

  try {
    // Verify repository access
    console.log('🔍 Verifying repository access...');
    await octokit.repos.get({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });
    console.log('✅ Repository access confirmed\n');

    // Get all files
    console.log('📁 Scanning project files...');
    const files = await getAllFiles(PROJECT_ROOT);
    console.log(`Found ${files.length} files to upload\n`);

    // Filter out very large files (>100MB GitHub limit)
    const validFiles = files.filter(file => {
      if (file.size > 100 * 1024 * 1024) {
        console.log(`⚠️  Skipping large file: ${file.path} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
        return false;
      }
      return true;
    });

    console.log(`Uploading ${validFiles.length} files...\n`);

    // Upload files in batches to avoid overwhelming the API
    const batchSize = 5;
    let uploaded = 0;
    let failed = 0;

    for (let i = 0; i < validFiles.length; i += batchSize) {
      const batch = validFiles.slice(i, i + batchSize);
      
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(validFiles.length / batchSize)}`);
      
      const promises = batch.map(file => uploadFile(file));
      const results = await Promise.all(promises);
      
      uploaded += results.filter(r => r).length;
      failed += results.filter(r => !r).length;
      
      console.log(`Progress: ${uploaded}/${validFiles.length} uploaded, ${failed} failed`);
    }

    console.log('\n🎉 Upload complete!');
    console.log(`✅ Successfully uploaded: ${uploaded} files`);
    if (failed > 0) {
      console.log(`❌ Failed uploads: ${failed} files`);
    }
    console.log(`\n🔗 Repository URL: https://github.com/${REPO_OWNER}/${REPO_NAME}`);

  } catch (error) {
    console.error('💥 Upload failed:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
