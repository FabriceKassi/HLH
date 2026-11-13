/* HLH group portal: six focused destinations, property links and accessible interactions. */
window.HLH_SITE_LINKS = Object.freeze({
  portal: "https://hlh-portail-v17-preview.netlify.app/",
  wia: {
    site: "https://palais-wia-preview.netlify.app/",
    reservation: "https://palais-wia-preview.netlify.app/reservation/",
    bookingParams: { arrival: "arrival", departure: "departure", rooms: "rooms", adults: "adults", children: "children" }
  },
  atta: {
    site: "https://residences-atta-preview.netlify.app/atta",
    reservation: "https://residences-atta-preview.netlify.app/atta/reserver",
    bookingParams: { arrival: "arrival", departure: "departure", rooms: "rooms", adults: "adults", children: "children" }
  },
  astral: {
    site: "https://hotel-astral-preview.netlify.app/hotel-astral",
    reservation: "https://hotel-astral-preview.netlify.app/hotel-astral/reserver",
    bookingParams: { arrival: "arrival", departure: "departure", rooms: "quantity", adults: "adults", children: "children" },
    fixedBookingParams: { phase: "dates" }
  }
});

window.HLH_PROPERTY_ORDER = Object.freeze(["astral", "atta", "wia"]);
function portalRank(id) { const n=window.HLH_PROPERTY_ORDER.indexOf(id); return n<0?99:n; }
function portalHotels() { return (site.hotels || []).slice().sort((a,b)=>portalRank(a.id)-portalRank(b.id)); }

const portalCopy = {
  "/": {
    title: "HLH — Trois adresses à Abidjan",
    description: "Palais WIA à Cocody, Résidences ATTA au Plateau et Hôtel Astral à Yopougon : trois adresses complémentaires réunies par Hotel & Luxury Housing."
  },
  "/nos-hotels": {
    title: "Nos hôtels à Abidjan — Palais WIA, ATTA, Astral | HLH",
    description: "Découvrez les trois adresses du groupe HLH à Abidjan : le boutique-hôtel Palais WIA à Cocody, les Résidences ATTA au Plateau et l’Hôtel Astral à Yopougon."
  },
  "/chambres-suites": {
    title: "Chambres & suites à Abidjan — HLH",
    description: "Explorez les chambres et suites du Palais WIA, les appartements des Résidences ATTA et les chambres et appartements de l’Hôtel Astral."
  },
  "/restaurants": {
    title: "Restaurants à Abidjan — La Quintessence, L’Alchimie & Astral | HLH",
    description: "La Quintessence, le bar L’Alchimie, les expériences gastronomiques du Palais WIA et le restaurant de l’Hôtel Astral."
  },
  "/salles-reunion": {
    title: "Réunions & événements à Abidjan — HLH",
    description: "Réunions, séminaires et événements au Palais WIA et à l’Hôtel Astral, avec l’espace de coworking des Résidences ATTA au Plateau."
  },
  "/salles-de-sport": {
    title: "Fitness et salles de sport dans nos hôtels à Abidjan | HLH",
    description: "Découvrez les espaces fitness de l'Hôtel Astral à Yopougon, des Résidences ATTA au Plateau et du Palais WIA à Cocody, pour garder la forme pendant votre séjour."
  },
  "/contacts": {
    title: "Contactez nos établissements à Abidjan | HLH",
    description: "Contactez l'Hôtel Astral à Yopougon, les Résidences ATTA au Plateau et le Palais WIA à Cocody. Retrouvez les coordonnées et itinéraires de nos trois adresses."
  }
};
window.HLH_GROUP_SEO = portalCopy;

const portalImages = {
  wia: "/assets/palais-wia-banner-poster.jpg",
  atta: "/assets/atta-2-pieces-americaine-clean.png",
  astral: "/assets/astral-room.jpg"
};

function portalText(fr, en) {
  // Content is escaped first; only the two editorial tags used in authored headings are restored.
  return esc(tx(fr, en || fr))
    .replace(/&lt;br\s*\/?&gt;/gi, "<br>")
    .replace(/&lt;em&gt;/gi, "<em>")
    .replace(/&lt;\/em&gt;/gi, "</em>");
}
function portalSetMeta(path) {
  const entry = portalCopy[path] || portalCopy["/"];
  document.title = entry.title;
  let description = document.querySelector('meta[name="description"]');
  if (!description) {
    description = document.createElement("meta");
    description.setAttribute("name", "description");
    document.head.append(description);
  }
  description.content = entry.description;
  let robots = document.querySelector('meta[name="robots"]');
  if (!robots) {
    robots = document.createElement("meta");
    robots.setAttribute("name", "robots");
    document.head.append(robots);
  }
  robots.content = "noindex,nofollow";
  const setProperty = function (selector, attribute, value) {
    let tag = document.querySelector(selector);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("property", selector.match(/og:([^"]+)/)[1]);
      document.head.append(tag);
    }
    tag.setAttribute(attribute, value);
  };
  setProperty('meta[property="og:title"]', "content", entry.title);
  setProperty('meta[property="og:description"]', "content", entry.description);
  setProperty('meta[property="og:site_name"]', "content", "HLH · Hotel & Luxury Housing");
  document.querySelectorAll('meta[data-fitness-meta]').forEach(function (tag) { tag.remove(); });
  if (path === '/salles-de-sport') {
    [['og:image', window.HLH_SITE_LINKS.portal + 'assets/hlh-fitness-fourni-20261112/astral.png'], ['og:image:alt', 'Entraînement sur tapis de course — Hôtel Astral'], ['og:type', 'website']].forEach(function (item) {
      const tag = document.createElement('meta');
      tag.setAttribute('property', item[0]); tag.content = item[1]; tag.dataset.fitnessMeta = 'true'; document.head.append(tag);
    });
  }
}
function portalNav(path) {
  const aliases = { "/contact": "/contacts", "/hebergements": "/chambres-suites", "/experiences": "/restaurants", "/entreprises": "/salles-reunion" };
  const active = aliases[path] || path;
  document.querySelectorAll("#header nav a").forEach(function (link) {
    const selected = link.getAttribute("href") === active;
    link.classList.toggle("is-active", selected);
    if (selected) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}
function portalFigure(src, alt, caption, extraClass) {
  return '<figure class="portal-media ' + (extraClass || "") + '">' +
    '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async">' +
    '<figcaption>' + esc(caption || tx("Visuel d’illustration", "Illustrative image")) + '</figcaption>' +
  '</figure>';
}
function portalButton(label, target) {
  return '<button type="button" class="portal-button portal-button--gold" data-book-choice="' + esc(target) + '">' + esc(label || tx("RÉSERVER", "BOOK")) + '</button>';
}
function portalExternalLink(hotelId, label, className) {
  const link = window.HLH_SITE_LINKS[hotelId];
  if (!link) return "";
  return '<a class="' + (className || "portal-link") + '" href="' + esc(link.site) + '" target="_blank" rel="noopener noreferrer">' +
    esc(label || tx("VISITER LE SITE", "VISIT THE WEBSITE")) + ' <span aria-hidden="true">↗</span></a>';
}
function portalPage(path, eyebrow, title, intro, content) {
  document.body.classList.add("innerpage", "group-portal-page");
  document.body.classList.remove("group-home");
  main.innerHTML =
    '<section class="portal-page-head"><div class="container">' +
      '<p class="eyebrow">' + esc(eyebrow) + '</p>' +
      '<h1>' + esc(title) + '</h1>' +
      '<p class="portal-page-intro">' + esc(intro) + '</p>' +
    '</div></section>' +
    '<div class="portal-page-content">' + content + '</div>';
  portalSetMeta(path);
  portalNav(path);
  window.scrollTo(0, 0);
  portalReveal();
}
function hotelFor(id) {
  return site.hotels.find(function (hotel) { return hotel.id === id; });
}
function portalTags(items) {
  return '<div class="portal-tags">' + items.map(function (item) {
    return '<span>' + esc(item) + '</span>';
  }).join("") + '</div>';
}
function renderGroupFooter() {
  if (!site || !footerElement) return;
  const nav = [
    ["/", tx("Accueil", "Home")],
    ["/chambres-suites", tx("Chambres & Suites", "Rooms & Suites")],
    ["/restaurants", tx("Restaurants", "Restaurants")],
    ["/salles-reunion", tx("Salles de réunion", "Meeting rooms")],
    ["/salles-de-sport", tx("Salles de sport", "Fitness")],
    ["/contacts", tx("Contacts", "Contact")]
  ];
  const links = [
    { id: "astral", name: "Hôtel Astral", location: tx("Yopougon · Zone industrielle", "Yopougon · Industrial area") },
    { id: "atta", name: "Résidences ATTA", location: tx("Plateau · Abidjan", "Plateau · Abidjan") },
    { id: "wia", name: "Palais WIA", location: tx("Cocody · Quartier des Ambassades", "Cocody · Embassy district") }
  ];
  const contacts = links.map(function (item) {
    const hotel = hotelFor(item.id);
    if (!hotel) return "";
    const phones = String(hotel.phone || "").split(/[\/,]/).map(function (part) {
      const number = part.trim();
      return number ? '<a href="tel:' + esc(number.replace(/[^\d+]/g, "")) + '">' + esc(number) + '</a>' : "";
    }).join("");
    return '<div class="portal-footer-contact"><strong>' + esc(hotel.name) + '</strong>' +
      '<span>' + esc(hotel.address) + '</span>' + phones +
      (hotel.email ? '<a href="mailto:' + esc(hotel.email) + '">' + esc(hotel.email) + '</a>' : "") +
      '</div>';
  }).join("");
  footerElement.innerHTML =
    '<div class="container portal-footer-main">' +
      '<div class="portal-footer-brand"><a class="logo" href="/" aria-label="HLH — Accueil"><img src="/assets/hlh-logo.png" alt="HLH — Hotel & Luxury Housing"></a>' +
        '<p class="portal-footer-motto">Chaque séjour une expérience,<br>chaque adresse une signature.</p></div>' +
      '<div class="portal-footer-col"><h2>' + portalText("Navigation", "Navigation") + '</h2>' +
        nav.map(function (item) { return '<a href="' + item[0] + '">' + esc(item[1]) + '</a>'; }).join("") + '</div>' +
      '<div class="portal-footer-col"><h2>' + portalText("Nos adresses", "Our addresses") + '</h2>' +
        links.map(function (item) {
          return '<a class="portal-footer-address" href="' + esc(window.HLH_SITE_LINKS[item.id].site) + '" target="_blank" rel="noopener noreferrer"><strong>' +
            esc(item.name) + '</strong><span>' + esc(item.location) + '</span></a>';
        }).join("") + '</div>' +
      '<div class="portal-footer-col portal-footer-contacts"><h2>' + portalText("Contact", "Contact") + '</h2>' +
        contacts + '<a class="portal-footer-more" href="/contacts">' + portalText("Tous les contacts", "All contacts") + ' <span aria-hidden="true">→</span></a></div>' +
    '</div>' +
    '<div class="portal-footer-bottom"><div class="container">' +
      '<span>© 2026 HLH · Abidjan, Côte d’Ivoire</span>' +
      '<div class="portal-legal"><a href="/confidentialite">' + portalText("Confidentialité", "Privacy") + '</a>' +
        '<span>' + portalText("Les autres informations légales seront complétées avant ouverture publique.", "Additional legal information will be completed before public launch.") + '</span></div>' +
    '</div></div>';
}
window.renderGroupFooter = renderGroupFooter;

function renderGroupHome(path) {
  if (path !== "/") return false;
  document.body.classList.remove("innerpage");
  document.body.classList.add("group-home", "group-portal-page");
  const hotels = portalHotels();
  const heroSlides = [
    { className: "portal-hero-slide--astral", key: "astral-salon", alt: tx("Pause café dans un salon avec un ordinateur portable", "Coffee break in a lounge with a laptop") },
    { className: "portal-hero-slide--atta", key: "atta", alt: tx("Terrasse des Résidences ATTA", "Résidences ATTA terrace") },
    { className: "portal-hero-slide--wia", key: "wia-horizontal", alt: tx("Escalier et lustre du Palais WIA", "Palais WIA staircase and chandelier") }
  ];
  const slideMarkup = heroSlides.map(function (slide, index) {
    return '<div class="portal-hero-slide ' + slide.className + ' ' + (index === 0 ? "is-active" : "") + '" data-portal-slide aria-hidden="' + (index === 0 ? "false" : "true") + '">' +
      '<img src="/assets/hlh-slider/' + slide.key + '-1280.webp" srcset="/assets/hlh-slider/' + slide.key + '-640.webp 640w, /assets/hlh-slider/' + slide.key + '-1280.webp 1280w, /assets/hlh-slider/' + slide.key + '-1920.webp 1920w" sizes="' + "100vw" + '" alt="' + esc(slide.alt) + '" ' + (index === 0 ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"') + ' decoding="async">' +
    '</div>';
  }).join("");
  const hotelCards = hotels.map(function (hotel, index) {
    const image = ({astral: "/assets/hlh-collection-astral-20261108.webp", atta: "/assets/hlh-collection-atta-20261108.webp", wia: "/assets/hlh-collection-wia-20261108.webp"})[hotel.id] || hotel.image || portalImages[hotel.id];
    return '<article class="portal-hotel-card portal-reveal">' +
      portalFigure(image, hotel.name + " — " + hotel.location, tx("Visuel d’illustration", "Illustrative image"), "portal-hotel-photo") +
      '<div class="portal-hotel-copy"><p class="eyebrow">0' + (index + 1) + ' · ' + esc(hotel.location) + '</p>' +
        '<h3>' + esc(hotel.name) + '</h3><p>' + esc(tr(hotel.description)) + '</p>' +
        '<div class="portal-card-actions"><a class="portal-link" href="/nos-hotels#hotel-' + esc(hotel.id) + '">' + portalText("DÉCOUVRIR", "DISCOVER") + ' <span aria-hidden="true">→</span></a>' +
          portalExternalLink(hotel.id, tx("VISITER LE SITE", "VISIT THE WEBSITE")) +
          portalButton(tx("RÉSERVER", "BOOK"), hotel.id) + '</div></div></article>';
  }).join("");
  const intro = esc(tr(site.brand.intro || "Hotel & Luxury Housing réunit trois établissements complémentaires à Abidjan."));
  const page = '<div class="portal-home-flow"><section class="portal-hero" role="region" aria-roledescription="carousel" aria-label="' + portalText("Trois adresses à Abidjan", "Three addresses in Abidjan") + '">' +
      '<div class="portal-hero-slides">' + slideMarkup + '</div><div class="portal-hero-shade"></div>' +
      '<div class="container portal-hero-copy"><h1><span>chaque séjour une expérience,</span><span>chaque adresse une signature</span></h1>' +
        '<a class="portal-button portal-button--light" href="/nos-hotels">' + portalText("DÉCOUVRIR NOS ADRESSES", "DISCOVER OUR ADDRESSES") + ' <span aria-hidden="true">↗</span></a>' +
      '</div><div class="portal-hero-foot">' +
      '<div class="portal-slide-arrows"><button type="button" aria-label="' + portalText("Image précédente", "Previous image") + '" data-slide-prev>‹</button><button type="button" aria-label="' + portalText("Image suivante", "Next image") + '" data-slide-next>›</button></div>' +
      '<div class="portal-slide-controls" aria-label="' + portalText("Choisir une image", "Choose an image") + '">' +
        '<button type="button" aria-label="' + portalText("Image 1", "Image 1") + '" aria-pressed="true" data-slide-to="0"></button>' +
        '<button type="button" aria-label="' + portalText("Image 2", "Image 2") + '" aria-pressed="false" data-slide-to="1"></button>' +
        '<button type="button" aria-label="' + portalText("Image 3", "Image 3") + '" aria-pressed="false" data-slide-to="2"></button>' +
      '</div><button type="button" class="portal-slide-toggle" aria-label="' + portalText("Mettre le diaporama en pause", "Pause slideshow") + '" aria-pressed="false" data-slide-toggle>Ⅱ</button></div></section>' +
    portalBookingSection() +
    '<section class="portal-section portal-intro-section"><div class="container portal-intro-grid">' +
      portalFigure("/assets/hlh-presentation-living-20261108.webp", tx("Salon des Résidences ATTA — photographie retouchée", "Résidences ATTA lounge — retouched photograph"), tx("Photographie retouchée", "Retouched photograph"), "portal-intro-photo portal-reveal") +
      '<div class="portal-intro-copy portal-reveal"><p class="eyebrow">HOTEL & LUXURY HOUSING · ABIDJAN</p><h2>' + portalText("Des adresses différentes.<br><em>Une même attention.</em>", "Different addresses.<br><em>The same care.</em>") + '</h2>' +
        '<p>' + portalText("Hotel and Luxury Housing (HLH) réunit trois adresses aux identités complémentaires à Abidjan : l'Hôtel Astral à Yopougon, les Résidences ATTA au Plateau et le Palais WIA à Cocody.", "Hotel and Luxury Housing (HLH) brings together three complementary addresses in Abidjan: H\u00f4tel Astral in Yopougon, R\u00e9sidences ATTA in Plateau and Palais WIA in Cocody.") + '</p><p>' + portalText("De l'hôtellerie d'affaires au séjour en appart'hôtel, jusqu'au boutique-hôtel de luxe, HLH partage une même ambition : offrir des expériences d'hospitalité aux standards internationaux, ancrées dans l'excellence ivoirienne.", "From business hotels and aparthotel stays to luxury boutique hospitality, HLH shares one ambition: to offer hospitality experiences of international standards, rooted in Ivorian excellence.") + '</p>' +
        '<a class="portal-link" href="/nos-hotels">' + portalText("DÉCOUVRIR LE GROUPE HLH", "DISCOVER THE HLH GROUP") + ' <span aria-hidden="true">→</span></a></div></div></section>' +
    '<section class="portal-section portal-section--soft" id="adresses"><div class="container"><div class="portal-section-heading"><div><p class="eyebrow">' + portalText("NOTRE COLLECTION", "OUR COLLECTION") + '</p><h2>' + portalText("Trois adresses.<br><em>À chacun son séjour.</em>", "Three addresses.<br><em>A stay for every need.</em>") + '</h2></div><p>' + portalText("Cocody · Plateau · Yopougon", "Cocody · Plateau · Yopougon") + '</p></div>' +
        '<div class="portal-hotel-grid">' + hotelCards + '</div></div></section>' +
    '<section class="portal-section portal-section--ink" id="restaurants"><div class="container portal-dining-layout">' +
      '<div><p class="eyebrow">' + portalText("GASTRONOMIE", "DINING") + '</p><h2>' + portalText("De la table<br><em>aux moments partagés.</em>", "From the table<br><em>to shared moments.</em>") + '</h2>' +
        '<p>' + portalText("À Cocody, La Quintessence et L’Alchimie réunissent restaurant gastronomique, bar et rendez-vous gourmands. L’Hôtel Astral propose également son restaurant, son menu du jour et des buffets les mercredis et vendredis.", "In Cocody, La Quintessence and L’Alchimie bring together fine dining, a bar and food experiences. Hôtel Astral also has a restaurant, a daily menu and buffet service on Wednesdays and Fridays.") + '</p>' +
        '<a class="portal-button portal-button--outline" href="/restaurants">' + portalText("DÉCOUVRIR LES RESTAURANTS", "DISCOVER RESTAURANTS") + ' <span aria-hidden="true">↗</span></a></div>' +
      portalFigure("/assets/hlh-gastronomie-original-20261108-v2.jpg", tx("Service au buffet du restaurant", "Restaurant buffet service"), "", "portal-dining-photo portal-reveal") +
    '</div></section>' +
    '<section class="portal-section portal-section--soft" id="reunions"><div class="container portal-editorial-grid">' +
      portalFigure("/assets/hlh-reunion-fournie-20261108.png", tx("Salle de réunion — photographie retouchée", "Meeting room — retouched photograph"), tx("Photographie retouchée", "Retouched photograph"), "portal-editorial-photo portal-reveal") +
      '<div class="portal-editorial-copy portal-reveal"><p class="eyebrow">' + portalText("RÉUNIONS & COWORKING", "MEETINGS & COWORKING") + '</p><h2>' + portalText("Des espaces pensés<br><em>pour vos échanges.</em>", "Spaces designed<br><em>for your discussions.</em>") + '</h2>' +
      '<p>' + portalText("À l'Hôtel Astral, aux Résidences ATTA et au Palais WIA, découvrez des salles de réunion adaptées à vos rencontres professionnelles. Au Plateau, les Résidences ATTA proposent également un espace de coworking pour travailler et collaborer dans un environnement dédié.", "At Hôtel Astral, Résidences ATTA and Palais WIA, discover meeting rooms suited to your professional gatherings. In Plateau, Résidences ATTA also offers a coworking space for working and collaborating in a dedicated environment.") + '</p>' +
      '<a class="portal-link" href="/salles-reunion">' + portalText("DÉCOUVRIR NOS ESPACES", "DISCOVER OUR SPACES") + ' <span aria-hidden="true">→</span></a></div></div></section>' +
    '<section class="portal-section" id="bien-etre"><div class="container portal-wellness-grid">' +
      '<div class="portal-wellness-copy"><p class="eyebrow">' + portalText("SPORT & FITNESS", "SPORT & FITNESS") + '</p><h2>' + portalText("Gardez le rythme,<br><em>où que vous séjourniez.</em>", "Keep your rhythm,<br><em>wherever you stay.</em>") + '</h2><p>' +
      portalText("Que vous séjourniez à l'Hôtel Astral, aux Résidences ATTA ou au Palais WIA, profitez d'un espace fitness pour maintenir vos habitudes sportives et prendre soin de votre forme, même en déplacement.", "Whether you stay at Hôtel Astral, Résidences ATTA or Palais WIA, enjoy a fitness space to maintain your exercise routine and stay in shape, even when travelling.") + '</p><a class="portal-link" href="/salles-de-sport">' + portalText("DÉCOUVRIR NOS SALLES DE SPORT", "DISCOVER OUR FITNESS ROOMS") + ' <span aria-hidden="true">→</span></a></div>' +
      '<div class="portal-wellness-visual"><div class="portal-wellness-image">' + portalFigure("/assets/atta-gym-bright.png", tx("Équipement de fitness — visuel d’illustration", "Fitness equipment — illustrative image"), tx("Visuel d’illustration", "Illustrative image"), "portal-wellness-photo") + '</div><div class="portal-wellness-index"><span>01</span><span>ABIDJAN · CÔTE D’IVOIRE</span></div></div>' +
    '</div></section>' +
    '<section class="portal-contact-band"><div class="container"><p class="eyebrow">' + portalText("UNE RELATION DIRECTE", "A DIRECT CONNECTION") + '</p><h2>' + portalText("Votre séjour commence<br><em>par le bon contact.</em>", "Your stay starts<br><em>with the right contact.</em>") + '</h2><a class="portal-button portal-button--gold" href="/contacts">' + portalText("CONTACTER NOS ÉQUIPES", "CONTACT OUR TEAMS") + ' <span aria-hidden="true">↗</span></a></div></section></div>';
  main.innerHTML = page;
  portalSetMeta("/");
  portalNav("/");
  renderGroupFooter();
  portalHeroSlider();
  window.HLHBookingPremium.mount(main, lang === "en");
  portalReveal();
  return true;
}

function renderHotelsPage() {
  const hotels = portalHotels();
  const content = '<section class="container portal-property-list">' + hotels.map(function (hotel, index) {
    const id = hotel.id;
    const description = tr(hotel.details || hotel.description);
    const image = ({astral: "/assets/hlh-collection-astral-20261108.webp", atta: "/assets/hlh-collection-atta-20261108.webp", wia: "/assets/hlh-collection-wia-20261108.webp"})[id] || hotel.image || portalImages[id];
    const amenities = (hotel.amenities || []).slice(0, 6);
    const imageBlock = portalFigure(image, hotel.name + " — " + hotel.location, tx("Visuel d’illustration", "Illustrative image"), "portal-property-photo");
    const body = '<div class="portal-property-copy"><p class="eyebrow">0' + (index + 1) + ' · ' + esc(hotel.location) + '</p><h2>' + esc(hotel.name) + '</h2><p class="portal-property-address">' + esc(hotel.address) + '</p><p>' + esc(description) + '</p>' +
      portalTags(amenities) + '<div class="portal-card-actions">' + portalExternalLink(id, tx("VISITER LE SITE", "VISIT THE WEBSITE"), "portal-button portal-button--outline-dark") +
      portalButton(tx("RÉSERVER", "BOOK"), id) + '</div></div>';
    return '<article class="portal-property-row ' + (index % 2 ? "is-reversed" : "") + '" id="hotel-' + esc(id) + '">' + imageBlock + body + '</article>';
  }).join("") + '</section>' +
    '<section class="portal-section portal-section--soft"><div class="container portal-contact-cta"><div><p class="eyebrow">' + portalText("BESOIN D’UN CONSEIL ?", "NEED HELP CHOOSING?") + '</p><h2>' + portalText("Nous vous orientons<br><em>vers la bonne adresse.</em>", "We can guide you<br><em>to the right address.</em>") + '</h2></div><a class="portal-button portal-button--gold" href="/contacts">' + portalText("NOUS CONTACTER", "CONTACT US") + ' <span aria-hidden="true">↗</span></a></div></section>';
  portalPage("/nos-hotels", tx("LE GROUPE HLH", "THE HLH GROUP"), tx("Nos hôtels à Abidjan", "Our hotels in Abidjan"), tx("Trois établissements, trois quartiers et des expériences complémentaires pour accueillir les séjours personnels et professionnels.", "Three properties, three districts and complementary experiences for personal and professional stays."), content);
}
function roomCardMarkup(item) {
  return '<article class="portal-room-card portal-reveal" data-group-property="' + esc(item.property) + '" data-group-kind="' + esc(item.kind) + '">' +
    portalFigure(item.image, item.name + " — " + item.propertyName, tx("Visuel d’illustration", "Illustrative image"), "portal-room-photo") +
    '<div class="portal-room-card-copy"><p class="eyebrow">' + esc(item.propertyName) + '</p><h2>' + esc(item.name) + '</h2><p>' + esc(tx(item.description, item.descriptionEn || item.description)) + '</p>' +
      (item.facts ? '<p class="portal-room-fact">' + esc(item.facts) + '</p>' : "") +
      '<div class="portal-card-actions"><a class="portal-link" href="/nos-hotels#hotel-' + esc(item.property) + '">' + portalText("DÉCOUVRIR", "DISCOVER") + ' <span aria-hidden="true">→</span></a>' +
        portalButton(tx("RÉSERVER", "BOOK"), item.property) + '</div></div></article>';
}
function renderRoomsPage() {
  const groups = [{"id": "astral", "name": "Hôtel Astral", "location": "YOPOUGON · ZONE INDUSTRIELLE", "intro": "Des hébergements confortables et fonctionnels, pensés pour vos déplacements professionnels et vos séjours à Abidjan.", "rooms": [["Chambre standard", "astral-standard.webp", "", 100000], ["Appartement", "astral-appartement.webp", "", 150000]]}, {"id": "atta", "name": "Résidences ATTA", "location": "PLATEAU · CENTRE DES AFFAIRES", "intro": "Des appartements alliant confort, autonomie et élégance, pour vos séjours professionnels ou prolongés au Plateau.", "rooms": [["Studio", "atta-studio.png", "", 100000], ["Suite", "atta-suites.png", "", 110000], ["Appartement 2 pièces française", "atta-2-pieces-francaise.png", "", 125000], ["Appartement 2 pièces américaine", "atta-2-pieces-americaine.png", "", 150000]]}, {"id": "wia", "name": "Palais WIA", "location": "COCODY · QUARTIER DES AMBASSADES", "intro": "Découvrez l’élégance d’une adresse d’exception, où chaque chambre et suite invite à vivre une expérience singulière à Abidjan.", "rooms": [["Chambre Classique", "wia-classique-fournie.png", "", 80000], ["Chambre Exécutive", "wia-executive-fournie.jpg", "", 115000], ["Suite Junior", "wia-junior-fournie.png", "", 155000], ["Suite Présidentielle", "wia-presidential-fournie.png", "", 240000]]}];
  const navigation = '<nav class="portal-stay-nav container" aria-label="Choisir un établissement">' + groups.map(g=>'<a href="#sejour-'+g.id+'">'+esc(g.name)+'</a>').join('')+'</nav>';
  const sections = groups.map((g,index)=>'<section class="portal-stay-section container" id="sejour-'+g.id+'" aria-labelledby="titre-'+g.id+'"><header class="portal-stay-heading"><p class="eyebrow">0'+(index+1)+' · '+esc(g.location)+'</p><h2 id="titre-'+g.id+'">'+esc(g.name)+'</h2><p>'+esc(g.intro)+'</p></header><div class="portal-stay-grid">'+g.rooms.map((r,i)=>{
    const category=['classic','executive','junior','presidential'][i];
    const discovery=g.id==='wia'?'https://palais-wia-preview.netlify.app/suites/':window.HLH_SITE_LINKS[g.id].site;
    return '<article class="portal-stay-card">'+portalFigure('/assets/hlh-hebergements/'+r[1],r[0]+' — '+g.name,'Photographie du projet de référence','portal-stay-photo')+'<div class="portal-stay-copy"><h3>'+esc(r[0])+'</h3>'+(r[2]?'<p class="portal-stay-area">'+esc(r[2])+'</p>':'')+(g.id==='wia'?'':'<p class="portal-stay-rate">'+new Intl.NumberFormat('fr-FR').format(r[3])+' FCFA <span>/ nuit · tarif de démonstration</span></p>')+'<div class="portal-card-actions"><a class="portal-link" href="'+esc(discovery)+'" target="_blank" rel="noopener noreferrer">DÉCOUVRIR <span aria-hidden="true">↗</span></a>'+portalButton('VOIR LES DISPONIBILITÉS',g.id)+'</div></div></article>';
  }).join('')+'</div></section>').join('');
  portalPage('/chambres-suites','HÉBERGEMENTS HLH','Trois adresses, autant de façons de séjourner.',"De l’hôtel d’affaires aux appartements haut de gamme, jusqu’aux chambres et suites du Palais WIA, découvrez des hébergements adaptés à chaque séjour à Abidjan.",navigation+sections+'<p class="container portal-stay-note">Présentation de démonstration : tarifs non contractuels, disponibilités et conditions à confirmer auprès des établissements. Aucune réservation ni aucun paiement réel.</p>');
}
function renderRestaurantsPage() {
  const content =
    '<section class="container portal-food-intro"><div class="portal-food-photo">' +
      portalFigure("/assets/hlh-chef-mael-20261108.png", tx("Chef Maël Monchauzou au dressage d’un plat", "Chef Maël Monchauzou plating a dish"), tx("Chef Maël Monchauzou · Palais WIA", "Chef Maël Monchauzou · Palais WIA"), "portal-chef-photo") +
      '</div><div class="portal-food-copy"><p class="eyebrow">' + portalText("PALAIS WIA · COCODY", "PALAIS WIA · COCODY") + '</p><h2>La Quintessence<br><em>& L’Alchimie</em></h2>' +
      '<p>' + portalText("Plongez dans une expérience gastronomique d’exception où chaque déjeuner ou dîner se transforme en un moment de pur plaisir.", "Immerse yourself in an exceptional gastronomic experience, where every lunch or dinner becomes a moment of pure pleasure.") + '</p>' +
      '<p>' + portalText("Avec l’arrivée du Chef Maël Monchauzou, le Palais WIA accueille une nouvelle signature culinaire. Inspirée de ses racines méditerranéennes et de son parcours international, sa cuisine met à l’honneur la qualité des produits, la créativité et les saveurs locales.", "With the arrival of Chef Maël Monchauzou, Palais WIA welcomes a new culinary signature. Inspired by his Mediterranean roots and international experience, his cuisine celebrates quality ingredients, creativity and local flavours.") + '</p>' +
      '<div class="portal-card-actions">' + portalExternalLink("wia", tx("VISITER LE SITE DU PALAIS WIA", "VISIT PALAIS WIA"), "portal-button portal-button--outline-dark") +
      '<button type="button" class="portal-button portal-button--gold" data-inquiry="Renseignements — La Quintessence" data-kind="contact" data-hotelid="wia">' + portalText("DEMANDER UN RENSEIGNEMENT", "REQUEST INFORMATION") + '</button></div></div></section>' +
    '<section class="portal-section"><div class="container portal-astral-dining" id="restaurant-astral">' + portalFigure("/assets/hlh-astral-restaurant-20261112.webp", tx("Restaurant de l’Hôtel Astral", "Hôtel Astral restaurant"), "", "portal-astral-restaurant-photo") + '<div class="portal-astral-dining-copy"><p class="eyebrow">' + portalText("HÔTEL ASTRAL · YOPOUGON", "HÔTEL ASTRAL · YOPOUGON") + '</p><h2>' + portalText("Le restaurant<br><em>de l’Hôtel Astral.</em>", "Dining at<br><em>Hôtel Astral.</em>") + '</h2>' +
      '<p>' + portalText("L’Hôtel Astral propose un restaurant, un menu du jour et des buffets les mercredis et vendredis. La composition et les modalités sont à confirmer auprès de l’établissement.", "Hôtel Astral offers a restaurant, a daily menu and buffet service on Wednesdays and Fridays. Confirm the menu and arrangements with the property.") + '</p>' +
      '<div class="portal-card-actions">' + portalExternalLink("astral", tx("VISITER LE SITE DE L’HÔTEL ASTRAL", "VISIT HÔTEL ASTRAL"), "portal-button portal-button--outline-dark") +
      '<button type="button" class="portal-button portal-button--gold" data-inquiry="Renseignements — Restaurant Astral" data-kind="contact" data-hotelid="astral">' + portalText("DEMANDER UN RENSEIGNEMENT", "REQUEST INFORMATION") + '</button></div></div>' +
      '</div></section>';
  portalPage("/restaurants", tx("RESTAURATION", "DINING"), tx("Restaurants & gastronomie", "Restaurants & dining"), tx("La Quintessence et L’Alchimie au Palais WIA, ainsi que le restaurant de l’Hôtel Astral : découvrez les expériences de restauration du groupe HLH.", "La Quintessence and L’Alchimie at Palais WIA, alongside Hôtel Astral’s restaurant: explore the dining experiences across HLH."), content);
}
function renderMeetingsPage() {
  const content =
    '<section class="container portal-venue-list">' +
      '<article class="portal-property-row is-reversed" id="reunions-astral">' +
        portalFigure("/assets/hlh-reunions-20261112/astral.png", tx("Salle de réunion de l’Hôtel Astral, table et sièges", "Hôtel Astral meeting room, table and seating"), tx("Hôtel Astral · Salle de réunion", "Hôtel Astral · Meeting room"), "portal-property-photo") +
        '<div class="portal-property-copy"><p class="eyebrow">' + portalText("HÔTEL ASTRAL · YOPOUGON", "HÔTEL ASTRAL · YOPOUGON") + '</p><h2>' + portalText("Réunions professionnelles", "Business meetings") + '</h2><p>' +
        portalText("L’Hôtel Astral dispose d’une salle de réunion connectée pour les rendez-vous professionnels et les séminaires. Les équipements et la capacité sont à confirmer auprès de l’hôtel.", "Hôtel Astral has a connected meeting room for business appointments and seminars. Confirm equipment and capacity with the hotel.") + '</p>' +
        '<button type="button" class="portal-button portal-button--gold" data-inquiry="Demande de devis — Hôtel Astral" data-kind="business" data-hotelid="astral">' + portalText("DEMANDER UN DEVIS", "REQUEST A QUOTE") + '</button></div></article>' +
      '<article class="portal-property-row" id="coworking-atta">' +
        portalFigure("/assets/hlh-reunions-20261112/atta.png", tx("Salle des Résidences ATTA, table de réunion et sièges", "Résidences ATTA room, meeting table and seating"), tx("Résidences ATTA · Espace professionnel", "Résidences ATTA · Professional space"), "portal-property-photo") +
        '<div class="portal-property-copy"><p class="eyebrow">' + portalText("RÉSIDENCES ATTA · PLATEAU", "RÉSIDENCES ATTA · PLATEAU") + '</p><h2>' + portalText("Coworking au Plateau", "Coworking in Plateau") + '</h2><p>' +
        portalText("L’espace de coworking des Résidences ATTA constitue une solution complémentaire pour travailler au cœur du Plateau. Il n’est pas présenté comme une salle de conférence.", "The coworking space at Résidences ATTA is an additional option for working in the heart of Plateau. It is not presented as a conference room.") + '</p>' +
        '<button type="button" class="portal-button portal-button--outline-dark" data-inquiry="Visite coworking — Résidences ATTA" data-kind="coworking" data-hotelid="atta">' + portalText("DEMANDER UNE VISITE", "REQUEST A VISIT") + '</button></div></article>' +
      '<article class="portal-property-row is-reversed" id="evenements-wia">' +
        portalFigure("/assets/hlh-reunions-20261112/wia.png", tx("Salle de réunion du Palais WIA, grande table dressée", "Palais WIA meeting room, prepared conference table"), tx("Palais WIA · Salle de réunion", "Palais WIA · Meeting room"), "portal-property-photo") +
        '<div class="portal-property-copy"><p class="eyebrow">' + portalText("PALAIS WIA · COCODY", "PALAIS WIA · COCODY") + '</p><h2>' + portalText("Réunions & événements", "Meetings & events") + '</h2><p>' +
        portalText("Le Palais WIA propose des espaces pour les réunions professionnelles, les événements privés et les célébrations. Les formats, la capacité et les prestations sont à confirmer auprès de l’établissement.", "Palais WIA offers spaces for professional meetings, private events and celebrations. Formats, capacity and services should be confirmed with the property.") + '</p>' +
        '<button type="button" class="portal-button portal-button--gold" data-inquiry="Demande de devis — Palais WIA" data-kind="business" data-hotelid="wia">' + portalText("DEMANDER UN DEVIS", "REQUEST A QUOTE") + '</button></div></article>' +
    '</section>';
  portalPage("/salles-reunion", tx("ENTREPRISES & CÉLÉBRATIONS", "BUSINESS & CELEBRATIONS"), tx("Réunions & événements", "Meetings & events"), tx("Des espaces professionnels au Palais WIA et à l’Hôtel Astral, et le coworking des Résidences ATTA au Plateau.", "Professional spaces at Palais WIA and Hôtel Astral, plus coworking at Résidences ATTA in Plateau."), content);
}
function renderWellnessPage() {
  const properties = [
    {id:'astral',anchor:'astral',name:'HÔTEL ASTRAL · YOPOUGON',title:["L'énergie au cœur de vos déplacements.",'Energy at the heart of your travels.'],copy:["Entre deux rendez-vous, conservez vos habitudes d'entraînement grâce à la salle de sport de l'Hôtel Astral. Une attention supplémentaire pour accompagner vos séjours professionnels à Yopougon.",'Between appointments, maintain your training routine in Hôtel Astral’s fitness room. A thoughtful addition to your business stays in Yopougon.'],cta:["DÉCOUVRIR L'HÔTEL ASTRAL",'DISCOVER HÔTEL ASTRAL']},
    {id:'atta',anchor:'atta',name:'RÉSIDENCES ATTA · PLATEAU',title:['Votre routine, à votre rythme.','Your routine, at your own pace.'],copy:["Aux Résidences ATTA, poursuivez vos habitudes fitness tout au long de votre séjour. Un espace dédié à l'entraînement complète le confort et l'autonomie de votre appartement au cœur du Plateau.",'At Résidences ATTA, keep up your fitness routine throughout your stay. A dedicated training space complements the comfort and independence of your apartment in the heart of Plateau.'],cta:['DÉCOUVRIR LES RÉSIDENCES ATTA','DISCOVER RÉSIDENCES ATTA']},
    {id:'wia',anchor:'palais-wia',name:'PALAIS WIA · COCODY',title:['Une parenthèse active dans un cadre singulier.','An active interlude in a distinctive setting.'],copy:["Au Palais WIA, accordez une place à votre forme au fil de votre séjour. L'espace fitness complète l'expérience de cette adresse confidentielle, située au cœur du quartier des Ambassades à Cocody.",'At Palais WIA, make time for your fitness throughout your stay. The fitness space complements the experience of this discreet address in Cocody’s Embassies district.'],cta:['DÉCOUVRIR LE PALAIS WIA','DISCOVER PALAIS WIA']}
  ];
  const rows = properties.map(function (p, index) {
    const visual = portalFigure("/assets/hlh-fitness-fourni-20261112/" + p.id + ".png", tx(p.id === "astral" ? "Entraînement sur tapis de course — Hôtel Astral" : p.id === "atta" ? "Exercice avec kettlebell — Résidences ATTA" : "Espace fitness — Palais WIA, haltères et ballon", p.id === "astral" ? "Treadmill workout — Hôtel Astral" : p.id === "atta" ? "Kettlebell exercise — Résidences ATTA" : "Fitness space — Palais WIA, dumbbells and exercise ball"), p.name, "portal-property-photo");
    return '<article class="portal-property-row' + (index !== 1 ? ' is-reversed' : '') + '" id="' + p.anchor + '"><span class="portal-fitness-legacy" id="fitness-' + p.id + '"></span>' + visual + '<div class="portal-property-copy"><p class="eyebrow">' + esc(p.name) + '</p><h2>' + portalText(p.title[0],p.title[1]) + '</h2><p>' + portalText(p.copy[0],p.copy[1]) + '</p><div class="portal-card-actions">' + portalExternalLink(p.id,tx(p.cta[0],p.cta[1]),'portal-button portal-button--gold') + '<button type="button" class="portal-link-button" data-inquiry="Renseignements fitness" data-kind="contact" data-hotelid="' + p.id + '">' + portalText('SE RENSEIGNER','ENQUIRE') + ' →</button></div></div></article>';
  }).join('');
  portalPage('/salles-de-sport',tx('FITNESS À ABIDJAN','FITNESS IN ABIDJAN'),tx('Gardez le rythme, même en déplacement.','Keep your rhythm, even when travelling.'),tx("À Yopougon, au Plateau et à Cocody, trois adresses HLH vous permettent de conserver vos habitudes d'entraînement pendant votre séjour à Abidjan.",'In Yopougon, Plateau and Cocody, three HLH addresses help you maintain your training routine during your stay in Abidjan.'),'<section class="container portal-venue-list portal-fitness-reference">' + rows + '</section>');
}
function phoneLinks(phone) {
  return String(phone || "").split(/[\/,]/).map(function (part) {
    const number = part.trim();
    if (!number) return "";
    return '<a href="tel:' + esc(number.replace(/[^\d+]/g, "")) + '">' + esc(number) + '</a>';
  }).join("");
}
function renderContactsPage() {
  const cards = portalHotels().map(function (hotel) {
    const map = hotel.mapUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(hotel.address || hotel.location);
    return '<article class="portal-contact-card" id="contact-' + esc(hotel.id) + '"><p class="eyebrow">' + esc(hotel.location) + '</p><h2>' + esc(hotel.name) + '</h2>' +
      '<p>' + esc(hotel.address) + '</p><div class="portal-contact-links">' + phoneLinks(hotel.phone) +
      (hotel.email ? '<a href="mailto:' + esc(hotel.email) + '">' + esc(hotel.email) + '</a>' : "") +
      '<a href="' + esc(map) + '" target="_blank" rel="noopener noreferrer">' + portalText("ITINÉRAIRE GOOGLE MAPS", "GOOGLE MAPS DIRECTIONS") + ' ↗</a>' +
      '</div><div class="portal-card-actions">' + portalExternalLink(hotel.id, tx("VISITER LE SITE", "VISIT THE WEBSITE"), "portal-link") +
      '<button type="button" class="portal-link-button" data-contact-hotel="' + esc(hotel.id) + '">' + portalText("ÉCRIRE À L’ÉQUIPE", "MESSAGE THE TEAM") + ' →</button></div></article>';
  }).join("");
  const hotelOptions = portalHotels().map(function (hotel) { return '<option value="' + esc(hotel.id) + '">' + esc(hotel.name) + '</option>'; }).join("");
  const form = '<form id="group-contact-form" class="portal-contact-form modalform" data-local-demo novalidate aria-label="' + esc(tx('Formulaire de contact de démonstration','Demonstration contact form')) + '">' +
    contactFields() +
    '<label class="full">' + portalText("Établissement concerné", "Property") + '<select name="hotel" required>' +
      '<option value="">' + portalText("Choisir une adresse", "Choose a property") + '</option><option value="all">Groupe HLH</option>' + hotelOptions +
    '</select></label>' +
    '<label class="full">' + portalText("Objet de la demande", "Subject") + '<select name="kind" required>' +
      '<option value="contact">' + portalText("Contact général", "General enquiry") + '</option>' +
      '<option value="stay">' + portalText("Court séjour", "Short stay") + '</option>' +
      '<option value="long">' + portalText("Long séjour", "Long stay") + '</option>' +
      '<option value="business">' + portalText("Entreprise / événement", "Business / event") + '</option>' +
      '<option value="coworking">Coworking</option>' +
    '</select></label>' +
    '<label class="portal-contact-arrival" hidden>' + portalText("Date d’arrivée souhaitée", "Preferred arrival") + '<input type="date" name="arrival" value="' + esc(bookingState.arrival || "") + '" min="' + esc(iso(currentDate)) + '"></label>' +
    '<label class="portal-contact-departure" hidden>' + portalText("Date de départ souhaitée", "Preferred departure") + '<input type="date" name="departure" value="' + esc(bookingState.departure || "") + '" min="' + esc(iso(currentDate)) + '"></label>' +
    '<p class="formerror full" role="alert"></p>' +
    '<button type="submit" class="portal-button portal-button--gold full">' + portalText("VÉRIFIER MA DEMANDE — DÉMO", "CHECK MY ENQUIRY — DEMO") + '</button>' +
      '<p class="portal-form-note full">' + portalText("Démonstration : vérification locale uniquement. Aucune donnée enregistrée, aucun message envoyé. Pour nous joindre, utilisez les coordonnées ci-dessus.", "Demonstration: local checks only. No data stored and no message sent. To contact us, use the details above.") + '</p></form>';
  const content = '<section class="container"><div class="portal-contact-grid">' + cards + '</div></section>' +
    '<section class="portal-section portal-section--soft"><div class="container portal-contact-form-layout"><div><p class="eyebrow">' + portalText("NOUS ÉCRIRE", "WRITE TO US") + '</p><h2>' + portalText("Votre demande,<br><em>à la bonne équipe.</em>", "Your enquiry,<br><em>to the right team.</em>") + '</h2><p>' + portalText("Choisissez l'établissement concerné et précisez votre besoin. Cette démonstration vous permet de préparer votre demande, sans l'envoyer.", "Choose the property and tell us what you need. This demonstration lets you prepare your enquiry without sending it.") + '</p></div>' + form + '</div></section>';
  portalPage("/contacts", tx("CONTACTS", "CONTACT"), tx("Nos équipes à votre écoute", "Our teams are here to help"), tx("Une question, une demande particulière ? Retrouvez les coordonnées de nos trois établissements à Abidjan ou contactez directement l'équipe de votre choix.", "A question or a special request? Find contact details for our three properties in Abidjan or contact your chosen team directly."), content);
  const contactForm = document.querySelector("#group-contact-form");
  if (contactForm) {
    const kindField = contactForm.elements.kind;
    const arrival = contactForm.elements.arrival;
    const departure = contactForm.elements.departure;
    const arrivalLabel = contactForm.querySelector(".portal-contact-arrival");
    const departureLabel = contactForm.querySelector(".portal-contact-departure");
    const syncRequestDates = function () {
      const required = ["stay", "long", "business"].includes(kindField.value);
      arrival.required = required;
      departure.required = required;
      arrivalLabel.hidden = !required;
      departureLabel.hidden = !required;
    };
    kindField.addEventListener("change", syncRequestDates);
    syncRequestDates();
    // Keep the shared fields and validation constraints, but order this page independently.
    ['name','email','phone','company','hotel','kind','country','arrival','departure','message','consent','website'].forEach(function (name) {
      const field = contactForm.elements[name];
      const label = field.closest('label');
      if (name === 'hotel' || name === 'kind') label.classList.remove('full');
      if (name === 'country') label.classList.add('portal-contact-country');
      if (name === 'message') label.firstChild.textContent = tx('Votre message','Your message');
      contactForm.insertBefore(label, contactForm.querySelector('.formerror'));
    });
    const controls = Array.from(contactForm.querySelectorAll('input:not([name="website"]),select,textarea'));
    const showFieldError = function (field) {
      const id = 'contact-error-' + field.name;
      let error = contactForm.querySelector('#' + id);
      if (!error) { error = document.createElement('span'); error.id = id; error.className = 'portal-field-error'; field.closest('label').append(error); field.setAttribute('aria-describedby',id); }
      error.textContent = field.validity.valid ? '' : field.validationMessage;
      field.setAttribute('aria-invalid',String(!field.validity.valid));
    };
    controls.forEach(function (field) { field.addEventListener('input',function () { if (field.hasAttribute('aria-invalid')) showFieldError(field); contactForm.querySelector('.formerror').textContent = ''; }); });
    // This page is a client-only demonstration. Never call bindRequestForm or an API here.
    contactForm.onsubmit = function (event) {
      event.preventDefault();
      const invalid = controls.filter(function (field) { return !field.validity.valid; });
      controls.forEach(showFieldError);
      if (invalid.length) { invalid[0].focus(); return; }
      contactForm.querySelector('.formerror').textContent = tx('Vérification terminée. Démonstration uniquement : aucun message envoyé et aucune donnée enregistrée.','Checks complete. Demonstration only: no message sent and no data stored.');
    };
    document.querySelectorAll('[data-contact-hotel]').forEach(function (button) {
      button.addEventListener('click',function () {
        contactForm.elements.hotel.value = button.dataset.contactHotel;
        contactForm.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
        contactForm.elements.hotel.focus({preventScroll:true});
      });
    });
  }
}
function applyPortalRoomFilters() {
  const root = document.querySelector("#portal-room-filters");
  if (!root) return;
  const property = root.querySelector("[data-group-filter-property].is-active")?.dataset.groupFilterProperty || "all";
  const kind = root.querySelector("[data-group-filter-kind].is-active")?.dataset.groupFilterKind || "all";
  root.querySelectorAll(".portal-room-card").forEach(function (card) {
    const propertyMatch = property === "all" || card.dataset.groupProperty === property;
    const kindMatch = kind === "all" || card.dataset.groupKind === kind;
    card.hidden = !(propertyMatch && kindMatch);
  });
}
let portalBookingSequence = 0;
function portalBookingSection() {
  return window.HLHBookingPremium.markup(lang === "en");
}
function portalBookingFormMarkup(preferred) {
  const id = "portal-booking-form-" + (++portalBookingSequence);
  return '<form class="portal-booking-form" data-portal-booking data-booking-id="' + id + '" data-preferred="' + esc(preferred || "") + '" novalidate>' +
    '<label class="portal-booking-field portal-booking-property"><span>' + portalText("ÉTABLISSEMENT", "PROPERTY") + '</span><select name="property" data-booking-property required><option value="">' + portalText("Choisir une adresse", "Choose a property") + '</option><option value="astral">Hôtel Astral · Yopougon</option><option value="atta">Résidences ATTA · Plateau</option><option value="wia">Palais WIA · Cocody</option></select></label>' +
    '<div class="portal-booking-field portal-booking-date-field"><span>' + portalText("ARRIVÉE", "CHECK-IN") + '</span><button type="button" class="portal-booking-trigger" data-booking-field="arrival" aria-haspopup="dialog" aria-expanded="false"><span data-date-value="arrival">' + portalText("Choisir une date", "Choose a date") + '</span><span class="portal-booking-icon" aria-hidden="true">↘</span></button><div class="portal-booking-panel" data-booking-panel="arrival" role="dialog" aria-label="' + portalText("Choisir une date d’arrivée", "Choose arrival date") + '" hidden></div></div>' +
    '<div class="portal-booking-field portal-booking-date-field portal-booking-date-field--departure"><span>' + portalText("DÉPART", "CHECK-OUT") + '</span><button type="button" class="portal-booking-trigger" data-booking-field="departure" aria-haspopup="dialog" aria-expanded="false"><span data-date-value="departure">' + portalText("Choisir une date", "Choose a date") + '</span><span class="portal-booking-icon" aria-hidden="true">↗</span></button><div class="portal-booking-panel" data-booking-panel="departure" role="dialog" aria-label="' + portalText("Choisir une date de départ", "Choose departure date") + '" hidden></div></div>' +
    '<div class="portal-booking-field portal-booking-count-field portal-booking-count-field--rooms"><span>' + portalText("CHAMBRES", "ROOMS") + '</span><button type="button" class="portal-booking-trigger" data-booking-field="rooms" aria-haspopup="dialog" aria-expanded="false"><span data-count-summary="rooms">1 chambre</span><span class="portal-booking-icon" aria-hidden="true">⌄</span></button><div class="portal-booking-panel" data-booking-panel="rooms" role="dialog" aria-label="' + portalText("Choisir le nombre de chambres", "Choose number of rooms") + '" hidden></div></div>' +
    '<div class="portal-booking-field portal-booking-count-field portal-booking-count-field--guests"><span>' + portalText("VOYAGEURS", "GUESTS") + '</span><button type="button" class="portal-booking-trigger" data-booking-field="guests" aria-haspopup="dialog" aria-expanded="false"><span data-count-summary="guests">2 adultes · 0 enfant</span><span class="portal-booking-icon" aria-hidden="true">⌄</span></button><div class="portal-booking-panel" data-booking-panel="guests" role="dialog" aria-label="' + portalText("Choisir les voyageurs", "Choose guests") + '" hidden></div></div>' +
    '<button type="submit" class="portal-booking-submit"><span>' + portalText("RECHERCHER LES DISPONIBILITÉS", "SEARCH AVAILABILITY") + '</span><span aria-hidden="true">↗</span></button>' +
    '<p class="portal-booking-capacity">' + portalText("Adultes : 13 ans et plus · Enfants : jusqu’à 12 ans. La capacité et les disponibilités sont confirmées par chaque établissement.", "Adults: 13 and over · Children: up to 12. Capacity and availability are confirmed by each property.") + '</p>' +
    '<p class="portal-booking-feedback" data-booking-feedback role="status" aria-live="polite"></p></form>';
}
function portalBookingToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}
function portalBookingDateKey(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}
function portalBookingParseDate(key) {
  if (!key) return null;
  const parts = key.split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}
function portalBookingFormatDate(key) {
  const date = portalBookingParseDate(key);
  return date ? new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(date) : "";
}
function portalBookingMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function portalBookingCalendarMonth(form, month, monthIndex) {
  const state = form.__portalBooking;
  const first = portalBookingMonthStart(new Date(month.getFullYear(), month.getMonth() + monthIndex, 1));
  const monthName = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { month: "long", year: "numeric" }).format(first);
  const mondayOffset = (first.getDay() + 6) % 7;
  const todayKey = portalBookingDateKey(portalBookingToday());
  const cells = [];
  for (let index = 0; index < 42; index += 1) {
    const day = new Date(first.getFullYear(), first.getMonth(), 1 - mondayOffset + index);
    if (day.getMonth() !== first.getMonth()) {
      cells.push('<span class="portal-calendar-empty" aria-hidden="true"></span>');
      continue;
    }
    const key = portalBookingDateKey(day);
    const isArrival = key === state.arrival;
    const isDeparture = key === state.departure;
    const inRange = state.arrival && state.departure && key > state.arrival && key < state.departure;
    const disabled = key < todayKey || (state.dateMode === "departure" && (!state.arrival || key <= state.arrival));
    const classes = [isArrival || isDeparture ? "is-selected" : "", inRange ? "is-in-range" : ""].filter(Boolean).join(" ");
    const label = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(day);
    const accessibleLabel = isArrival ? portalText("Arrivée, ", "Arrival, ") + label : isDeparture ? portalText("Départ, ", "Departure, ") + label : label;
    cells.push('<button type="button" class="portal-calendar-day ' + classes + '" data-calendar-date="' + key + '" aria-label="' + esc(accessibleLabel) + '"' + (isArrival || isDeparture ? ' aria-pressed="true"' : ' aria-pressed="false"') + (key === todayKey ? ' aria-current="date"' : "") + (disabled ? " disabled" : "") + '>' + day.getDate() + '</button>');
  }
  const weekdays = (lang === "en" ? ["M", "T", "W", "T", "F", "S", "S"] : ["L", "M", "M", "J", "V", "S", "D"]).map(function (day) { return '<span aria-hidden="true">' + day + '</span>'; }).join("");
  return '<section class="portal-calendar-month" data-month-index="' + monthIndex + '" aria-label="' + esc(monthName) + '"><h4>' + esc(monthName) + '</h4><div class="portal-calendar-weekdays">' + weekdays + '</div><div class="portal-calendar-days">' + cells.join("") + '</div></section>';
}
function portalBookingCalendarMarkup(form) {
  const state = form.__portalBooking;
  const departureNeedsArrival = state.dateMode === "departure" && !state.arrival;
  const nights = state.arrival && state.departure ? Math.round((portalBookingParseDate(state.departure) - portalBookingParseDate(state.arrival)) / 86400000) : 0;
  return '<div class="portal-calendar"><div class="portal-calendar-header"><button type="button" data-calendar-prev aria-label="' + portalText("Mois précédent", "Previous month") + '">‹</button><p>' + (departureNeedsArrival ? portalText("Choisissez d’abord l’arrivée", "Choose check-in first") : state.dateMode === "departure" ? portalText("Choisissez le départ", "Choose check-out") : portalText("Choisissez l’arrivée", "Choose check-in")) + '</p><button type="button" data-calendar-next aria-label="' + portalText("Mois suivant", "Next month") + '">›</button></div><div class="portal-calendar-months">' + portalBookingCalendarMonth(form, state.visibleMonth, 0) + portalBookingCalendarMonth(form, state.visibleMonth, 1) + '</div><div class="portal-calendar-footer"><span data-booking-nights>' + (nights ? esc(nights + " " + portalText(nights === 1 ? "nuit" : "nuits", nights === 1 ? "night" : "nights")) : portalText("Sélectionnez vos dates", "Select your dates")) + '</span><button type="button" class="portal-booking-apply" data-booking-apply>' + portalText("APPLIQUER", "APPLY") + '</button></div></div>';
}
function portalBookingCountersMarkup(form, type) {
  const state = form.__portalBooking;
  const groups = type === "rooms" ? [{ key: "rooms", title: portalText("Chambres / appartements", "Rooms / apartments"), note: portalText("Nombre d’unités souhaitées", "Number of units requested"), min: 1 }] : [
    { key: "adults", title: portalText("Adultes", "Adults"), note: portalText("13 ans et plus", "13 and over"), min: 1 },
    { key: "children", title: portalText("Enfants", "Children"), note: portalText("Jusqu’à 12 ans", "Up to 12"), min: 0 }
  ];
  return '<div class="portal-counter-panel"><p class="portal-counter-heading">' + (type === "rooms" ? portalText("Choisissez vos unités", "Choose your rooms") : portalText("Voyageurs & chambres", "Guests & rooms")) + '</p>' + groups.map(function (group) {
    const attaCapacityReached = group.key !== "rooms" && form.querySelector("[data-booking-property]").value === "atta" && state.adults + state.children >= 3;
    return '<div class="portal-counter-row"><span><strong>' + group.title + '</strong><small>' + group.note + '</small></span><span class="portal-counter-controls"><button type="button" data-booking-count="' + group.key + '" data-delta="-1" aria-label="' + esc(portalText("Réduire ", "Decrease ") + group.title) + '"' + (state[group.key] <= group.min ? " disabled" : "") + '>−</button><output data-count-value="' + group.key + '">' + state[group.key] + '</output><button type="button" data-booking-count="' + group.key + '" data-delta="1" aria-label="' + esc(portalText("Augmenter ", "Increase ") + group.title) + '"' + (attaCapacityReached ? " disabled" : "") + '>+</button></span></div>';
  }).join("") + '<p class="portal-counter-help">' + (type === "rooms" ? portalText("Le nombre de chambres est indépendant du nombre de voyageurs. La capacité exacte sera confirmée par l’établissement.", "Rooms are chosen independently from the number of guests. Exact capacity is confirmed by the property.") : portalText("Les enfants peuvent être accompagnés d’une demande d’âge par l’établissement. Les capacités sont confirmées par l’adresse choisie.", "The property may request children’s ages. Capacity is confirmed by your selected address.")) + '</p><button type="button" class="portal-booking-apply" data-booking-apply>' + portalText("APPLIQUER", "APPLY") + '</button></div>';
}
function portalBookingPositionPanel(form, panel, trigger) {
  if (!panel || panel.hidden || !trigger) return;
  panel.classList.remove("is-above");
  panel.style.removeProperty("position");
  panel.style.removeProperty("left");
  panel.style.removeProperty("right");
  panel.style.removeProperty("top");
  panel.style.removeProperty("bottom");
  panel.style.removeProperty("max-height");
  const headerBottom = (document.getElementById("header")?.getBoundingClientRect().bottom || 0) + 10;
  const triggerRect = trigger.getBoundingClientRect();
  const fieldRect = panel.parentElement.getBoundingClientRect();
  const panelWidth = Math.min(panel.getBoundingClientRect().width, window.innerWidth - 24);
  if (window.matchMedia("(max-width: 620px)").matches) {
    panel.style.position = "fixed";
    panel.style.left = "50%";
    panel.style.right = "auto";
    panel.style.top = headerBottom + "px";
    panel.style.bottom = "auto";
    panel.style.transform = "translateX(-50%)";
    panel.style.maxHeight = Math.max(160, window.innerHeight - headerBottom - 20) + "px";
    return;
  }
  panel.style.removeProperty("transform");
  const rightAnchored = panel.parentElement.classList.contains("portal-booking-date-field--departure") || panel.parentElement.classList.contains("portal-booking-count-field");
  const preferredLeft = rightAnchored ? fieldRect.right - panelWidth : fieldRect.left;
  const viewportLeft = Math.max(12, Math.min(preferredLeft, window.innerWidth - panelWidth - 12));
  panel.style.left = (viewportLeft - fieldRect.left) + "px";
  panel.style.right = "auto";
  const desiredHeight = Math.min(panel.scrollHeight, window.innerHeight * 0.72, 620);
  const spaceBelow = Math.max(0, window.innerHeight - triggerRect.bottom - 22);
  const spaceAbove = Math.max(0, triggerRect.top - headerBottom - 12);
  const openAbove = spaceBelow < 150 && spaceAbove > spaceBelow;
  panel.classList.toggle("is-above", openAbove);
  const availableSpace = openAbove ? spaceAbove : spaceBelow;
  if (Math.max(spaceAbove, spaceBelow) < 150) {
    const width = Math.min(panel.getBoundingClientRect().width, window.innerWidth - 24);
    panel.classList.remove("is-above");
    panel.style.position = "fixed";
    panel.style.left = Math.max(12, Math.min(triggerRect.left, window.innerWidth - width - 12)) + "px";
    panel.style.right = "auto";
    panel.style.top = headerBottom + "px";
    panel.style.maxHeight = Math.max(120, window.innerHeight - headerBottom - 16) + "px";
    return;
  }
  panel.style.maxHeight = Math.min(desiredHeight, availableSpace) + "px";
}
function portalBookingUpdate(form) {
  const state = form.__portalBooking;
  if (!state) return;
  form.querySelectorAll("[data-date-value]").forEach(function (node) {
    const key = node.dataset.dateValue;
    node.textContent = state[key] ? portalBookingFormatDate(state[key]) : portalText("Choisir une date", "Choose a date");
  });
  const roomsSummary = state.rooms + " " + portalText(state.rooms === 1 ? "chambre" : "chambres", state.rooms === 1 ? "room" : "rooms");
  const guestsSummary = state.adults + " " + portalText(state.adults > 1 ? "adultes" : "adulte", state.adults > 1 ? "adults" : "adult") + " · " + state.children + " " + portalText(state.children > 1 ? "enfants" : "enfant", state.children > 1 ? "children" : "child");
  form.querySelector('[data-count-summary="rooms"]').textContent = roomsSummary;
  form.querySelector('[data-count-summary="guests"]').textContent = guestsSummary;
  form.querySelectorAll("[data-count-value]").forEach(function (node) { node.textContent = state[node.dataset.countValue]; });
  form.querySelectorAll("[data-booking-count]").forEach(function (button) {
    const key = button.dataset.bookingCount;
    const minimum = key === "children" ? 0 : 1;
    button.disabled = button.dataset.delta === "-1" && state[key] <= minimum;
    if (key !== "rooms" && button.dataset.delta === "1" && form.querySelector("[data-booking-property]").value === "atta") button.disabled = state.adults + state.children >= 3;
  });
  const feedback = form.querySelector("[data-booking-feedback]");
  const overAttaCapacity = form.querySelector("[data-booking-property]").value === "atta" && state.adults + state.children > 3;
  if (overAttaCapacity) feedback.textContent = portalText("Les Résidences ATTA limitent la recherche à 3 voyageurs. Ajustez le nombre avant de continuer.", "Résidences ATTA allows up to 3 guests. Adjust the number to continue.");
  else if (feedback.dataset.error !== "true") feedback.textContent = "";
  form.querySelectorAll("[data-booking-panel]").forEach(function (panel) {
    if (!panel.hidden) {
      panel.innerHTML = panel.dataset.bookingPanel === "arrival" || panel.dataset.bookingPanel === "departure" ? portalBookingCalendarMarkup(form) : portalBookingCountersMarkup(form, panel.dataset.bookingPanel);
      portalBookingPositionPanel(form, panel, state.activeButton);
    }
  });
}
function portalBookingClosePanel(form, restoreFocus) {
  form.querySelectorAll("[data-booking-panel]").forEach(function (panel) { panel.hidden = true; });
  form.closest("#portal-booking")?.style.removeProperty("padding-bottom");
  form.querySelectorAll("[data-booking-field]").forEach(function (button) { button.setAttribute("aria-expanded", "false"); });
  if (restoreFocus && form.__portalBooking?.activeButton) form.__portalBooking.activeButton.focus();
}
function portalBookingOpenPanel(form, field, button) {
  const state = form.__portalBooking;
  portalBookingClosePanel(form, false);
  state.activeButton = button;
  if (field === "arrival" || field === "departure") {
    state.dateMode = field;
    state.visibleMonth = portalBookingMonthStart(state[field] ? portalBookingParseDate(state[field]) : portalBookingToday());
  }
  const panel = form.querySelector('[data-booking-panel="' + field + '"]');
  if (!panel) return;
  panel.hidden = false;
  button.setAttribute("aria-expanded", "true");
  portalBookingUpdate(form);
  panel.querySelector("button:not(:disabled)")?.focus({ preventScroll: true });
}
function portalBookingSubmit(form) {
  const state = form.__portalBooking;
  const propertyId = form.querySelector("[data-booking-property]").value;
  const feedback = form.querySelector("[data-booking-feedback]");
  const today = portalBookingDateKey(portalBookingToday());
  let message = "";
  if (!propertyId) message = portalText("Sélectionnez l’établissement souhaité.", "Select the property you want to stay at.");
  else if (!state.arrival || !state.departure) message = portalText("Choisissez vos dates d’arrivée et de départ.", "Choose your arrival and departure dates.");
  else if (state.arrival < today || state.departure <= state.arrival) message = portalText("Vérifiez vos dates : le départ doit être postérieur à l’arrivée.", "Check your dates: departure must be after arrival.");
  else if (propertyId === "atta" && state.adults + state.children > 3) message = portalText("Les Résidences ATTA limitent la recherche à 3 voyageurs.", "Résidences ATTA allows up to 3 guests.");
  if (message) {
    feedback.dataset.error = "true";
    feedback.textContent = message;
    form.querySelector("[data-booking-feedback]").scrollIntoView({ block: "nearest", behavior: "smooth" });
    return;
  }
  const destination = window.HLH_SITE_LINKS[propertyId];
  const names = destination.bookingParams;
  const params = new URLSearchParams(destination.fixedBookingParams || {});
  params.set(names.arrival, state.arrival);
  params.set(names.departure, state.departure);
  params.set(names.rooms, String(state.rooms));
  params.set(names.adults, String(state.adults));
  params.set(names.children, String(state.children));
  window.location.assign(destination.reservation + "?" + params.toString());
}
function initPortalBookingForms(root) {
  const scope = root || document;
  scope.querySelectorAll("form[data-portal-booking]").forEach(function (form) {
    if (form.__portalBooking) return;
    const preferred = form.dataset.preferred || "";
    form.__portalBooking = { arrival: "", departure: "", rooms: 1, adults: 2, children: 0, dateMode: "arrival", visibleMonth: portalBookingMonthStart(portalBookingToday()), activeButton: null };
    if (["wia", "atta", "astral"].includes(preferred)) form.querySelector("[data-booking-property]").value = preferred;
    form.addEventListener("submit", function (event) { event.preventDefault(); portalBookingClosePanel(form, false); portalBookingSubmit(form); });
    form.querySelector("[data-booking-property]").addEventListener("change", function () {
      const feedback = form.querySelector("[data-booking-feedback]");
      feedback.dataset.error = "false";
      portalBookingUpdate(form);
    });
    portalBookingUpdate(form);
  });
}
function openBookingChooser(preferred) {
  const markup = '<div class="portal-booking-modal"><p class="eyebrow">' + portalText("RÉSERVATION · HOTEL & LUXURY HOUSING", "BOOKING · HOTEL & LUXURY HOUSING") + '</p><h2>' + portalText("Préparez votre séjour", "Plan your stay") + '</h2><p class="portal-modal-intro">' + portalText("Choisissez une adresse pour accéder à son propre système de disponibilité. HLH ne centralise pas les stocks.", "Choose a property to check availability in its own booking system. HLH does not centralize inventory.") + '</p>' + portalBookingFormMarkup(preferred || "") + '<p class="portal-modal-demo-note">' + portalText("La recherche est transmise à l’établissement sélectionné ; aucune disponibilité n’est affichée par le portail HLH.", "Your search is sent to the selected property; HLH does not display shared availability.") + '</p></div>';
  if (location.pathname === "/" && document.getElementById("portal-booking")) {
    window.HLHBookingPremium.choose(preferred || "");
    document.getElementById("portal-booking").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    return;
  }
  open(markup);
  initPortalBookingForms(document.getElementById("dialogcontent"));
}
function portalHeroSlider() {
  const root = document.querySelector(".portal-hero");
  if (!root) return;
  if (window.__hlhHeroTimer) window.clearInterval(window.__hlhHeroTimer);
  if (window.__hlhHeroVisibility) document.removeEventListener("visibilitychange", window.__hlhHeroVisibility);
  const slides = Array.from(root.querySelectorAll("[data-portal-slide]"));
  const buttons = Array.from(root.querySelectorAll("[data-slide-to]"));
  const toggle = root.querySelector("[data-slide-toggle]");
  const previous = root.querySelector("[data-slide-prev]");
  const next = root.querySelector("[data-slide-next]");
  if (slides.length !== 3 || buttons.length !== 3) return;
  let active = 0;
  let timer = 0;
  let pausedByUser = false;
  let pointerStart = null;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hovering = function () { return root.matches(":hover"); };
  const focusWithin = function () { return root.contains(document.activeElement); };
  const show = function (index) {
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      const selected = i === active;
      slide.classList.toggle("is-active", selected);
      slide.setAttribute("aria-hidden", selected ? "false" : "true");
      const image = slide.querySelector("img");
      if (image && selected) image.setAttribute("fetchpriority", "high");
      else image?.removeAttribute("fetchpriority");
    });
    buttons.forEach(function (button, i) {
      const selected = i === active;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      button.classList.toggle("is-active", selected);
    });
  };
  const stop = function () {
    if (timer) window.clearInterval(timer);
    timer = 0;
    window.__hlhHeroTimer = 0;
  };
  const start = function () {
    stop();
    if (pausedByUser || reducedMotion.matches || document.hidden || hovering() || focusWithin()) return;
    timer = window.setInterval(function () { show(active + 1); }, 5000);
    window.__hlhHeroTimer = timer;
  };
  const setUserPause = function (paused) {
    pausedByUser = paused;
    if (toggle) {
      toggle.setAttribute("aria-pressed", paused ? "true" : "false");
      toggle.setAttribute("aria-label", paused ? portalText("Relancer le diaporama", "Resume slideshow") : portalText("Mettre le diaporama en pause", "Pause slideshow"));
      toggle.textContent = paused ? "▶" : "Ⅱ";
    }
    if (paused) stop(); else start();
  };
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      show(Number(button.dataset.slideTo));
      start();
    });
  });
  previous?.addEventListener("click", function () { show(active - 1); start(); });
  next?.addEventListener("click", function () { show(active + 1); start(); });
  toggle?.addEventListener("click", function () { setUserPause(!pausedByUser); });
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", function (event) {
    if (!root.contains(event.relatedTarget)) window.setTimeout(start, 0);
  });
  root.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      show(active + (event.key === "ArrowRight" ? 1 : -1));
      start();
    }
  });
  root.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "touch") pointerStart = { x: event.clientX, y: event.clientY };
  }, { passive: true });
  root.addEventListener("pointerup", function (event) {
    if (!pointerStart || event.pointerType !== "touch") return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      show(active + (deltaX < 0 ? 1 : -1));
      start();
    }
  }, { passive: true });
  window.__hlhHeroVisibility = function () {
    if (document.hidden) stop();
    else start();
  };
  document.addEventListener("visibilitychange", window.__hlhHeroVisibility);
  reducedMotion.addEventListener?.("change", start);
  show(0);
  start();
}
function portalReveal() {
  const elements = Array.from(document.querySelectorAll(".portal-reveal"));
  if (!elements.length) return;
  document.body.classList.add("portal-reveal-enabled");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach(function (element) { element.classList.add("is-visible"); });
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
  elements.forEach(function (element) { observer.observe(element); });
}
function renderGroupPage(path) {
  if (path === "/nos-hotels") renderHotelsPage();
  else if (path === "/chambres-suites") renderRoomsPage();
  else if (path === "/restaurants") renderRestaurantsPage();
  else if (path === "/salles-reunion") renderMeetingsPage();
  else if (path === "/salles-de-sport") renderWellnessPage();
  else if (path === "/contacts") renderContactsPage();
  else return false;
  renderGroupFooter();
  return true;
}
window.renderGroupHome = renderGroupHome;
window.renderGroupPage = renderGroupPage;
window.openGroupBookingChooser = openBookingChooser;

document.addEventListener("click", function (event) {
  const bookingField = event.target.closest("[data-booking-field]");
  if (bookingField) {
    event.preventDefault();
    const form = bookingField.closest("form[data-portal-booking]");
    if (!form) return;
    const panel = form.querySelector('[data-booking-panel="' + bookingField.dataset.bookingField + '"]');
    if (panel && !panel.hidden) portalBookingClosePanel(form, false);
    else portalBookingOpenPanel(form, bookingField.dataset.bookingField, bookingField);
    return;
  }
  const dateButton = event.target.closest("[data-calendar-date]");
  if (dateButton) {
    event.preventDefault();
    const form = dateButton.closest("form[data-portal-booking]");
    if (!form) return;
    const state = form.__portalBooking;
    const field = state.dateMode;
    if (field === "arrival") {
      state.arrival = dateButton.dataset.calendarDate;
      if (state.departure && state.departure <= state.arrival) state.departure = "";
      if (!state.departure) state.dateMode = "departure";
    } else if (state.arrival) {
      state.departure = dateButton.dataset.calendarDate;
    }
    form.querySelector("[data-booking-feedback]").dataset.error = "false";
    portalBookingUpdate(form);
    return;
  }
  const calendarStep = event.target.closest("[data-calendar-prev], [data-calendar-next]");
  if (calendarStep) {
    event.preventDefault();
    const form = calendarStep.closest("form[data-portal-booking]");
    if (!form) return;
    const direction = calendarStep.hasAttribute("data-calendar-next") ? 1 : -1;
    const current = form.__portalBooking.visibleMonth;
    const earliest = portalBookingMonthStart(portalBookingToday());
    const nextMonth = portalBookingMonthStart(new Date(current.getFullYear(), current.getMonth() + direction, 1));
    if (nextMonth >= earliest) form.__portalBooking.visibleMonth = nextMonth;
    portalBookingUpdate(form);
    form.querySelector('[data-booking-panel="' + form.__portalBooking.dateMode + '"] [data-calendar-' + (direction > 0 ? "next" : "prev") + ']')?.focus({ preventScroll: true });
    return;
  }
  const countButton = event.target.closest("[data-booking-count]");
  if (countButton) {
    event.preventDefault();
    const form = countButton.closest("form[data-portal-booking]");
    if (!form) return;
    const key = countButton.dataset.bookingCount;
    const delta = Number(countButton.dataset.delta);
    const nextValue = form.__portalBooking[key] + delta;
    let accepted = false;
    if (nextValue >= (key === "children" ? 0 : 1)) {
      const property = form.querySelector("[data-booking-property]").value;
      if (property === "atta" && key !== "rooms" && form.__portalBooking.adults + form.__portalBooking.children + delta > 3) {
        form.querySelector("[data-booking-feedback]").textContent = portalText("Les Résidences ATTA limitent la recherche à 3 voyageurs.", "Résidences ATTA allows up to 3 guests.");
        form.querySelector("[data-booking-feedback]").dataset.error = "true";
      } else {
        form.__portalBooking[key] = nextValue;
        accepted = true;
      }
    }
    if (accepted) form.querySelector("[data-booking-feedback]").dataset.error = "false";
    portalBookingUpdate(form);
    return;
  }
  const applyButton = event.target.closest("[data-booking-apply]");
  if (applyButton) {
    event.preventDefault();
    const form = applyButton.closest("form[data-portal-booking]");
    if (!form) return;
    if (applyButton.closest("[data-booking-panel]").dataset.bookingPanel === "arrival" || applyButton.closest("[data-booking-panel]").dataset.bookingPanel === "departure") {
      if (!form.__portalBooking.arrival || !form.__portalBooking.departure) {
        const feedback = form.querySelector("[data-booking-feedback]");
        feedback.dataset.error = "true";
        feedback.textContent = portalText("Sélectionnez une date d’arrivée et de départ avant d’appliquer.", "Select both arrival and departure before applying.");
        return;
      }
    }
    form.querySelector("[data-booking-feedback]").dataset.error = "false";
    portalBookingClosePanel(form, true);
    return;
  }
  const openPanel = document.querySelector("form[data-portal-booking] [data-booking-panel]:not([hidden])");
  if (openPanel && !openPanel.contains(event.target) && !openPanel.parentElement.contains(event.target)) portalBookingClosePanel(openPanel.closest("form[data-portal-booking]"), false);
  const filterButton = event.target.closest("[data-group-filter-property], [data-group-filter-kind]");
  if (filterButton) {
    const root = filterButton.closest("#portal-room-filters");
    if (!root) return;
    const family = filterButton.hasAttribute("data-group-filter-property") ? "[data-group-filter-property]" : "[data-group-filter-kind]";
    root.querySelectorAll(family).forEach(function (button) {
      const active = button === filterButton;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    applyPortalRoomFilters();
    return;
  }
  const bookingButton = event.target.closest("[data-book-choice]");
  if (bookingButton) {
    event.preventDefault();
    openBookingChooser(bookingButton.dataset.bookChoice || "");
  }
});

document.addEventListener("keydown", function (event) {
  const form = event.target.closest?.("form[data-portal-booking]") || document.querySelector("form[data-portal-booking] [data-booking-panel]:not([hidden])")?.closest("form[data-portal-booking]");
  if (event.key === "Escape") {
    const openPanel = form?.querySelector("[data-booking-panel]:not([hidden])");
    if (openPanel) {
      event.preventDefault();
      portalBookingClosePanel(form, true);
    }
    return;
  }
  if (!form) return;
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key) || !event.target.matches("[data-calendar-date]")) return;
  event.preventDefault();
  const current = portalBookingParseDate(event.target.dataset.calendarDate);
  const movement = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" ? -7 : 7;
  current.setDate(current.getDate() + movement);
  const target = portalBookingDateKey(current);
  const field = form.__portalBooking.dateMode;
  if (current.getMonth() !== form.__portalBooking.visibleMonth.getMonth()) form.__portalBooking.visibleMonth = portalBookingMonthStart(current);
  portalBookingUpdate(form);
  form.querySelector('[data-booking-panel="' + field + '"] [data-calendar-date="' + target + '"]:not(:disabled)')?.focus({ preventScroll: true });
});

