const pages: Record<string, { title: string; description: string }> = {
  "/": {
    title: "HLH — Trois adresses à Abidjan",
    description: "Palais WIA à Cocody, Résidences ATTA au Plateau et Hôtel Astral à Yopougon : trois adresses complémentaires réunies par Hotel & Luxury Housing."
  },
  "/nos-hotels": {
    title: "Nos hôtels à Abidjan — Palais WIA, Résidences ATTA, Hôtel Astral | HLH",
    description: "Découvrez Palais WIA à Cocody, les Résidences ATTA au Plateau et l’Hôtel Astral à Yopougon, trois adresses du groupe HLH à Abidjan."
  },
  "/chambres-suites": {
    title: "Chambres & suites à Abidjan — Palais WIA, ATTA et Astral | HLH",
    description: "Chambres et suites au Palais WIA, studios et appartements aux Résidences ATTA, chambres standard et appartements à l’Hôtel Astral."
  },
  "/restaurants": {
    title: "Restaurants à Abidjan — La Quintessence, L’Alchimie & Hôtel Astral | HLH",
    description: "Découvrez La Quintessence et le bar L’Alchimie au Palais WIA, ainsi que le restaurant de l’Hôtel Astral à Yopougon."
  },
  "/salles-reunion": {
    title: "Réunions & événements à Abidjan — HLH",
    description: "Espaces de réunion et d’événement au Palais WIA et à l’Hôtel Astral, avec l’espace coworking des Résidences ATTA au Plateau."
  },
  "/salles-de-sport": {
    title: "Sport & bien-être à Abidjan — HLH",
    description: "Espaces fitness, piscines et jardin au Palais WIA, aux Résidences ATTA et à l’Hôtel Astral, selon les équipements disponibles par adresse."
  },
  "/contacts": {
    title: "Contacts des hôtels HLH à Abidjan — Palais WIA, ATTA, Astral",
    description: "Coordonnées, téléphones, emails et itinéraires des trois établissements du groupe HLH à Abidjan."
  },
  "/confidentialite": {
    title: "Confidentialité — HLH",
    description: "Informations sur le traitement des demandes adressées au portail HLH."
  }
};

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function setMeta(html: string, selector: RegExp, tag: string): string {
  return selector.test(html) ? html.replace(selector, tag) : html.replace("</head>", `${tag}</head>`);
}

export function withSiteSeo(html: string, pathname: string): string {
  const page = pages[pathname.replace(/\/$/, "") || "/"] || pages["/"];
  const title = escapeAttribute(page.title);
  const description = escapeAttribute(page.description);
  let result = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  result = setMeta(result, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${description}">`);
  result = setMeta(result, /<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="noindex,nofollow">`);
  result = setMeta(result, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${title}">`);
  result = setMeta(result, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${description}">`);
  result = setMeta(result, /<meta\s+property=["']og:site_name["'][^>]*>/i, `<meta property="og:site_name" content="HLH · Hotel &amp; Luxury Housing">`);
  result = setMeta(result, /<meta\s+name=["']twitter:card["'][^>]*>/i, `<meta name="twitter:card" content="summary_large_image">`);
  return result;
}

export const privateRobotsHeader = "noindex, nofollow, noarchive";
