import Storage from './storage';
import dotenv from 'dotenv';

async function test(): Promise<boolean> {
  const storage = await Storage.init();
  if (!storage) {
    return false;
  }
  storage.downloadFile(id);
  return true;
}

dotenv.config();
const result = await test();
console.log(`Success: ${result}`);
