import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function convertImage(inputPath, outputPath, width, height, maxSizeKb) {
    let quality = 85;
    let buffer;
    
    // First, resize the image to exactly the required dimensions
    let baseImage = sharp(inputPath).resize(width, height, {
        fit: 'cover',
        position: 'center'
    });

    while (quality >= 10) {
        buffer = await baseImage.webp({ quality }).toBuffer();
        if (buffer.length / 1024 <= maxSizeKb) {
            break;
        }
        quality -= 5;
    }

    fs.writeFileSync(outputPath, buffer);
    console.log(`Converted: ${outputPath}`);
    console.log(`Size: ${(buffer.length / 1024).toFixed(2)} KB (Quality: ${quality})`);
    
    if (buffer.length / 1024 > maxSizeKb) {
        console.warn(`FLAG: ${outputPath} exceeds max size target of ${maxSizeKb}KB!`);
    }
}

const [, , input, output, w, h, maxKb] = process.argv;
convertImage(input, output, parseInt(w), parseInt(h), parseInt(maxKb)).catch(err => {
    console.error(err);
    process.exit(1);
});
