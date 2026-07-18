import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  const content = await page.content();
  console.log('HTML length:', content.length);
  
  const cardsHidden = await page.evaluate(() => {
    const cards = document.querySelectorAll('article[data-card-state]');
    if (cards.length === 0) return 'No cards found';
    return Array.from(cards).map(c => window.getComputedStyle(c).opacity);
  });
  console.log('Cards opacity:', cardsHidden);
  
  await browser.close();
})();
