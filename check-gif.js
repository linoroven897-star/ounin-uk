// Read GIF frame 0 using omggif (pure JS, no canvas needed)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, 'assets/images');

function extractGifFirstFrame(gifPath) {
  const data = fs.readFileSync(gifPath);
  // GIF89a header check
  const isGIF = data[0] === 0x47 && data[1] === 0x49 && data[2] === 0x46; // 'GIF'
  if (!isGIF) throw new Error('Not a GIF file');
  
  // Parse Logical Screen Descriptor
  const width = data[6] | (data[7] << 8);
  const height = data[8] | (data[9] << 8);
  const hasGCT = (data[10] & 0x80) !== 0;
  const gctSize = hasGCT ? (1 << ((data[10] & 0x07) + 1)) : 0;
  
  // Read Global Color Table
  const colorTable = [];
  if (hasGCT) {
    for (let i = 0; i < gctSize; i++) {
      const idx = 13 + i * 3;
      colorTable.push([data[idx], data[idx+1], data[idx+2]]);
    }
  }
  
  // Find first image descriptor (0x2C = Image Separator)
  let offset = 13 + gctSize * 3;
  while (offset < data.length) {
    if (data[offset] === 0x2C) {
      // Image Descriptor found
      const imgWidth = data[offset+1] | (data[offset+2] << 8);
      const imgHeight = data[offset+3] | (data[offset+4] << 8);
      const localCT = (data[offset+8] & 0x80) !== 0;
      const lctSize = localCT ? (1 << ((data[offset+8] & 0x07) + 1)) : 0;
      
      // Local color table
      const localColors = [];
      if (localCT) {
        for (let i = 0; i < lctSize; i++) {
          const idx = offset + 9 + i * 3;
          localColors.push([data[idx], data[idx+1], data[idx+2]]);
        }
      }
      const colors = localCT ? localColors : colorTable;
      
      // LZW minimum code size
      const minCodeSize = data[offset + 9 + (localCT ? lctSize * 3 : 0)];
      
      // Find image data end (0x21 0x3B = trailer, or next extension/image)
      let dataEnd = offset + 10 + (localCT ? lctSize * 3 : 0) + 1;
      let subBlockSize = data[dataEnd];
      while (subBlockSize > 0 && dataEnd < data.length) {
        dataEnd += 1 + subBlockSize;
        subBlockSize = data[dataEnd];
      }
      
      console.log(`${path.basename(gifPath)}: ${imgWidth}x${imgHeight}, ${colors.length} colors, data offset ${offset}`);
      return { width: imgWidth, height: imgHeight, colors };
    } else if (data[offset] === 0x21) {
      // Extension block - skip it
      offset++;
      const extType = data[offset];
      if (extType === 0xF9) {
        // Graphics Control Extension (4 bytes after 0xF9 0x04)
        offset += 1 + 4 + 1;
      } else {
        // Skip other extension
        offset++;
        let subBlockSize = data[offset++];
        while (subBlockSize > 0) {
          offset += subBlockSize;
          subBlockSize = data[offset++];
        }
      }
    } else if (data[offset] === 0x3B) {
      break; // Trailer
    } else {
      offset++;
    }
  }
  return null;
}

const gifs = ['feature-1.gif', 'feature-2.gif', 'feature-3.gif'];
for (const gif of gifs) {
  const result = extractGifFirstFrame(path.join(imgDir, gif));
  console.log(result);
}
