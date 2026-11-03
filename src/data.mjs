// ---------------------------------------------------------------------------
// Wedding facts — sourced from the F&N Welcome Guide (Family) PDF, the printed
// reception invitation / order-of-the-day fans, and the website brief.
// Anything not supplied is marked TBC so it can be filled in later.
// ---------------------------------------------------------------------------

export const SITE = {
  url: 'https://fnwedding.com',
  names: 'Fuad & Nisan',
  dates: '19 – 23 December 2026',
  city: 'Nairobi, Kenya',
  tagline: 'Yesterday, Today & Tomorrow',
  description: 'Fuad & Nisan — a Somali-Yemeni wedding celebration in Nairobi, Kenya, 19–23 December 2026. Celebrations, RSVP, travel and guest information.',
  countdownTo: '2026-12-19T15:30:00+03:00',
  discountCode: 'FuN2026',
};

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/our-story/', label: 'Our Story' },
  { href: '/celebrations/', label: 'Celebrations' },
  { href: '/travel/', label: 'Travel & Stay' },
  { href: '/guest-info/', label: 'Guest Info' },
  { href: '/gallery/', label: 'Gallery' },
  { href: '/honeymoon/', label: 'Honeymoon Fund' },
];

export const EVENTS = [
  {
    id: 'henna',
    num: 'One',
    day: '19',
    month: 'December',
    weekday: 'Saturday',
    dateISO: '2026-12-19',
    title: 'Yemeni Henna Night',
    titleAr: 'ليلة الحناء',
    audience: 'Ladies only',
    time: '3:30pm EAT',
    intro:
      'The Yemeni Henna Night is a cherished celebration held before the wedding, bringing together family and friends to bless the bride as she begins a new chapter. Henna symbolises adornment, joy, protection, prosperity and good fortune, while the gathering is filled with music, laughter, traditional dress and heartfelt prayers.',
    venues: [
      {
        name: 'Meraki House',
        address: 'Waiyaki Way – Red Hill Link Road, Nyari, Ngecha Rd (Nyari Estate), Nairobi',
        map: 'https://www.google.com/maps/search/?api=1&query=Meraki+House+Nyari+Estate+Nairobi',
      },
    ],
    access: 'Ladies only',
    programme: null,
    dressCode: null,
  },
  {
    id: 'nikah',
    num: 'Two',
    day: '20',
    month: 'December',
    weekday: 'Sunday',
    dateISO: '2026-12-20',
    title: 'Katb Al-Kitab · Nikah',
    titleAr: 'عقد القران · كتب الكتاب',
    audience: 'Ladies & gentlemen · separate venues',
    time: '12pm – 4pm EAT',
    intro:
      "The Katb Al-Kitab (Nikah) is the sacred Islamic marriage ceremony where our marriage contract is signed, officially uniting us as husband and wife. Surrounded by our loved ones, we seek Allah's blessings for a lifetime of love, faith, mercy and happiness together.",
    venues: [
      {
        who: 'Gentlemen',
        name: 'Adams Arcade Mosque',
        address: 'Adams Arcade, Nairobi',
        map: 'https://www.google.com/maps/search/?api=1&query=Adams+Arcade+Mosque+Nairobi',
      },
      {
        who: 'Ladies',
        name: 'Meraki House',
        address: 'Waiyaki Way – Red Hill Link Road, Nyari, Ngecha Rd (Nyari Estate), Nairobi',
        map: 'https://www.google.com/maps/search/?api=1&query=Meraki+House+Nyari+Estate+Nairobi',
      },
    ],
    access: 'Invitation only',
    programme: null,
    dressCode: null,
  },
  {
    id: 'reception',
    num: 'Three',
    day: '23',
    month: 'December',
    weekday: 'Wednesday',
    dateISO: '2026-12-23',
    title: 'Zifaf · Wedding Reception',
    titleAr: 'الزفاف',
    audience: 'Invitation access only',
    time: '2pm – 12am EAT · doors open 2:00pm',
    intro:
      'Our Wedding Reception is a celebration of love, family and the beginning of our new journey together. Join us for a day of heartfelt toasts, delicious food, music and dancing as we create unforgettable memories with the people we love most.',
    venues: [
      {
        name: 'Emara Ole Sereni · Mara Ballroom',
        address: 'Off Mombasa Road at the Southern Bypass junction, Nairobi',
        map: 'https://www.google.com/maps/search/?api=1&query=Emara+Ole+Sereni+Nairobi',
      },
    ],
    access: 'Invitation access only · each invitation admits one · no children',
    programme: [
      ['2:00 PM', 'Doors open'],
      ['3:00 PM', 'Bites & Refreshments'],
      ['4:30 PM', "Bride's Entrance"],
      ['6:30 PM', "Groom's Entrance & Co."],
      ['7:00 PM', 'Dinner'],
      ['8:00 PM', 'Dances, Speeches & Vibes'],
    ],
    dressCode: null,
  },
];

export const HOTELS = [
  {
    name: 'Gemsuites Riverside',
    area: null,
    desc: 'Apartment hotel / private hotel residences, serviced, with pool, gym and spa.',
    best: null,
    rate: 'USD 120 – 200',
    rateNote: 'per night (sharing)',
    phone: null,
    contact: null,
    website: null,
    code: true,
  },
  {
    name: 'JW Marriott Nairobi',
    area: 'Chiromo Lane, Westlands',
    desc: 'Modern luxury with skyline views and refined interiors.',
    best: 'Best for modern luxury and Westlands convenience',
    rate: 'USD 250 – 410',
    rateNote: 'per night',
    phone: '+254 719 010 888',
    website: 'https://www.marriott.com',
    websiteLabel: 'marriott.com',
  },
  {
    name: 'Emara Ole Sereni',
    area: 'Mombasa Road · reception venue',
    desc: 'Located off Mombasa Road at the Southern Bypass junction — the venue for the wedding reception.',
    best: 'Stay where the reception takes place',
    rate: 'USD 100 – 250',
    rateNote: 'per night',
    phone: '+254 713 977 710',
    contact: 'Zak Zola',
    website: null,
    code: true,
  },
  {
    name: 'Sankara Nairobi, Autograph Collection',
    area: '05 Woodvale Grove, Westlands',
    desc: 'Contemporary five-star hotel rooted in art, culture and warm hospitality.',
    best: 'Best for stylish Westlands stays with a personalised feel',
    rate: 'USD 190 – 330',
    rateNote: 'per night',
    phone: '+254 703 028 000',
    website: 'https://www.sankara.com',
    websiteLabel: 'sankara.com',
  },
  {
    name: 'Villa Rosa Kempinski',
    area: 'Chiromo Road, Westlands',
    desc: 'Grand European-style luxury with polished service.',
    best: 'Best for grand luxury and polished service',
    rate: 'USD 190 – 310',
    rateNote: 'per night',
    phone: '+254 703 049 000',
    website: 'https://www.kempinski.com',
    websiteLabel: 'kempinski.com',
  },
  {
    name: 'Airbnb',
    area: 'Westlands · Kilimani · Lavington · Kileleshwa · Karen',
    desc: 'For guests who prefer apartment-style or private accommodation, Airbnb offers a beautiful range of stays across Nairobi. We recommend searching Westlands, Kilimani, Lavington, Kileleshwa or Karen for proximity to the wedding venues.',
    best: null,
    rate: 'USD 60 – 200',
    rateNote: 'per night',
    phone: null,
    website: 'https://www.airbnb.com/s/Nairobi--Kenya/homes',
    websiteLabel: 'airbnb.com',
  },
];

export const TRANSPORT = [
  {
    name: 'The Travel Lounge',
    logo: '/assets/img/logo-travel-lounge.webp',
    kind: 'Travel resources',
    services: [],
    note: 'Mention you are guests of the Fuad / Nisan wedding.',
    contacts: [
      { who: 'Salwa', tel: '+254 720 438 404' },
      { who: 'Mercy', tel: '+254 780 438 404' },
    ],
    extra: 'Official numbers: 0720 438 404 · 0785 438 404 · 0780 438 404 · 0703 438 404',
  },
  {
    name: 'Flex Drive and Car Rentals',
    logo: '/assets/img/logo-flexdrive.webp',
    kind: 'Car hire & chauffeur services',
    services: ['Self drive', 'Chauffeured', 'Airport transfers', 'Weddings', 'VIP & luxury cars', 'Corporate & executive', 'Long-term rental'],
    contacts: [
      { who: 'General', tel: '+254 700 781 645' },
      { who: 'Abraham', tel: '+254 700 503 574' },
    ],
    email: 'info.flexrental@gmail.com',
    website: 'https://www.flexdriveandcarrentals.co.ke',
    websiteLabel: 'flexdriveandcarrentals.co.ke',
  },
  {
    name: "Hire N' Drive Kenya Ltd",
    logo: '/assets/img/logo-hire-n-drive.webp',
    kind: 'Car hire & chauffeur services',
    services: ['Car hire', 'Chauffeur services'],
    contacts: [{ who: 'General', tel: '+254 722 417 475' }],
  },
  {
    name: 'Paw Print Adventures Limited',
    logo: '/assets/img/logo-paw-print.webp',
    kind: 'Car hire & chauffeur services',
    services: ['Tours & travels', 'Logistics', 'Car hire'],
    contacts: [
      { who: 'Ali Said', tel: '+254 722 445 230' },
      { who: 'Alternate', tel: '+254 735 445 230' },
    ],
  },
];

export const EXPLORE = [
  {
    title: 'Restaurants · social dining',
    items: [
      ['INTI', 'Refined Nikkei dining in a sleek, design-led setting. Ideal for elevated evenings.'],
      ['DIJO', 'Intimate and understated, with thoughtful plates and a low-lit, sophisticated feel.'],
      ['Inca Social House', 'Bold, vibrant and high-energy — perfect for groups and celebratory nights.'],
      ['Celine & Lolo', 'Chic and contemporary, with strong aesthetic appeal and an easy, polished feel.'],
      ['Cultiva', 'Farm-to-fork dining rooted in freshness and seasonality, in a quietly refined garden setting.'],
      ['Talisman', 'A Nairobi classic serving globally inspired favourites in a lush, eclectic space.'],
    ],
  },
  {
    title: 'Cafés · matcha, brunch & slow moments',
    items: [
      ['Shamba Café', 'A lush, open-air escape, best enjoyed slowly over brunch.'],
      ['Karak & Go', 'Minimal, modern and a go-to for matcha lovers.'],
      ['Sirwo Café', 'Quietly stylish, ideal for a solo coffee.'],
      ['Le Grenier', 'Warm, European charm — perfect for slow mornings.'],
      ['Hikuri', 'Niche and minimal, with a calm, considered feel.'],
      ['The Good Grain', 'Elevated artisanal bakery, rooted in quality and craft.'],
      ['The Canteen', 'Casual, creative and community-driven.'],
      ['Sacred Mill Mwanzi', 'Thoughtful coffee in a buzzing hub of the city.'],
    ],
  },
  {
    title: 'Art & culture',
    items: [
      ['Circle Art Gallery', 'Leading contemporary gallery showcasing African artists.'],
      ['NCAI', 'A dynamic space for contemporary African art, fostering dialogue and discovery.'],
    ],
  },
  {
    title: 'Shopping · fashion, jewellery & craft',
    items: [
      ['Akiba Studios', 'Bold, culture-led streetwear with a strong identity.'],
      ['At Odds', 'Graphic, expressive and statement-driven.'],
      ['Metamorphisized', 'Experimental and boundary-pushing.'],
      ['Mannoir', 'Elevated African luxury fashion with a bold, contemporary edge.'],
      ['ALH (African Lifestyle Hub)', 'A vibrant mix of home, fashion and lifestyle, celebrating modern African living.'],
      ["Spinners Web", 'A treasure trove of local crafts — perfect for meaningful gifting.'],
      ['Opportunity Factory', "A curated hub of Kenyan craftsmanship, anchored by Sandstorm's iconic leather."],
      ['Maasai Market', 'Craft-led, vibrant and rich in local artistry.'],
      ['Village Market', 'A lifestyle destination blending retail and leisure.'],
      ['Sarit Centre', 'Streamlined, convenient and well-curated essentials.'],
    ],
  },
  {
    title: 'Experiences & activities',
    items: [
      ['Nairobi National Park', 'Wildlife set against the city skyline — uniquely Nairobi.'],
      ['Elephant Sanctuary (Sheldrick Wildlife Trust)', 'A meaningful, close-up conservation experience.'],
      ['Karura Forest', 'Expansive, calm and ideal for walking or cycling.'],
      ['Giraffe Centre', 'Easy, engaging and perfect for a relaxed outing.'],
    ],
  },
  {
    title: 'Wellness & self-care',
    items: [
      ['Kempinski Spa', 'Luxury wellness with expansive, restorative facilities.'],
      ['JW Marriott Spa', 'Refined, modern and deeply calming.'],
      ['Serenity Spa', 'Quiet, intimate and grounding.'],
      ['Spritz Salon', 'A go-to for braiding and styling.'],
      ['Jabeen Salon', "For all hair types — the bride's favourite."],
      ['Sugarcoat Nails', 'Trend-led, aesthetic nails in town by Ramla Dean.'],
      ['Lashcare', 'Clean, natural-looking lash extensions.'],
    ],
  },
];

// Honeymoon fund — wording preserved exactly as supplied.
export const HONEYMOON = {
  uk: { name: 'Nisan Abdulkader', account: '33036894', sort: '04-00-04' },
  intl: { iban: 'GB97MONZ04000433036894', bic: 'MONZGB2L' },
  mpesa: '0703 453 230',
};
