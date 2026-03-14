export interface Opportunity {
  id: string;
  type: 'blood' | 'plasma' | 'sperm' | 'egg' | 'research';
  name: string;
  location: string;
  address: string;
  distance: number;
  compensation: number;
  timeRequired: string;
  verified: boolean;
  availableSlots: number;
  eligibility: string[];
  latitude: number;
  longitude: number;
  providerName: string;
}

export const opportunityTypes = {
  blood: { label: 'Blood Donation', avgCompensation: '$50-75', impact: 'Save up to 3 lives per donation' },
  plasma: { label: 'Plasma Donation', avgCompensation: '$100-125', impact: 'Help burn victims and immune disorders' },
  sperm: { label: 'Sperm Donation', avgCompensation: '$150-200', impact: 'Help families build their dreams' },
  egg: { label: 'Egg Donation', avgCompensation: '$8,000-15,000', impact: 'Give the gift of life to hopeful parents' },
  research: { label: 'Medical Research', avgCompensation: '$75-500', impact: 'Advance medical science and treatment' },
};

export const mockOpportunities: Opportunity[] = [
  { id: '1', type: 'blood', name: 'Community Blood Drive', location: 'Red Cross Blood Center', address: '1423 Market Street', distance: 1.2, compensation: 75, timeRequired: '45 minutes', verified: true, availableSlots: 8, eligibility: ['Age 17+', 'Weight 110+ lbs', 'Good health'], latitude: 37.7749, longitude: -122.4194, providerName: 'American Red Cross' },
  { id: '2', type: 'plasma', name: 'Plasma Donation Appointment', location: 'BioLife Plasma Services', address: '845 Valencia Street', distance: 2.3, compensation: 120, timeRequired: '90 minutes', verified: true, availableSlots: 12, eligibility: ['Age 18-69', 'Weight 110+ lbs', 'Valid ID'], latitude: 37.7599, longitude: -122.4213, providerName: 'BioLife Plasma Services' },
  { id: '3', type: 'research', name: 'Sleep Study Participant', location: 'UCSF Medical Center', address: '505 Parnassus Avenue', distance: 3.1, compensation: 250, timeRequired: '6 hours', verified: true, availableSlots: 4, eligibility: ['Age 21-65', 'No sleep disorders', 'BMI under 30'], latitude: 37.7625, longitude: -122.4583, providerName: 'UCSF Research' },
  { id: '4', type: 'plasma', name: 'Convalescent Plasma', location: 'CSL Plasma', address: '2100 Mission Street', distance: 1.8, compensation: 100, timeRequired: '75 minutes', verified: true, availableSlots: 15, eligibility: ['Age 18+', 'Recent illness recovery', 'Valid ID'], latitude: 37.7623, longitude: -122.4187, providerName: 'CSL Plasma' },
  { id: '5', type: 'blood', name: 'Emergency Blood Need', location: 'St. Francis Hospital', address: '900 Hyde Street', distance: 2.7, compensation: 65, timeRequired: '60 minutes', verified: true, availableSlots: 20, eligibility: ['Age 17+', 'Weight 110+ lbs', 'Good health'], latitude: 37.7872, longitude: -122.4178, providerName: 'St. Francis Hospital' },
  { id: '6', type: 'research', name: 'Vaccine Trial Study', location: 'Stanford Medical', address: '300 Pasteur Drive', distance: 4.5, compensation: 500, timeRequired: '3 hours', verified: true, availableSlots: 6, eligibility: ['Age 18-50', 'No chronic conditions', 'Available for follow-ups'], latitude: 37.4419, longitude: -122.1430, providerName: 'Stanford Medicine' },
  { id: '7', type: 'sperm', name: 'Sperm Donation Program', location: 'California Cryobank', address: '2115 Oak Street', distance: 3.4, compensation: 175, timeRequired: '45 minutes', verified: true, availableSlots: 3, eligibility: ["Age 18-39", "Height 5'8\"+", 'College education preferred'], latitude: 37.7719, longitude: -122.4371, providerName: 'California Cryobank' },
  { id: '8', type: 'egg', name: 'Egg Donation Screening', location: 'Pacific Fertility Center', address: '55 Francisco Street', distance: 4.9, compensation: 12000, timeRequired: 'Multi-week process', verified: true, availableSlots: 2, eligibility: ['Age 21-32', 'Non-smoker', 'Healthy BMI', 'Family medical history'], latitude: 37.8044, longitude: -122.4128, providerName: 'Pacific Fertility' },
];

export function calculateWeeklyEarnings(opportunities: Opportunity[]): number {
  return opportunities
    .filter(op => op.type === 'blood' || op.type === 'plasma')
    .reduce((sum, op) => sum + op.compensation, 0);
}
