// DRWA — wspólne dane produktów (sklep + strona produktu).
export interface Produkt {
  id: string
  cat: 'bluza' | 'koszulka'
  eyebrow: string
  title: string
  price: string
  desc: string
  badge?: string
  badgeTone?: 'ember'
  long: string[]
  specs: [string, string][]
}

export const PRODUCTS: Produkt[] = [
  {
    id: 'bluza-pamieta', cat: 'bluza', eyebrow: 'Bluza z kapturem',
    title: 'Bluza „Drewno pamięta”', price: '320 zł',
    desc: 'Ciepła bluza z bawełny organicznej 340 g. Haft wordmarku DRWA na piersi.',
    badge: 'Nowość',
    long: [
      'Nasza najcieplejsza bluza — gruba, szczotkowana od środka bawełna organiczna o gramaturze 340 g/m². Na piersi haftowany wordmark DRWA, na karku mała metka z drzewem.',
      'Krój unisex, lekko przedłużony, z podwójnym kapturem i kieszenią kangurką. Szyta w Polsce, w krótkiej serii.',
    ],
    specs: [
      ['Materiał', '100% bawełna organiczna'],
      ['Gramatura', '340 g/m²'],
      ['Zdobienie', 'Haft · pierś'],
      ['Krój', 'Unisex · przedłużony'],
    ],
  },
  {
    id: 'bluza-mark', cat: 'bluza', eyebrow: 'Bluza klasyczna',
    title: 'Bluza DRWA · drzewo', price: '290 zł',
    desc: 'Miękka bluza w kolorze leśnej zieleni z naszym znakiem-drzewem z przodu.',
    long: [
      'Klasyczna bluza bez kaptura w kolorze głębokiej, leśnej zieleni. Z przodu znak-drzewo DRWA nadrukowany sitodrukiem wodnym.',
      'Bawełna organiczna 300 g/m², ściągacze przy rękawach i u dołu. Pierze się dobrze, nosi jeszcze lepiej.',
    ],
    specs: [
      ['Materiał', '100% bawełna organiczna'],
      ['Gramatura', '300 g/m²'],
      ['Zdobienie', 'Sitodruk wodny · przód'],
      ['Krój', 'Unisex · klasyczny'],
    ],
  },
  {
    id: 'tee-drzewo', cat: 'koszulka', eyebrow: 'Koszulka',
    title: 'Koszulka DRWA · drzewo', price: '120 zł',
    desc: 'Gruba bawełna organiczna 200 g. Znak-drzewo nadrukowany na piersi.',
    long: [
      'Codzienna koszulka z grubej bawełny organicznej 200 g/m² — z tych, które po dwóch latach wyglądają lepiej niż nowe.',
      'Znak-drzewo DRWA na piersi, drukowany sitodrukiem wodnym. Kolor: złamana biel papieru.',
    ],
    specs: [
      ['Materiał', '100% bawełna organiczna'],
      ['Gramatura', '200 g/m²'],
      ['Zdobienie', 'Sitodruk wodny · pierś'],
      ['Krój', 'Unisex · prosty'],
    ],
  },
  {
    id: 'tee-tagline', cat: 'koszulka', eyebrow: 'Koszulka',
    title: 'Koszulka „Drewno · Rzemiosło · Szkolenia”', price: '130 zł',
    desc: 'Tagline DRWA w mono-typografii na plecach. Krój unisex.',
    badge: 'Ostatnie sztuki', badgeTone: 'ember',
    long: [
      'Tagline DRWA — Drewno · Rzemiosło · Szkolenia — złożony pismem mono i nadrukowany przez całe plecy. Z przodu tylko mała sygnatura na piersi.',
      'Ostatnie sztuki z pierwszej serii; po wyprzedaniu wraca dopiero jesienią.',
    ],
    specs: [
      ['Materiał', '100% bawełna organiczna'],
      ['Gramatura', '200 g/m²'],
      ['Zdobienie', 'Sitodruk wodny · plecy'],
      ['Krój', 'Unisex · prosty'],
    ],
  },
  {
    id: 'tee-zlasu', cat: 'koszulka', eyebrow: 'Koszulka',
    title: 'Koszulka „Z lasu”', price: '120 zł',
    desc: 'Stonowana zieleń świerku, drobny nadruk lasu nad sercem.',
    long: [
      'Najcichsza z naszych koszulek — stonowana zieleń świerku i drobny nadruk linii lasu nad sercem. Dla tych, którzy nie lubią dużych logotypów.',
      'Bawełna organiczna 200 g/m², szyta w Polsce.',
    ],
    specs: [
      ['Materiał', '100% bawełna organiczna'],
      ['Gramatura', '200 g/m²'],
      ['Zdobienie', 'Sitodruk wodny · pierś'],
      ['Krój', 'Unisex · prosty'],
    ],
  },
]

export const SIZES = ['S', 'M', 'L', 'XL']
