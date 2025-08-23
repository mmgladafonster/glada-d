import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface PageProps {
  params: {
    service: string;
    location: string;
  };
}

interface CSVRecord {
  Keyword: string;
  Service: string;
  Location: string;
  Modifier: string;
  Keyword_Type: string;
  Search_Intent: string;
  Estimated_Difficulty: string;
  Content_Type_Suggestion: string;
}

function sanitizeString(str: string) {
  return str
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getCSVRecords(): CSVRecord[] {
  const csvFilePath = path.join(process.cwd(), 'gladafonster_programmatic_keywords.csv');
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
  return parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  }) as CSVRecord[];
}

export async function generateStaticParams() {
  const records = getCSVRecords();
  const uniqueServiceLocations = new Set();
  
  records.forEach(record => {
    if (record.Service && record.Location && record.Location.toLowerCase() !== 'all') {
      uniqueServiceLocations.add(`${record.Service}|${record.Location}`);
    }
  });

  return Array.from(uniqueServiceLocations as Set<string>).map((serviceLocation: string) => {
    const [service, location] = serviceLocation.split('|');
    return {
      service: sanitizeString(service),
      location: sanitizeString(location),
    };
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service, location } = await params;
  const records = getCSVRecords();
  
  // Find all records for this service and location combination
  const serviceRecords = records.filter(record => 
    sanitizeString(record.Service) === service && sanitizeString(record.Location) === location
  );
  
  // Generate Swedish title and description based on CSV data
  const capitalizedService = service.charAt(0).toUpperCase() + service.slice(1);
  const capitalizedLocation = location.charAt(0).toUpperCase() + location.slice(1);
  
  // Create a more descriptive title and description
  let title = `${capitalizedService} i ${capitalizedLocation} | Glada Fönster`;
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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'sv_SE',
    },
  };
}

export default async function ServiceLocationPage({ params }: PageProps) {
  const { service, location } = await params;
  const capitalizedService = service.charAt(0).toUpperCase() + service.slice(1);
  const capitalizedLocation = location.charAt(0).toUpperCase() + location.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{`${capitalizedService} i ${capitalizedLocation}`}</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          {`Vi på Glada Fönster erbjuder professionella ${service.toLowerCase()}-tjänster i ${location.toLowerCase()} och omnejd. Med över 35 års erfarenhet garanterar vi kvalitet och nöjda kunder.`}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{`Våra ${service.toLowerCase()}-tjänster i ${location.toLowerCase()}`}</h2>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>{`Professionell ${service.toLowerCase()} för både hem och företag`}</li>
          <li>{`Erfaret team med lokal kunskap i ${location.toLowerCase()}`}</li>
          <li>Miljövänliga rengöringsmedel och metoder</li>
          <li>Flexibla tider och snabb service</li>
          <li>100% nöjdkundsgaranti</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{`Varför välja oss för ${service.toLowerCase()} i ${location.toLowerCase()}?`}</h2>
        <p className="mb-4">
          {`Som lokal aktör i ${location.toLowerCase()} förstår vi de specifika behoven och utmaningarna med ${service.toLowerCase()} i just detta område. Vårt team är specialiserat på att leverera exceptionella resultat.`}
        </p>

        <div className="bg-blue-50 p-6 rounded-lg mt-8">
          <h3 className="text-xl font-semibold mb-3">Kontakta ons idag!</h3>
          <p className="mb-4">{`Få en kostnadsfri offert på ${service.toLowerCase()} i ${location.toLowerCase()}.`}</p>
          <p className="font-semibold">Telefon: <a href="tel:0728512420" className="text-blue-600 hover:underline">072-8512420</a></p>
        </div>
      </div>
    </div>
  );
}
