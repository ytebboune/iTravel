const https = require('https');
const fs = require('fs');
const path = require('path');

const fonts = {
  'Inter': {
    'Regular': 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.ttf',
    'Medium': 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.ttf',
    'SemiBold': 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.ttf',
    'Bold': 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.ttf'
  },
  'Poppins': {
    'Regular': 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.ttf',
    'Medium': 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlEA.ttf',
    'SemiBold': 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlEA.ttf',
    'Bold': 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlEA.ttf'
  }
};

const fontDir = path.join(__dirname, '../assets/fonts');

// Create fonts directory if it doesn't exist
if (!fs.existsSync(fontDir)) {
  fs.mkdirSync(fontDir, { recursive: true });
}

// Download each font
Object.entries(fonts).forEach(([family, weights]) => {
  Object.entries(weights).forEach(([weight, url]) => {
    const filename = `${family}-${weight}.ttf`;
    const filepath = path.join(fontDir, filename);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${filename}`);
        });
      } else {
        console.error(`Failed to download ${filename}: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      console.error(`Error downloading ${filename}:`, err.message);
    });
  });
}); 