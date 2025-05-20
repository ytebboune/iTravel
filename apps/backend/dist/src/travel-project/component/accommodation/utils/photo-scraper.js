"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPhotosFromUrl = extractPhotosFromUrl;
const puppeteer = __importStar(require("puppeteer"));
async function extractPhotosFromUrl(url) {
    if (url.includes('booking.com'))
        return await extractFromBooking(url);
    if (url.includes('airbnb.com'))
        return await extractFromAirbnb(url);
    return await extractGeneric(url);
}
async function extractFromBooking(url) {
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
        return Array.from(new Set(images.filter((src) => src !== null))).slice(0, 10);
    }
    catch (err) {
        console.warn('Booking scraping failed', err);
        return [];
    }
    finally {
        await browser.close();
    }
}
async function extractFromAirbnb(url) {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await new Promise(resolve => setTimeout(resolve, 3000));
        const images = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('img'))
                .map(img => img.getAttribute('src'))
                .filter(src => src?.startsWith('https') && !src.includes('avatar') && !src.includes('icon'));
        });
        return Array.from(new Set(images.filter((src) => src !== null))).slice(0, 10);
    }
    catch (err) {
        console.warn('Airbnb scraping failed', err);
        return [];
    }
    finally {
        await browser.close();
    }
}
async function extractGeneric(url) {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
        await page.waitForSelector('img', { timeout: 5000 });
        const images = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('img'))
                .map((img) => img.getAttribute('src'))
                .filter((src) => src &&
                src.startsWith('http') &&
                !src.includes('base64') &&
                !src.includes('svg') &&
                !src.includes('logo') &&
                !src.includes('icon'));
        });
        return Array.from(new Set(images.filter((src) => src !== null))).slice(0, 10);
    }
    catch (err) {
        console.warn('Generic scraping failed', err);
        return [];
    }
    finally {
        await browser.close();
    }
}
//# sourceMappingURL=photo-scraper.js.map