// Page Filtering Logic for Glada Fönster SEO Recovery
// Determines which service-location combinations should be generated

import { getValidCombinations, locationDatabase, serviceDatabase } from '../lib/locationData';

// Define allowed cities (major cities for initial rollout)
export const allowedCities = [
  'goteborg',
  'kungsbacka', 
  'varberg',
  'molndal',
  'kungalv'
];

// Define allowed services (main services)
export const allowedServices = [
  'fonsterputsning',
  'kommersiell-stadning'
];

// Interface for valid page combination
export interface ValidPageCombination {
  service: string;
  location: string;
  priority: number; // 1 = highest priority, 5 = lowest
}

// Generate valid combinations with priority scoring
export function generateValidCombinations(): ValidPageCombination[] {
  const combinations: ValidPageCombination[] = [];
  
  for (const service of allowedServices) {
    for (const location of allowedCities) {
      // Ensure both service and location exist in our databases
      if (serviceDatabase[service] && locationDatabase[location]) {
        const priority = calculatePriority(service, location);
        combinations.push({
          service,
          location,
          priority
        });
      }
    }
  }
  
  // Sort by priority (highest first)
  return combinations.sort((a, b) => a.priority - b.priority);
}

// Calculate priority based on business importance
function calculatePriority(service: string, location: string): number {
  let priority = 3; // Default priority
  
  // Higher priority for main service
  if (service === 'fonsterputsning') {
    priority -= 1;
  }
  
  // Higher priority for major cities
  if (location === 'goteborg') {
    priority -= 2; // Highest priority for Göteborg
  } else if (location === 'kungsbacka' || location === 'varberg') {
    priority -= 1; // High priority for coastal cities
  }
  
  // Ensure priority is within valid range
  return Math.max(1, Math.min(5, priority));
}

// Get combinations for specific priority level
export function getCombinationsByPriority(targetPriority: number): ValidPageCombination[] {
  return generateValidCombinations().filter(combo => combo.priority === targetPriority);
}

// Get high-priority combinations (priority 1-2)
export function getHighPriorityCombinations(): ValidPageCombination[] {
  return generateValidCombinations().filter(combo => combo.priority <= 2);
}

// Get all combinations for gradual rollout
export function getAllCombinations(): ValidPageCombination[] {
  return generateValidCombinations();
}

// Convert combination to URL-safe format
export function combinationToUrlParams(combination: ValidPageCombination): { service: string; location: string } {
  const locationData = locationDatabase[combination.location];
  const serviceData = serviceDatabase[combination.service];
  
  if (!locationData || !serviceData) {
    throw new Error(`Invalid combination: ${combination.service}/${combination.location}`);
  }
  
  // Convert city name to URL-safe format
  const urlLocation = locationData.city
    .toLowerCase()
    .replace('ö', 'o')
    .replace('ä', 'a')
    .replace('å', 'a')
    .replace(/\s+/g, '-');
    
  return {
    service: serviceData.slug,
    location: urlLocation
  };
}

// Validate if a combination is allowed
export function isValidCombination(service: string, location: string): boolean {
  const combinations = generateValidCombinations();
  return combinations.some(combo => 
    combo.service === service && combo.location === location
  );
}

// Get rollout phases for gradual implementation
export function getRolloutPhases(): {
  phase1: ValidPageCombination[];
  phase2: ValidPageCombination[];
  phase3: ValidPageCombination[];
} {
  const allCombinations = generateValidCombinations();
  
  return {
    phase1: allCombinations.filter(combo => combo.priority === 1), // Göteborg + main service
    phase2: allCombinations.filter(combo => combo.priority === 2), // Major cities + main service  
    phase3: allCombinations.filter(combo => combo.priority >= 3)   // All remaining combinations
  };
}

// Export for Next.js generateStaticParams
export function getStaticParams(): Array<{ service: string; location: string }> {
  const combinations = generateValidCombinations();
  return combinations.map(combinationToUrlParams);
}

// Debug function to log all combinations
export function logCombinations(): void {
  const combinations = generateValidCombinations();
  console.log('Valid page combinations:');
  console.log('======================');
  
  combinations.forEach(combo => {
    const urlParams = combinationToUrlParams(combo);
    const locationData = locationDatabase[combo.location];
    const serviceData = serviceDatabase[combo.service];
    
    console.log(`Priority ${combo.priority}: ${serviceData.name} in ${locationData.city}`);
    console.log(`  URL: /tjanster/${urlParams.service}/${urlParams.location}`);
    console.log('');
  });
  
  const phases = getRolloutPhases();
  console.log(`Phase 1: ${phases.phase1.length} pages`);
  console.log(`Phase 2: ${phases.phase2.length} pages`);
  console.log(`Phase 3: ${phases.phase3.length} pages`);
  console.log(`Total: ${combinations.length} pages`);
}