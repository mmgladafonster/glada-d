const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync'); // Using sync for simplicity in a script

const csvFilePath = 'gladafonster_programmatic_keywords.csv';
const appDirectory = 'app'; // Assuming your app directory is at the root

function sanitizeString(str) {
    return str
        .toLowerCase()
        .replace(/å/g, 'a')
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end
}

async function generateRoutes() {
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');

    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true
    });

    const uniqueServices = new Set();
    const uniqueLocations = new Set();

    records.forEach(record => {
        if (record.Service && record.Location && record.Location.toLowerCase() !== 'all') {
            uniqueServices.add(record.Service);
            uniqueLocations.add(record.Location);
        }
    });

    const serviceLocationPairs = [];
    uniqueServices.forEach(service => {
        uniqueLocations.forEach(location => {
            // Only add pairs that actually exist in the CSV
            const exists = records.some(record =>
                record.Service === service && record.Location === location
            );
            if (exists) {
                serviceLocationPairs.push({ service, location });
            }
        });
    });

    console.log('// Commands to create directories and page.tsx files:');
    console.log('// Run these commands in your terminal in ACT MODE.');

    const createdPaths = [];

    for (const pair of serviceLocationPairs) {
        const sanitizedService = sanitizeString(pair.service);
        const sanitizedLocation = sanitizeString(pair.location);

        const folderPath = path.join(appDirectory, `[${sanitizedService}]`, `[${sanitizedLocation}]`);
        const pageFilePath = path.join(folderPath, 'page.tsx');

        // Commands to create directory and file
        console.log(`mkdir -p ${folderPath}`);
        console.log(`touch ${pageFilePath}`);

        createdPaths.push(pageFilePath);
    }

    console.log('\n// Example page.tsx content for dynamic routes:');
    console.log(`
// app/[service]/[location]/page.tsx
import { Metadata } from 'next';

interface PageProps {
  params: {
    service: string;
    location: string;
  };
}

export async function generateStaticParams() {
  // In a real application, you would fetch this data from your CSV or a database
  // For this example, we'll use a hardcoded list based on the CSV content.
  // You would run the Node.js script to get the actual combinations.
  const combinations = [
    // Example:
    { service: 'fonsterputs', location: 'askim' },
    { service: 'hemstadning', location: 'goteborg' },
    // ... more combinations generated from your CSV
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
`);

    console.log('\n// Summary of created paths:');
    createdPaths.forEach(p => console.log(p));
}

generateRoutes();
