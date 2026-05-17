const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const lines = fs.readFileSync('prova.m3u', 'utf8').split('\n');
  const output = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('http')) {
      try {
        await page.goto(trimmed, { waitUntil: 'networkidle0', timeout: 15000 });
        output.push(page.url());
      } catch (err) {
        console.error('Failed:', trimmed);
        output.push(trimmed);
      }
    } else {
      output.push(line);
    }
  }

  await browser.close();

  // Write file and force exit
  try {
    fs.writeFileSync('ipradioita_new.m3u', output.join('\n'));
    console.log('File written successfully');
  } catch (err) {
    console.error('Write failed:', err.message);
  }

  process.exit(0); // Ensure clean exit
})();   
