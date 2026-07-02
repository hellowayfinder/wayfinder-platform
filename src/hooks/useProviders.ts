import { useState, useEffect } from 'react';
import CONFIG from '../config';
import SAMPLE_PROVIDERS from '../data/sampleProviders';
import type { Provider, FilterOptions } from '../types';

// ── Column indexes ────────────────────────────────────────
// Map to your Providers sheet — A=0, B=1, C=2 …
const COL = {
  ID:              0,
  NAME:            1,
  TYPE:            2,
  SERVICES:        3,
  CONDITIONS:      4,
  AGE_GROUPS:      5,
  PRACTICE:        6,
  LANGUAGES:       7,
  CENTRE_LOCALITY: 8,
  CENTRE_ADDRESS:  9,
  MAPS_LINK:       10,
  HV_LOCALITIES:   11,
  WHATSAPP:        12,
  BITLY:           13,
  REC_ID:          14,
  REC_COUNT:       15,
  TRUST_BADGE:     16,
  QUOTE:           17,
  CONSENT:         21,
  DATE_ADDED:      22,
} as const;

const WA_TEXT = encodeURIComponent(
  'Hi, I found your listing on WayFinder and wanted to enquire about therapy for my child.'
);

function parseRow(row: string[]): Provider {
  const get = (i: number) => (row[i] ?? '').toString().trim();

  const name          = get(COL.NAME);
  const bitly         = get(COL.BITLY);
  const whatsapp      = get(COL.WHATSAPP);
  const mapsRaw       = get(COL.MAPS_LINK);
  const centreLocality = get(COL.CENTRE_LOCALITY);
  const hvRaw          = get(COL.HV_LOCALITIES);

  const hvLocalities = hvRaw.split(',').map(s => s.trim()).filter(Boolean);

  const contactUrl = bitly
    ? `https://${bitly}`
    : `https://wa.me/91${whatsapp}?text=${WA_TEXT}`;

  const mapsUrl = mapsRaw
    ? mapsRaw.startsWith('http') ? mapsRaw : `https://${mapsRaw}`
    : null;

  return {
    id:             get(COL.ID),
    name,
    type:           get(COL.TYPE),
    services:       get(COL.SERVICES).split(',').map(s => s.trim()).filter(Boolean),
    conditions:     get(COL.CONDITIONS).split(',').map(s => s.trim()).filter(Boolean),
    ageGroups:      get(COL.AGE_GROUPS),
    practice:       get(COL.PRACTICE),
    languages:      get(COL.LANGUAGES).split(',').map(s => s.trim()).filter(Boolean),
    centreLocality,
    centreAddress:  get(COL.CENTRE_ADDRESS),
    mapsLink:       mapsRaw,
    hvLocalities,
    whatsapp,
    bitly,
    recCount:       parseInt(get(COL.REC_COUNT)) || 0,
    trustBadge:     get(COL.TRUST_BADGE),
    quote:          get(COL.QUOTE),
    consent:        get(COL.CONSENT),
    dateAdded:      get(COL.DATE_ADDED),
    initials:       name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase(),
    localities:     [centreLocality, ...hvLocalities].filter(Boolean),
    contactUrl,
    mapsUrl,
  };
}

interface UseProvidersReturn {
  providers: Provider[];
  loading: boolean;
  error: string | null;
  isUsingFallback: boolean;
}

export function useProviders(): UseProvidersReturn {
  const [providers, setProviders]       = useState<Provider[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [isUsingFallback, setFallback]  = useState(false);

  useEffect(() => {
    async function fetchProviders() {
      // Use sample data if not configured yet
      if (
        CONFIG.SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE' ||
        CONFIG.GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE'
      ) {
        setProviders(SAMPLE_PROVIDERS);
        setFallback(true);
        setLoading(false);
        return;
      }

      try {
        const url =
          `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}` +
          `/values/${CONFIG.SHEET_TAB}?key=${CONFIG.GOOGLE_API_KEY}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Sheets API returned ${res.status}`);

        const json = await res.json() as { values?: string[][] };
        const rows = json.values ?? [];

        // Skip 3 header rows (title band, section band, column labels)
        const parsed = rows
          .slice(3)
          .map(parseRow)
          .filter(p => p.id && p.name && p.consent.toLowerCase().includes('yes'));

        setProviders(parsed);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        console.error('WayFinder: failed to load providers:', msg);
        setError(msg);
        setProviders(SAMPLE_PROVIDERS);
        setFallback(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, []);

  return { providers, loading, error, isUsingFallback };
}

export function getFilterOptions(providers: Provider[]): FilterOptions {
  const services   = [...new Set(providers.flatMap(p => p.services))].sort();
  const localities = [...new Set(providers.flatMap(p => p.localities))].filter(Boolean).sort();
  return { services, localities };
}