import puppeteer from "puppeteer";

export async function extractTransportInfoFromUrl(url: string): Promise<Partial<{
    type: string;
    departure: string;
    arrival: string;
    date: string;
    duration: string;
    price: number;
    company: string;
    flightNumber: string;
  }>> {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
  
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('body', { timeout: 5000 });
  
      const pageContent = await page.content();
      const text = pageContent.replace(/\n+/g, ' ').replace(/\s+/g, ' ');
  
      const extract = (regex: RegExp) => {
        const match = text.match(regex);
        return match ? match[1].trim() : undefined;
      };

      // Patterns améliorés pour la détection des villes
      const departure = extract(/(?:Depart\w*|From|Origin|Départ):?\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)?(?:\s[A-Z][a-z]+)?)/i);
      const arrival = extract(/(?:Arriv\w*|To|Destination|Arrivée):?\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)?(?:\s[A-Z][a-z]+)?)/i);
      
      // Patterns pour différents formats de date
      const date = extract(/(?:Date|Departure Date|Date de départ):?\s*(\d{1,2}[\s/-]\w+[\s/-]\d{4}|\d{4}[\s/-]\d{1,2}[\s/-]\d{1,2})/i);
      
      // Pattern pour la durée avec différents formats
      const duration = extract(/(?:Duration|Temps de trajet|Durée):?\s*(\d+h(?:\s*\d+min)?|\d+\s*min)/i);
      
      // Pattern pour le prix avec différents formats et devises
      const priceStr = extract(/(?:Price|Prix|Tarif):?\s*[€$]?\s*(\d+(?:[.,]\d+)?)/i);
      const price = priceStr ? parseFloat(priceStr.replace(',', '.')) : undefined;
      
      // Pattern pour la compagnie
      const company = extract(/(?:Company|Compagnie|Carrier|Transporteur):?\s*([A-Za-z\s]+)/i);
      
      // Pattern pour le numéro de vol/train
      const flightNumber = extract(/(?:Flight|Numéro de vol|Train|Train number):?\s*([A-Z0-9]+)/i);
  
      // Détection améliorée du type de transport
      const type = url.toLowerCase().includes('train') || text.toLowerCase().includes('train') ? 'TRAIN'
                 : url.toLowerCase().includes('flight') || url.toLowerCase().includes('air') || url.toLowerCase().includes('skyscanner') || text.toLowerCase().includes('flight') ? 'FLIGHT'
                 : url.toLowerCase().includes('bus') || text.toLowerCase().includes('bus') ? 'BUS'
                 : 'OTHER';
  
      return {
        type,
        departure,
        arrival,
        date,
        duration,
        price,
        company,
        flightNumber,
      };
    } catch (err) {
      console.warn(`Scraping failed for ${url}`, err);
      return {};
    } finally {
      await browser.close();
    }
  }