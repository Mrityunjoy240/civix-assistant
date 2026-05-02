import { UserLocation } from '@/types';

const US_STATES = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut',
  'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa',
  'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan',
  'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire',
  'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio',
  'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota',
  'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia',
  'wisconsin', 'wyoming', 'district of columbia', 'dc'
];

const INDIAN_STATES = [
  'west bengal', 'maharashtra', 'delhi', 'odisha', 'karnataka', 'tamil nadu', 'uttar pradesh', 'bihar', 'assam', 'kerala',
  'rajasthan', 'gujarat', 'madhya pradesh', 'telangana', 'andhra pradesh', 'punjab', 'haryana', 'jharkhand', 'chhattisgarh',
  'uttarakhand', 'goa', 'tripura', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'sikkim', 'arunachal pradesh', 'himachal pradesh'
];

const STATE_ALIASES: Record<string, string> = {
  ny: 'new york', ca: 'california', tx: 'texas', fl: 'florida', ga: 'georgia', il: 'illinois', pa: 'pennsylvania', oh: 'ohio', nc: 'north carolina',
  mi: 'michigan', nj: 'new jersey', va: 'virginia', wa: 'washington', az: 'arizona', ma: 'massachusetts', tn: 'tennessee', in: 'indiana',
  mo: 'missouri', md: 'maryland', wi: 'wisconsin', co: 'colorado', mn: 'minnesota', sc: 'south carolina', al: 'alabama', la: 'louisiana',
  ky: 'kentucky', or: 'oregon', ok: 'oklahoma', ct: 'connecticut', ut: 'utah', nv: 'nevada', ia: 'iowa', ar: 'arkansas', ms: 'mississippi',
  ks: 'kansas', nm: 'new mexico', ne: 'nebraska', id: 'idaho', wv: 'west virginia', hi: 'hawaii', nh: 'new hampshire', me: 'maine',
  mt: 'montana', ri: 'rhode island', de: 'delaware', sd: 'south dakota', nd: 'north dakota', ak: 'alaska', vt: 'vermont', dc: 'district of columbia',
  wb: 'west bengal', mh: 'maharashtra', dl: 'delhi', ka: 'karnataka', tn: 'tamil nadu', up: 'uttar pradesh', br: 'bihar', as: 'assam', kl: 'kerala',
  rj: 'rajasthan', gj: 'gujarat', mp: 'madhya pradesh', ts: 'telangana', ap: 'andhra pradesh', pb: 'punjab', hr: 'haryana', jh: 'jharkhand',
  cg: 'chhattisgarh', uk: 'uttarakhand', ga_ind: 'goa', tr: 'tripura', mn_ind: 'manipur', ml: 'meghalaya', mz: 'mizoram', nl: 'nagaland', sk: 'sikkim', hp: 'himachal pradesh'
};

const INDIA_ALIASES: Record<string, string> = {
  'west bengal': 'west bengal', 'maharashtra': 'maharashtra', delhi: 'delhi', odisha: 'odisha', orissa: 'odisha', karnataka: 'karnataka',
  'tamil nadu': 'tamil nadu', 'uttar pradesh': 'uttar pradesh', bihar: 'bihar', assam: 'assam', kerala: 'kerala', rajasthan: 'rajasthan',
  gujarat: 'gujarat', 'madhya pradesh': 'madhya pradesh', telangana: 'telangana', 'andhra pradesh': 'andhra pradesh', punjab: 'punjab',
  haryana: 'haryana', jharkhand: 'jharkhand', chhattisgarh: 'chhattisgarh', uttarakhand: 'uttarakhand', goa: 'goa', tripura: 'tripura',
  manipur: 'manipur', meghalaya: 'meghalaya', mizoram: 'mizoram', nagaland: 'nagaland', sikkim: 'sikkim', 'arunachal pradesh': 'arunachal pradesh',
  'himachal pradesh': 'himachal pradesh', wb: 'west bengal', mh: 'maharashtra', dl: 'delhi', ka: 'karnataka', tn: 'tamil nadu', up: 'uttar pradesh',
  br: 'bihar', as: 'assam', kl: 'kerala', rj: 'rajasthan', gj: 'gujarat', mp: 'madhya pradesh', ts: 'telangana', ap: 'andhra pradesh',
  pb: 'punjab', hr: 'haryana', jh: 'jharkhand', cg: 'chhattisgarh', uk: 'uttarakhand', tr: 'tripura', ml: 'meghalaya', mz: 'mizoram', nl: 'nagaland', sk: 'sikkim', ar: 'arunachal pradesh', hp: 'himachal pradesh'
};

const toTitleCase = (value: string) => value.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export function parseLocation(input: string): UserLocation | null {
  const lower = input.toLowerCase().trim();
  let country = 'us';
  let state: string | undefined;

  const containsIndianState = Object.keys(INDIA_ALIASES).some((alias) => new RegExp(`\\b${alias}\\b`).test(lower));

  if (containsIndianState) country = 'india';
  else   if (/\b(canada|canadian)\b/.test(lower)) country = 'canada';
  else if (/\b(uk|united kingdom|britain|england)\b/.test(lower)) country = 'uk';
  else if (/\b(india|indian)\b/.test(lower)) country = 'india';

  if (country === 'india') {
    for (const s of [...INDIAN_STATES].sort((a, b) => b.length - a.length)) {
      if (new RegExp(`\\b${s}\\b`).test(lower)) {
        state = toTitleCase(s);
        break;
      }
    }
    if (!state) {
      for (const [alias, fullName] of Object.entries(INDIA_ALIASES)) {
        if (new RegExp(`\\b${alias}\\b`).test(lower)) {
          state = toTitleCase(fullName);
          break;
        }
      }
    }
    return { country: 'india', state, county: undefined };
  }

  for (const s of [...US_STATES].sort((a, b) => b.length - a.length)) {
    if (new RegExp(`\\b${s}\\b`).test(lower)) {
      state = toTitleCase(s);
      break;
    }
  }

  if (!state) {
    for (const [alias, fullName] of Object.entries(STATE_ALIASES)) {
      if (alias.endsWith('_ind')) continue;
      if (new RegExp(`\\b${alias}\\b`).test(lower)) {
        state = toTitleCase(fullName);
        break;
      }
    }
  }

  return { country, state, county: undefined };
}

export function isValidLocation(location: UserLocation | null): boolean {
  if (!location) return false;
  if (location.country === 'us' || location.country === 'canada' || location.country === 'uk') return true;
  return location.country !== 'us';
}

export function formatLocation(location: UserLocation | null): string {
  if (!location) return '';
  if (location.state) return `${location.state}, ${location.country.toUpperCase()}`;
  return location.country.toUpperCase();
}
