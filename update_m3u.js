const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Set realistic headers
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0 Safari/537.36'
  });

  const lines = fs.readFileSync('prova.m3u', 'utf8').split('\n');
  const output = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('http')) {
      try {
        await page.goto(trimmed, { waitUntil: 'networkidle0', timeout: 15000 });
        output.push(page.url()); // Get final URL after all redirects
      } catch (err) {
        console.error('Failed to load:', trimmed, err.message);
        output.push(trimmed); // Keep original on failure
      }
    } else {
      output.push(line);
    }
  }

  await browser.close();
  fs.writeFileSync('ipradioita_new.m3u', output.join('\n'));
})();   
