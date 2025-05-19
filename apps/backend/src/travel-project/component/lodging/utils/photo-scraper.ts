import * as puppeteer from 'puppeteer';

export async function extractPhotosFromUrl(url: string): Promise<string[]> {
    if (url.includes('booking.com')) return await extractFromBooking(url);
    if (url.includes('airbnb.com')) return await extractFromAirbnb(url);
    return await extractGeneric(url);
  }

  async function extractFromBooking(url: string): Promise<string[]> {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
  
      const images = await page.evaluate(() => {
        const img1 = Array.from(document.querySelectorAll('img')).map(img => img.getAttribute('src'));
        const img2 = Array.from(document.querySelectorAll('img')).map(img => img.getAttribute('data-lazy'));
        const img3 = Array.from(document.querySelectorAll('source')).map(src => src.getAttribute('data-srcset'));
        return [...img1, ...img2, ...img3].filter(src => src?.startsWith('http'));
      });
  
      return Array.from(new Set(images.filter((src): src is string => src !== null))).slice(0, 10);
    } catch (err) {
      console.warn('Booking scraping failed', err);
      return [];
    } finally {
      await browser.close();
    }
  }
  
  async function extractFromAirbnb(url: string): Promise<string[]> {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await new Promise(resolve => setTimeout(resolve, 3000)); // Attendre chargement JS
  
      const images = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img'))
          .map(img => img.getAttribute('src'))
          .filter(src => src?.startsWith('https') && !src.includes('avatar') && !src.includes('icon'));
      });
  
      return Array.from(new Set(images.filter((src): src is string => src !== null))).slice(0, 10);
    } catch (err) {
      console.warn('Airbnb scraping failed', err);
      return [];
    } finally {
      await browser.close();
    }
  }
  
  async function extractGeneric(url: string): Promise<string[]> {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      await page.waitForSelector('img', { timeout: 5000 });
  
      const images = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img'))
          .map((img) => img.getAttribute('src'))
          .filter((src) =>
            src &&
            src.startsWith('http') &&
            !src.includes('base64') &&
            !src.includes('svg') &&
            !src.includes('logo') &&
            !src.includes('icon')
          );
      });
  
      return Array.from(new Set(images.filter((src): src is string => src !== null))).slice(0, 10);
    } catch (err) {
      console.warn('Generic scraping failed', err);
      return [];
    } finally {
      await browser.close();
    }
  }
  