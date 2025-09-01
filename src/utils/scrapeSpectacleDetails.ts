import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

interface SpectacleDetails {
  title: string;
  description: string;
  synopsis: string;
  duration: number;
  ageRange: string;
  price: number;
  venue: string;
  dates: string;
  images: string[];
  gallery: string[];
  category: string;
  language: string;
  cast: string[];
  technicalInfo: string;
}

export async function scrapeSpectacleDetails(spectacleName: string): Promise<SpectacleDetails | null> {
  try {
    // Map spectacle names to their HTML files
    const spectacleFiles: { [key: string]: string } = {
      'Charlotte': 'spectacle-charlotte.html',
      'تارا إلى القمر': 'spectacle-tara-sur-la-lune.html',
      'L\'Eau-Là': 'spectacle-leau-la.html',
      'L\'Enfant de l\'Arbre': 'spectacle-lenfant-de-larbre.html',
      'Alice chez les Merveilles': 'spectacle-alice-chez-les-merveilles.html',
      'الأمير الصغير': 'spectacle-le-petit-prince.html',
      'Simple Comme Bonjour': 'spectacle-simple-comme-bonjour.html',
      'Estuaires': 'spectacle-estevanico.html',
      'Antigone': 'spectacle-antigone.html',
      'Casse-Noisette': 'spectacle-casse-noisette.html'
    };

    const fileName = spectacleFiles[spectacleName];
    if (!fileName) {
      console.error(`No HTML file found for spectacle: ${spectacleName}`);
      return null;
    }

    const filePath = path.join('/Users/Imad/Downloads/edjs-site1', fileName);
    
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return null;
    }

    const htmlContent = fs.readFileSync(filePath, 'utf-8');
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    // Extract title
    const titleElement = document.querySelector('h1, .spectacle-title, .title');
    const title = titleElement?.textContent?.trim() || spectacleName;

    // Extract description from meta or main content
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const descriptionElement = document.querySelector('.description, .synopsis, .spectacle-description, p');
    const description = descriptionMeta?.getAttribute('content') || 
                      descriptionElement?.textContent?.trim() || '';

    // Extract synopsis (longer description)
    const synopsisElements = document.querySelectorAll('p');
    let synopsis = '';
    synopsisElements.forEach(p => {
      const text = p.textContent?.trim() || '';
      if (text.length > synopsis.length && text.length > 100) {
        synopsis = text;
      }
    });

    // Extract images from various selectors
    const images: string[] = [];
    const gallery: string[] = [];
    
    const imageElements = document.querySelectorAll('img');
    imageElements.forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.includes('logo') && !src.includes('icon')) {
        if (src.includes('gallery') || img.classList.contains('gallery')) {
          gallery.push(src);
        } else {
          images.push(src);
        }
      }
    });

    // Extract duration from text content
    let duration = 60; // default
    const durationMatch = htmlContent.match(/(\d+)\s*(?:min|minutes?)/i);
    if (durationMatch) {
      duration = parseInt(durationMatch[1]);
    }

    // Extract age range
    let ageRange = '4-16 ans';
    const ageMatch = htmlContent.match(/(\d+)[-\s]*(?:à|to|-)?\s*(\d+)\s*ans?/i);
    if (ageMatch) {
      ageRange = `${ageMatch[1]}-${ageMatch[2]} ans`;
    }

    // Extract price
    let price = 50; // default
    const priceMatch = htmlContent.match(/(\d+)\s*(?:DH|MAD|dirhams?)/i);
    if (priceMatch) {
      price = parseInt(priceMatch[1]);
    }

    // Extract venue
    let venue = 'Théâtre Mohammed V';
    const venueMatch = htmlContent.match(/(?:Théâtre|Theatre|Opéra|Centre)\s+[A-Za-z\s]+/i);
    if (venueMatch) {
      venue = venueMatch[0];
    }

    // Extract dates
    let dates = '2025-2026';
    const dateMatch = htmlContent.match(/(?:Jan|Fév|Mar|Avr|Mai|Jun|Jul|Aoû|Sep|Oct|Nov|Déc)[a-z]*\s*[-–]\s*(?:Jan|Fév|Mar|Avr|Mai|Jun|Jul|Aoû|Sep|Oct|Nov|Déc)[a-z]*\s*\d{4}/i);
    if (dateMatch) {
      dates = dateMatch[0];
    }

    // Extract category/genre
    let category = 'Théâtre Jeunesse';
    if (htmlContent.includes('musical') || htmlContent.includes('Musical')) category = 'Musical';
    if (htmlContent.includes('conte') || htmlContent.includes('Conte')) category = 'Conte';
    if (htmlContent.includes('ballet') || htmlContent.includes('Ballet')) category = 'Ballet';
    if (htmlContent.includes('marionnettes') || htmlContent.includes('Marionnettes')) category = 'Marionnettes';

    // Extract language
    let language = 'Français';
    if (htmlContent.includes('Arabe') || htmlContent.includes('العربية')) language = 'Arabe';
    if (htmlContent.includes('Bilingue') || htmlContent.includes('bilingue')) language = 'Bilingue';

    // Extract cast information
    const cast: string[] = [];
    const castElements = document.querySelectorAll('.cast, .acteur, .artiste');
    castElements.forEach(element => {
      const name = element.textContent?.trim();
      if (name) cast.push(name);
    });

    // Extract technical information
    const techElements = document.querySelectorAll('.technique, .technical, .info-technique');
    const technicalInfo = Array.from(techElements)
      .map(el => el.textContent?.trim())
      .filter(Boolean)
      .join(' ');

    return {
      title,
      description,
      synopsis: synopsis || description,
      duration,
      ageRange,
      price,
      venue,
      dates,
      images: [...new Set(images)], // Remove duplicates
      gallery: [...new Set(gallery)],
      category,
      language,
      cast,
      technicalInfo
    };

  } catch (error) {
    console.error(`Error scraping spectacle details for ${spectacleName}:`, error);
    return null;
  }
}
