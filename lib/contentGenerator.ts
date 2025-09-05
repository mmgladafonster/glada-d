// Content Generation System for Glada Fönster SEO Pages
// Generates unique, location-specific content for each service-location combination

import { LocationData, ServiceData } from './locationData';

export interface PageMetadata {
  title: string;
  description: string;
  canonical: string;
}

export interface LocalBusinessSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  address: {
    "@type": string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    "@type": string;
    latitude: number;
    longitude: number;
  };
  telephone: string;
  url: string;
  serviceArea: string[];
  priceRange: string;
  openingHours: string[];
}

// Generate page metadata (title, description, canonical)
export function generatePageMetadata(
  service: ServiceData,
  location: LocationData,
  baseUrl: string = "https://gladafonster.se"
): PageMetadata {
  const title = `${service.name} ${location.city} - Professionell Service | Glada Fönster`;
  
  const description = `Professionell ${service.name.toLowerCase()} i ${location.city}. ` +
    `Specialiserade på ${location.serviceChallenges[0].toLowerCase()}. ` +
    `Kontakta oss för offert - 072-8512420`;

  const canonical = `${baseUrl}/tjanster/${service.slug}/${location.city.toLowerCase().replace('ö', 'o').replace('ä', 'a')}`;

  return { title, description, canonical };
}

// Generate LocalBusiness JSON-LD schema
export function generateLocalBusinessSchema(
  service: ServiceData,
  location: LocationData
): LocalBusinessSchema {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Glada Fönster - ${service.name} ${location.city}`,
    description: `${service.baseDescription} i ${location.city} och omgivning`,
    address: {
      "@type": "PostalAddress",
      addressLocality: location.city,
      addressRegion: location.region,
      postalCode: location.postalCode,
      addressCountry: "SE"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: location.lat,
      longitude: location.lng
    },
    telephone: "072-8512420",
    url: "https://gladafonster.se",
    serviceArea: [location.city, location.region],
    priceRange: "$$",
    openingHours: [
      "Mo-Fr 08:00-17:00",
      "Sa 09:00-15:00"
    ]
  };
}

// Generate location-specific content sections
export function generateLocationContent(
  service: ServiceData,
  location: LocationData
): {
  heroSection: string;
  challengesSection: string;
  servicesSection: string;
  frequencySection: string;
  localSection: string;
} {
  const heroSection = `
    <h1>${service.name} i ${location.city} - Professionell Kvalitet</h1>
    <p>Välkommen till Glada Fönster, din pålitliga partner för ${service.name.toLowerCase()} i ${location.city}. 
    Med över 35 års samlad erfarenhet förstår vi de unika utmaningarna som ${location.city}s klimat och miljö medför för fönsterunderhåll.</p>
  `;

  const challengesSection = `
    <h2>Lokala Utmaningar i ${location.city}</h2>
    <p>I ${location.city} möter vi specifika utmaningar som kräver expertkunskap:</p>
    <ul>
      ${location.serviceChallenges.map(challenge => `<li>${challenge}</li>`).join('')}
    </ul>
    <p>Våra erfarna tekniker är välbekanta med dessa förhållanden och använder anpassade metoder för att säkerställa bästa resultat.</p>
  `;

  const servicesSection = `
    <h2>Våra ${service.name} Tjänster i ${location.city}</h2>
    <p>${service.baseDescription} anpassad för ${location.city}s specifika behov:</p>
    <ul>
      ${service.serviceSpecifics.map(spec => `<li>${spec}</li>`).join('')}
    </ul>
    <p>Vi arbetar med alla typer av byggnader som är vanliga i ${location.city}:</p>
    <ul>
      ${location.buildingTypes.map(type => `<li>${type}</li>`).join('')}
    </ul>
  `;

  const frequencySection = `
    <h2>Rekommenderad Frekvens för ${location.city}</h2>
    <p>Baserat på ${location.city}s klimatförhållanden rekommenderar vi ${service.name.toLowerCase()} var ${location.recommendedFrequency}:e vecka för optimalt resultat.</p>
    <div class="seasonal-info">
      <h3>Säsongsanpassad Service</h3>
      <ul>
        ${location.seasonalPatterns.map(pattern => `<li>${pattern}</li>`).join('')}
      </ul>
    </div>
  `;

  const localSection = `
    <h2>Lokalkännedom i ${location.city}</h2>
    <p>Som lokalt företag känner vi ${location.city} väl. Vi servar regelbundet fastigheter nära:</p>
    <ul>
      ${location.localLandmarks.map(landmark => `<li>${landmark}</li>`).join('')}
    </ul>
    <p>Vår närhet till dessa områden gör att vi kan erbjuda snabb service och förstår de specifika behoven för olika delar av ${location.city}.</p>
  `;

  return {
    heroSection,
    challengesSection,
    servicesSection,
    frequencySection,
    localSection
  };
}

// Generate climate-specific content
export function generateClimateContent(location: LocationData): string {
  return `
    <h2>Klimatanpassad Service i ${location.city}</h2>
    <p>${location.city}s klimat påverkar fönstren på flera sätt:</p>
    <ul>
      ${location.climateFactors.map(factor => `<li>${factor}</li>`).join('')}
    </ul>
    <p>Vi anpassar våra metoder och produkter efter dessa förhållanden för att ge dig bästa möjliga resultat året runt.</p>
  `;
}

// Generate call-to-action section
export function generateCTASection(service: ServiceData, location: LocationData): string {
  return `
    <div class="cta-section">
      <h2>Boka ${service.name} i ${location.city} Idag</h2>
      <p>Redo att få kristallklara fönster? Kontakta Glada Fönster för en kostnadsfri offert.</p>
      <div class="contact-info">
        <p><strong>Telefon:</strong> <a href="tel:0728512420">072-8512420</a></p>
        <p><strong>Serviceområde:</strong> ${location.city} och omgivning</p>
        <p><strong>Svarstid:</strong> Samma dag för akuta behov</p>
      </div>
      <div class="guarantees">
        <h3>Våra Garantier</h3>
        <ul>
          <li>100% nöjdhetsgaranti</li>
          <li>Fullständigt försäkrad service</li>
          <li>Miljövänliga produkter</li>
          <li>Professionell utrustning</li>
          <li>35+ års samlad erfarenhet</li>
        </ul>
      </div>
    </div>
  `;
}

// Main function to generate complete page content
export function generatePageContent(
  service: ServiceData,
  location: LocationData
): string {
  const content = generateLocationContent(service, location);
  const climateContent = generateClimateContent(location);
  const ctaContent = generateCTASection(service, location);

  return `
    ${content.heroSection}
    ${content.challengesSection}
    ${content.servicesSection}
    ${climateContent}
    ${content.frequencySection}
    ${content.localSection}
    ${ctaContent}
  `;
}