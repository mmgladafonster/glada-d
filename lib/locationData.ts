// Location and Service Data for Glada Fönster SEO Recovery
// This file contains structured data for generating high-quality, location-specific content

export interface LocationData {
  city: string;
  region: string;
  lat: number;
  lng: number;
  postalCode: string;
  climateFactors: string[];
  buildingTypes: string[];
  localLandmarks: string[];
  serviceChallenges: string[];
  seasonalPatterns: string[];
  recommendedFrequency: number; // weeks between cleanings
}

export interface ServiceData {
  name: string;
  slug: string;
  baseDescription: string;
  serviceSpecifics: string[];
}

// Location Database - Major cities in Gothenburg region
export const locationDatabase: Record<string, LocationData> = {
  goteborg: {
    city: "Göteborg",
    region: "Västra Götalands län",
    lat: 57.7089,
    lng: 11.9746,
    postalCode: "411",
    climateFactors: [
      "Västkustens saltluft som påverkar fönster",
      "Höga luftfuktighet från havet",
      "Frekventa regnskurar året runt",
      "Vinterstormar med saltvatten"
    ],
    buildingTypes: [
      "Historiska byggnader i centrum",
      "Moderna kontorskomplex",
      "Traditionella göteborgska villor",
      "Höghus i Backa och Bergsjön"
    ],
    localLandmarks: [
      "Göteborgs hamn",
      "Liseberg",
      "Ullevi",
      "Göteborgs universitet"
    ],
    serviceChallenges: [
      "Saltavlagringar från havsluft",
      "Smuts från trafik i centrum",
      "Industriell föroreningar från hamnen",
      "Fågelspillning från havsfåglar"
    ],
    seasonalPatterns: [
      "Vinter: Extra rengöring pga salt och smuts",
      "Vår: Pollenrengöring från parker",
      "Sommar: Regelbunden underhåll",
      "Höst: Lövrengöring och förberedelse för vinter"
    ],
    recommendedFrequency: 4
  },
  
  kungsbacka: {
    city: "Kungsbacka",
    region: "Hallands län",
    lat: 57.4878,
    lng: 12.0745,
    postalCode: "434",
    climateFactors: [
      "Kustnära läge med saltluft",
      "Mildare klimat än inlandet",
      "Regn från västliga vindar",
      "Havsbris som för med sig salt"
    ],
    buildingTypes: [
      "Villaområden i Kungsbacka centrum",
      "Moderna radhus",
      "Äldre trävillor",
      "Kommersiella byggnader längs E6"
    ],
    localLandmarks: [
      "Kungsbacka torg",
      "Särö badplats",
      "Tjolöholms slott",
      "Kungsbacka museum"
    ],
    serviceChallenges: [
      "Saltpåverkan från Kattegatt",
      "Sandpartiklar från stränderna",
      "Växande förort med byggdamm",
      "Trafikföroreningar från E6"
    ],
    seasonalPatterns: [
      "Vinter: Saltskydd och extra rengöring",
      "Vår: Sandrengöring efter vintern",
      "Sommar: Intensiv rengöring pga turism",
      "Höst: Förberedelse inför vintersäsongen"
    ],
    recommendedFrequency: 6
  },

  varberg: {
    city: "Varberg",
    region: "Hallands län", 
    lat: 57.1057,
    lng: 12.2502,
    postalCode: "432",
    climateFactors: [
      "Exponerat läge mot Kattegatt",
      "Starka havsvindar",
      "Hög luftfuktighet",
      "Salthaltig luft året runt"
    ],
    buildingTypes: [
      "Historiska byggnader i gamla stan",
      "Moderna bostadsområden",
      "Industribyggnader vid hamnen",
      "Semesterboenden längs kusten"
    ],
    localLandmarks: [
      "Varbergs fästning",
      "Kallbadhuset",
      "Varbergs hamn",
      "Apelviken strand"
    ],
    serviceChallenges: [
      "Intensiv saltpåverkan från havet",
      "Sandstormar från stränderna",
      "Korrosion från saltluft",
      "Fågelspillning från kustfåglar"
    ],
    seasonalPatterns: [
      "Vinter: Kraftig saltexponering",
      "Vår: Omfattande rengöring efter vintern", 
      "Sommar: Frekvent underhåll pga turister",
      "Höst: Skydd mot kommande vinterstormar"
    ],
    recommendedFrequency: 4
  },

  molndal: {
    city: "Mölndal",
    region: "Västra Götalands län",
    lat: 57.6554,
    lng: 12.0134,
    postalCode: "431",
    climateFactors: [
      "Inlandsklimat med mindre saltpåverkan",
      "Skyddad från direkta havsvindar",
      "Måttlig luftfuktighet",
      "Regnskugga från höjder"
    ],
    buildingTypes: [
      "Moderna kontorsbyggnader",
      "Villaområden på höjderna",
      "Industriområden",
      "Studentbostäder nära Chalmers"
    ],
    localLandmarks: [
      "Mölndals museum",
      "Gunnebo slott",
      "Chalmers tekniska högskola",
      "Mölndals centrum"
    ],
    serviceChallenges: [
      "Föroreningar från närliggande industri",
      "Trafiksmuts från E6/E20",
      "Pollen från skogsområden",
      "Byggdamm från expansion"
    ],
    seasonalPatterns: [
      "Vinter: Mindre saltproblem, mer smuts",
      "Vår: Pollenrengöring från skog",
      "Sommar: Regelbundet underhåll",
      "Höst: Lövrengöring från träd"
    ],
    recommendedFrequency: 8
  },

  kungalv: {
    city: "Kungälv",
    region: "Västra Götalands län",
    lat: 57.8708,
    lng: 11.9801,
    postalCode: "442",
    climateFactors: [
      "Flodmynning med fuktig luft",
      "Påverkan från Göta älv",
      "Skyddad från direkta havsvindar",
      "Måttlig saltpåverkan"
    ],
    buildingTypes: [
      "Historiska byggnader i gamla stan",
      "Moderna villaområden",
      "Industribyggnader vid älven",
      "Kommersiella fastigheter"
    ],
    localLandmarks: [
      "Bohus fästning",
      "Kungälvs torg",
      "Göta älv",
      "Marstrand (närliggande)"
    ],
    serviceChallenges: [
      "Fukt från älven",
      "Industriell föroreningar",
      "Måttlig saltpåverkan",
      "Smuts från båttrafik"
    ],
    seasonalPatterns: [
      "Vinter: Fuktproblem från älven",
      "Vår: Rengöring efter vintersmuts",
      "Sommar: Regelbundet underhåll",
      "Höst: Förberedelse för fuktiga månader"
    ],
    recommendedFrequency: 6
  }
};

// Service Database - Main services offered
export const serviceDatabase: Record<string, ServiceData> = {
  fonsterputsning: {
    name: "Fönsterputsning",
    slug: "fonsterputsning", 
    baseDescription: "Professionell fönsterputsning för hem och företag",
    serviceSpecifics: [
      "In- och utvändig rengöring",
      "Miljövänliga rengöringsmedel",
      "Professionell utrustning",
      "Försäkrad service",
      "Garanterad kvalitet"
    ]
  },
  
  "kommersiell-stadning": {
    name: "Kommersiell Städning",
    slug: "kommersiell-stadning",
    baseDescription: "Kommersiell städning och fastighetsskötsel för företag",
    serviceSpecifics: [
      "Kontorsstädning",
      "Fönsterputsning för företag", 
      "Fasadrengöring",
      "Regelbundna städscheman",
      "Anpassade lösningar"
    ]
  }
};

// Helper function to get valid service-location combinations
export function getValidCombinations(): Array<{ service: string; location: string }> {
  const services = Object.keys(serviceDatabase);
  const locations = Object.keys(locationDatabase);
  
  const combinations: Array<{ service: string; location: string }> = [];
  
  for (const service of services) {
    for (const location of locations) {
      combinations.push({ service, location });
    }
  }
  
  return combinations;
}

// Helper function to get location data by slug
export function getLocationData(locationSlug: string): LocationData | null {
  return locationDatabase[locationSlug] || null;
}

// Helper function to get service data by slug  
export function getServiceData(serviceSlug: string): ServiceData | null {
  return serviceDatabase[serviceSlug] || null;
}