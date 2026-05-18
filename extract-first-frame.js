import Omggif from 'omggif';
import { Jimp, JimpMime } from 'jimp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, 'assets/images');

async function extractFirstFrame(gifName) {
  const gifPath = path.join(imgDir, gifName);
  const pngName = gifName.replace('.gif', '-static.png');
  const pngPath = path.join(imgDir, pngName);

  const data = fs.readFileSync(gifPath);
  const reader = new Omggif.GifReader(data);
  
  console.log(`${gifName}: ${reader.width}x${reader.height}, ${reader.numFrames()} frames`);

  const { width, height } = reader;
  const bgra = Buffer.alloc(width * height * 4);
  reader.decodeAndBlitFrameBGRA(0, bgra);

  // BGRA -> RGBA
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    rgba[i*4]   = bgra[i*4+2]; // R = B
    rgba[i*4+1] = bgra[i*4+1]; // G = G
    rgba[i*4+2] = bgra[i*4];   // B = R
    rgba[i*4+3] = bgra[i*4+3]; // A = A
  }

  const image = new Jimp({ width, height });
  image.bitmap.data = rgba;

  const buf = await image.getBuffer(JimpMime.png);
  fs.writeFileSync(pngPath, buf);

  const gifSize = fs.statSync(gifPath).size;
  const pngSize = fs.statSync(pngPath).size;
  console.log(`  -> ${pngName}: ${(pngSize/1024).toFixed(0)} KB (GIF was ${(gifSize/1024).toFixed(0)} KB)\n`);
}

const gifs = ['feature-1.gif', 'feature-2.gif', 'feature-3.gif'];
for (const gif of gifs) {
  await extractFirstFrame(gif);
}
