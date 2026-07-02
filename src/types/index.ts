export interface Provider {
  id: string;
  name: string;
  type: 'Clinic' | 'Individual' | string;
  services: string[];
  conditions: string[];
  ageGroups: string;
  practice: 'Centre' | 'Home Visits' | 'Both' | string;
  languages: string[];
  centreLocality: string;
  centreAddress: string;
  mapsLink: string;
  hvLocalities: string[];
  whatsapp: string;
  bitly: string;
  recCount: number;
  trustBadge: string;
  quote: string;
  consent: string;
  dateAdded: string;
  // Derived fields
  initials: string;
  localities: string[];
  contactUrl: string;
  mapsUrl: string | null;
}

export interface FilterOptions {
  services: string[];
  localities: string[];
}

export interface AppConfig {
  SHEET_ID: string;
  SHEET_TAB: string;
  GOOGLE_API_KEY: string;
  GA_ID: string;
  FEEDBACK_FORM_URL: string;
  APP_NAME: string;
  APP_TAGLINE: string;
  APP_CITY: string;
}