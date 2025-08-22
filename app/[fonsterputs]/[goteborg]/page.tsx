import { Metadata } from 'next';

interface PageProps {
  params: {
    service: string;
    location: string;
  };
}

export async function generateStaticParams() {
  const combinations = [
    { service: 'fönsterputs', location: 'Göteborg' }
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
    title: `${capitalizedService} in ${capitalizedLocation}`,
    description: `Professional ${service} services in ${location}.`,
  };
}

export default function ServiceLocationPage({ params }: PageProps) {
  const { service, location } = params;

  return (
    <div>
      <h1>Welcome to our ${service} page for ${location}!</h1>
      <p>Details about ${service} services in ${location} will go here.</p>
    </div>
  );
}
