const sharp = require('sharp');
const path = require('path');

const sourceLogo = path.join(__dirname, '../public/logo.png');
const publicDir = path.join(__dirname, '../public');
const appDir = path.join(__dirname, '../src/app');

async function generateIcons() {
  console.log('Generating favicon sizes from:', sourceLogo);

  const targets = [
    { dest: path.join(publicDir, 'favicon-16x16.png'), size: 16 },
    { dest: path.join(publicDir, 'favicon-32x32.png'), size: 32 },
    { dest: path.join(publicDir, 'favicon-48x48.png'), size: 48 },
    { dest: path.join(publicDir, 'apple-touch-icon.png'), size: 180 },
    { dest: path.join(publicDir, 'android-chrome-192x192.png'), size: 192 },
    { dest: path.join(publicDir, 'android-chrome-512x512.png'), size: 512 },
    { dest: path.join(publicDir, 'favicon.ico'), size: 32 },
    { dest: path.join(appDir, 'icon.png'), size: 192 },
    { dest: path.join(appDir, 'favicon.ico'), size: 32 },
  ];

  for (const t of targets) {
    await sharp(sourceLogo)
      .resize(t.size, t.size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(t.dest);
    console.log(`Generated: ${t.dest} (${t.size}x${t.size})`);
  }
  console.log('All favicon icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
