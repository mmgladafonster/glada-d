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

function generatePageContent(service, location) {
    return `import { Metadata } from 'next';

interface PageProps {
  params: {
    service: string;
    location: string;
  };
}

export async function generateStaticParams() {
  const combinations = [
    { service: '${service}', location: '${location}' }
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
    title: \`\${capitalizedService} in \${capitalizedLocation}\`,
    description: \`Professional \${service} services in \${location}.\`,
  };
}

export default function ServiceLocationPage({ params }: PageProps) {
  const { service, location } = params;

  return (
    <div>
      <h1>Welcome to our \${service} page for \${location}!</h1>
      <p>Details about \${service} services in \${location} will go here.</p>
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

        const folderPath = path.join(appDirectory, `[${sanitizedService}]`, `[${sanitizedLocation}]`);
        const pageFilePath = path.join(folderPath, 'page.tsx');

        try {
            // Create directories recursively
            fs.mkdirSync(folderPath, { recursive: true });
            
            fs.writeFileSync(pageFilePath, generatePageContent(service, location), 'utf-8');
            console.log(`Populated ${pageFilePath}`);
        } catch (e) {
            console.error(`Error writing to ${pageFilePath}: ${e}`);
        }
    });
}

populatePages();
