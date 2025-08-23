const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const csvFilePath = 'gladafonster_programmatic_keywords.csv';
const appDirectory = 'app';

function sanitizeString(str) {
    return str
        .toLowerCase()
        .replace(/å/g, 'a')
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function generatePageContent(service, location, records) {
    // Find all records for this service and location combination
    const serviceRecords = records.filter(record => 
        record.Service === service && record.Location === location
    );
    
    // Get the main service record (first one found)
    const mainRecord = serviceRecords[0];
    
    // Generate Swedish title and description based on CSV data
    const swedishService = service.charAt(0).toUpperCase() + service.slice(1);
    const swedishLocation = location.charAt(0).toUpperCase() + location.slice(1);
    
    // Create a more descriptive title and description
    let title = `${swedishService} i ${swedishLocation} | Glada Fönster`;
    let description = `Professionell ${service.toLowerCase()} i ${location.toLowerCase()}.`;
    
    // Check if we have modifier keywords to enhance the title
    const modifierKeywords = serviceRecords
        .filter(record => record.Modifier && record.Modifier !== 'None')
        .map(record => record.Modifier.toLowerCase());
    
    if (modifierKeywords.length > 0) {
        const uniqueModifiers = [...new Set(modifierKeywords)];
        title = `${uniqueModifiers.join(' och ')} ${service.toLowerCase()} i ${location.toLowerCase()} | Glada Fönster`;
        description = `Erbjuder ${uniqueModifiers.join(', ')} ${service.toLowerCase()} tjänster i ${location.toLowerCase()}.`;
    }

    return `import { Metadata } from 'next';

interface PageProps {
  params: {
    service: string;
    location: string;
  };
}

export async function generateStaticParams() {
  // This should return all possible service-location combinations
  // The actual implementation would fetch from your CSV or database
  const combinations = [
    // This is just a placeholder - in a real implementation, you would
    // generate this list dynamically from your CSV data
    { service: 'fonsterputs', location: 'askim' },
    { service: 'fonsterputs', location: 'billdal' },
    { service: 'fonsterputs', location: 'bua' },
    { service: 'fonsterputs', location: 'frillesas' },
    { service: 'fonsterputs', location: 'goteborg' },
    { service: 'fonsterputs', location: 'kullavik' },
    { service: 'fonsterputs', location: 'kungalv' },
    { service: 'fonsterputs', location: 'kungsbacka' },
    { service: 'fonsterputs', location: 'molndal' },
    { service: 'fonsterputs', location: 'saro' },
    { service: 'fonsterputs', location: 'torslanda' },
    { service: 'fonsterputs', location: 'varberg' },
    { service: 'fonsterputs', location: 'varobacka' },
    { service: 'fonsterputs', location: 'asa' },
    { service: 'fonsterputs', location: 'askloster' },
    // Add all other combinations from your CSV here
  ];

  return combinations.map(combo => ({
    service: combo.service,
    location: combo.location,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service, location } = params;
  const capitalizedService = service.charAt(0).toUpperCase() + service.slice(1);
  const capitalizedLocation = location.charAt(0).toUpperCase() + location.slice(1);

  return {
    title: \`${title}\`,
    description: \`${description}\`,
    openGraph: {
      title: \`${title}\`,
      description: \`${description}\`,
      type: 'website',
      locale: 'sv_SE',
    },
  };
}

export default function ServiceLocationPage({ params }: PageProps) {
  const { service, location } = params;
  const capitalizedService = service.charAt(0).toUpperCase() + service.slice(1);
  const capitalizedLocation = location.charAt(0).toUpperCase() + location.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{\`\${capitalizedService} i \${capitalizedLocation}\`}</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          {\`Vi på Glada Fönster erbjuder professionella \${service.toLowerCase()}-tjänster i \${location.toLowerCase()} och omnejd. Med över 35 års erfarenhet garanterar vi kvalitet och nöjda kunder.\`}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{\`Våra \${service.toLowerCase()}-tjänster i \${location.toLowerCase()}\`}</h2>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>{\`Professionell \${service.toLowerCase()} för både hem och företag\`}</li>
          <li>{\`Erfaret team med lokal kunskap i \${location.toLowerCase()}\`}</li>
          <li>Miljövänliga rengöringsmedel och metoder</li>
          <li>Flexibla tider och snabb service</li>
          <li>100% nöjdkundsgaranti</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{\`Varför välja oss för \${service.toLowerCase()} i \${location.toLowerCase()}?\`}</h2>
        <p className="mb-4">
          {\`Som lokal aktör i \${location.toLowerCase()} förstår vi de specifika behoven och utmaningarna med \${service.toLowerCase()} i just detta område. Vårt team är specialiserat på att leverera exceptionella resultat.\`}
        </p>

        <div className="bg-blue-50 p-6 rounded-lg mt-8">
          <h3 className="text-xl font-semibold mb-3">Kontakta oss idag!</h3>
          <p className="mb-4">{\`Få en kostnadsfri offert på \${service.toLowerCase()} i \${location.toLowerCase()}.\`}</p>
          <p className="font-semibold">Telefon: <a href="tel:0728512420" className="text-blue-600 hover:underline">072-8512420</a></p>
        </div>
      </div>
    </div>
  );
}
`;
}

function populatePages() {
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true
    });

    const uniqueServiceLocations = new Set();
    records.forEach(record => {
        if (record.Service && record.Location && record.Location.toLowerCase() !== 'all') {
            uniqueServiceLocations.add(`${record.Service}|${record.Location}`);
        }
    });

    uniqueServiceLocations.forEach(serviceLocation => {
        const [service, location] = serviceLocation.split('|');
        const sanitizedService = sanitizeString(service);
        const sanitizedLocation = sanitizeString(location);

        // Use a single dynamic directory structure to avoid Next.js conflicts
        const folderPath = path.join(appDirectory, 'services', `[service]`, `[location]`);
        const pageFilePath = path.join(folderPath, 'page.tsx');

        try {
            // Create directories recursively
            fs.mkdirSync(folderPath, { recursive: true });
            
            fs.writeFileSync(pageFilePath, generatePageContent(service, location, records), 'utf-8');
            console.log(`Populated ${pageFilePath}`);
        } catch (e) {
            console.error(`Error writing to ${pageFilePath}: ${e}`);
        }
    });
}

populatePages();
