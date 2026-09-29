import { mkdir } from 'node:fs/promises';

async function ensureDir(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true });
    console.log(`Directory ready at: ${dirPath}`);
  } catch (err) {
    console.error(`Failed to create directory:`, err);
  }
}


export {ensureDir}