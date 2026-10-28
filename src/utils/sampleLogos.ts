export interface SampleLogo {
  id: string;
  name: string;
  category: string;
  url: string;
}

// Crisp, high quality vector logos encoded as Data URLs
export const SAMPLE_LOGOS: SampleLogo[] = [
  {
    id: 'roast-coffee',
    name: 'Artisan Coffee Roasters',
    category: 'Cafe & Culinary',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <circle cx="200" cy="200" r="175" fill="none" stroke="#2B1E16" stroke-width="8" stroke-dasharray="10 6" />
        <circle cx="200" cy="200" r="150" fill="#2B1E16" />
        <circle cx="200" cy="200" r="142" fill="none" stroke="#D4AF37" stroke-width="3" />
        <path d="M150 170 C150 120, 250 120, 250 170 C250 210, 150 210, 150 170 Z" fill="#D4AF37" />
        <path d="M200 135 C190 155, 190 185, 200 205 C210 185, 210 155, 200 135 Z" fill="#2B1E16" />
        <path d="M175 110 C175 95, 185 85, 185 70" stroke="#E6C687" stroke-width="4" stroke-linecap="round" fill="none" />
        <path d="M200 115 C200 100, 210 90, 210 75" stroke="#E6C687" stroke-width="4" stroke-linecap="round" fill="none" />
        <path d="M225 110 C225 95, 235 85, 235 70" stroke="#E6C687" stroke-width="4" stroke-linecap="round" fill="none" />
        <text x="200" y="255" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" letter-spacing="3">ROAST &amp; BLOOM</text>
        <text x="200" y="280" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="600" font-size="12" fill="#D4AF37" letter-spacing="6">ESTD • 2024</text>
      </svg>
    `)}`,
  },
  {
    id: 'apex-athletics',
    name: 'Apex Speed Club',
    category: 'Sportswear',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="apexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FF3366" />
            <stop offset="100%" stop-color="#FF6B00" />
          </linearGradient>
        </defs>
        <polygon points="120,240 200,80 280,240 230,240 200,165 170,240" fill="url(#apexGrad)" />
        <polygon points="140,270 200,210 260,270 200,245" fill="#FF3366" />
        <text x="200" y="325" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-style="italic" font-size="38" fill="#111827" letter-spacing="2">APEX</text>
        <text x="200" y="350" text-anchor="middle" font-family="'Arial', sans-serif" font-weight="800" font-size="13" fill="#6B7280" letter-spacing="8">RUNNING DIVISION</text>
      </svg>
    `)}`,
  },
  {
    id: 'north-peak',
    name: 'North Peak Outfitters',
    category: 'Outdoor & Adventure',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <polygon points="200,30 360,110 360,290 200,370 40,290 40,110" fill="#1C3127" stroke="#E2B159" stroke-width="6" />
        <polygon points="200,100 290,260 110,260" fill="#2E4F3E" />
        <polygon points="200,100 230,160 210,160 200,180 190,160 170,160" fill="#FFFFFF" />
        <polygon points="150,180 220,260 80,260" fill="#172A21" />
        <polygon points="150,180 170,220 150,220 130,260" fill="#E6EEF8" />
        <circle cx="200" cy="80" r="10" fill="#E2B159" />
        <text x="200" y="305" text-anchor="middle" font-family="'Georgia', serif" font-weight="bold" font-size="20" fill="#E2B159" letter-spacing="4">NORTH PEAK</text>
        <text x="200" y="325" text-anchor="middle" font-family="'Arial', sans-serif" font-weight="bold" font-size="10" fill="#A8C3B1" letter-spacing="5">WILDERNESS SUPPLY</text>
      </svg>
    `)}`,
  },
  {
    id: 'cyber-wave',
    name: 'Cyberwave Synth',
    category: 'Tech & Music',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="cyberSun" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFE600" />
            <stop offset="50%" stop-color="#FF0077" />
            <stop offset="100%" stop-color="#7928CA" />
          </linearGradient>
        </defs>
        <rect x="20" y="20" width="360" height="360" rx="36" fill="#0D0F18" />
        <circle cx="200" cy="180" r="100" fill="url(#cyberSun)" />
        <line x1="100" y1="180" x2="300" y2="180" stroke="#0D0F18" stroke-width="4" />
        <line x1="105" y1="195" x2="295" y2="195" stroke="#0D0F18" stroke-width="6" />
        <line x1="115" y1="210" x2="285" y2="210" stroke="#0D0F18" stroke-width="8" />
        <line x1="130" y1="225" x2="270" y2="225" stroke="#0D0F18" stroke-width="10" />
        <line x1="150" y1="240" x2="250" y2="240" stroke="#0D0F18" stroke-width="12" />
        <polygon points="120,250 200,160 280,250" fill="none" stroke="#00F0FF" stroke-width="5" />
        <text x="200" y="315" text-anchor="middle" font-family="'Courier New', monospace" font-weight="900" font-size="26" fill="#00F0FF" letter-spacing="4">CYBER//WAVE</text>
        <text x="200" y="340" text-anchor="middle" font-family="'Arial', sans-serif" font-weight="600" font-size="11" fill="#FF0077" letter-spacing="6">AUDIO COLLECTIVE</text>
      </svg>
    `)}`,
  },
  {
    id: 'sol-luna',
    name: 'Sol & Luna Botanica',
    category: 'Minimalist & Wellness',
    url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <circle cx="200" cy="180" r="95" fill="none" stroke="#1A202C" stroke-width="3" />
        <circle cx="175" cy="170" r="65" fill="#1A202C" />
        <circle cx="195" cy="165" r="55" fill="#FFFFFF" />
        <circle cx="225" cy="165" r="30" fill="none" stroke="#C59B27" stroke-width="3" />
        <!-- Sun rays -->
        <line x1="225" y1="120" x2="225" y2="110" stroke="#C59B27" stroke-width="3" stroke-linecap="round" />
        <line x1="255" y1="135" x2="265" y2="125" stroke="#C59B27" stroke-width="3" stroke-linecap="round" />
        <line x1="270" y1="165" x2="280" y2="165" stroke="#C59B27" stroke-width="3" stroke-linecap="round" />
        <line x1="255" y1="195" x2="265" y2="205" stroke="#C59B27" stroke-width="3" stroke-linecap="round" />
        <text x="200" y="315" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="700" font-size="28" fill="#1A202C" letter-spacing="5">SOL &amp; LUNA</text>
        <text x="200" y="340" text-anchor="middle" font-family="'Montserrat', sans-serif" font-weight="500" font-size="11" fill="#718096" letter-spacing="7">NATURAL BOTANICALS</text>
      </svg>
    `)}`,
  },
];
