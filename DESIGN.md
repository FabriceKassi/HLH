---
name: "Moteur commun homepage du portail HLH Reprise V48"
description: "Système du composant de réservation commun de la homepage, extrait de son implémentation livrée."
colors:
  ink: "#101010"
  ink-hover: "#292521"
  ivory: "#f7f5f0"
  white: "#fff"
  beige: "#bba188"
  icon-bronze: "#8b7054"
  muted-text: "#6b635b"
  label-text: "#655b51"
  frame: "#e5dfd7"
  divider: "#e9e4de"
  panel-frame: "#dfd6ca"
  hover-paper: "#faf8f5"
  range-paper: "#f0e9df"
  day-hover: "#e7d9c7"
  mobile-panel: "#fcfbf8"
  focus-bronze: "#8b643b"
  invalid-stroke: "#a44435"
  invalid-paper: "#fff8f5"
  feedback-text: "#943f31"
typography:
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline-mobile:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "29px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.7
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.3
  body-mobile:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.3
  caption:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.09em"
  action:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.7
    letterSpacing: "0.07em"
rounded:
  bar: "16px"
  panel: "14px"
  control: "10px"
  option: "8px"
  apply: "7px"
  circle: "50%"
spacing:
  compact: "6px"
  inset: "8px"
  control-gap: "10px"
  regular: "12px"
  field: "14px"
  separation: "16px"
  mobile-panel: "18px"
  block: "20px"
  heading: "22px"
  panel: "24px"
  months: "30px"
components:
  booking-bar:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.bar}"
    padding: "{spacing.inset}"
  field-trigger:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "14px 12px"
    width: "100%"
  field-trigger-open:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  button-search:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "14px 19px"
  button-search-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.white}"
  button-apply:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.apply}"
    width: "100%"
  property-option:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.option}"
    padding: "15px"
  property-option-selected:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ink}"
  floating-panel:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel}"
  counter-button:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    size: "36px"
  calendar-day-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.circle}"
---

# Design System: Moteur commun homepage du portail HLH Reprise V48

## Overview

**Creative North Star: "Le comptoir de réservation HLH"**

Ce document décrit exclusivement le moteur commun de la homepage du portail HLH Reprise V48, livré dans `public/hlh-booking.css` et `public/hlh-booking.js`. Un comptoir blanc compact, posé sur le fond ivoire du portail, réunit les choix nécessaires au séjour. Le noir porte l'action principale ; le beige et les traits fins rendent les sélections lisibles avec retenue.

Le composant prolonge les typographies déjà chargées : Playfair Display pour son titre et Inter pour les contrôles. La direction est issue de la spécification précise du composant et du code livré, sans nouveau concept visuel, nouvelle police ni image. Ces règles ne s'appliquent pas aux autres sections, pages ou moteurs indépendants des établissements.

**Key Characteristics:**
- Une barre commune, cinq champs et une action principale.
- Des contenants blancs arrondis, une bordure fine et une ombre diffuse.
- Des libellés fonctionnels en capitales et des pictogrammes SVG au trait.
- Des panneaux ancrés sur grand écran et insérés dans le flux sur mobile.
- La continuité graphique du portail, sans photographie modifiée.

## Colors

Une palette chaude et sobre met les critères de séjour et leur état avant la décoration ; les valeurs normatives figurent dans le frontmatter.

### Primary
- **Noir d'encre** (`ink`) : action de recherche, application et jours sélectionnés ; texte principal des champs et panneaux.
- **Noir chaud de survol** (`ink-hover`) : survol des actions noires et des dates sélectionnées.

### Secondary
- **Beige HLH** (`beige`) : bordure d'un champ ouvert, date du jour et contrôles de quantité.
- **Bronze des pictogrammes** (`icon-bronze`) : pictogrammes au trait des champs et des adresses.
- **Bronze de focus** (`focus-bronze`) : contour de navigation clavier.

### Neutral
- **Ivoire du portail** (`ivory`) : fond de section, champ ouvert et adresse sélectionnée.
- **Blanc de surface** (`white`) : barre et panneaux sur grand écran.
- **Brun grisé** (`muted-text`, `label-text`) : explications, notes et libellés.
- **Cadres chauds** (`frame`, `panel-frame`) et **séparateurs** (`divider`) : traits fins entre fonctions et autour des surfaces.
- **Papiers d'interaction** (`hover-paper`, `range-paper`, `day-hover`, `mobile-panel`) : survol de champ, plage du séjour, survol de date et panneau mobile.
- **Terre cuite de validation** (`invalid-stroke`, `invalid-paper`, `feedback-text`) : champ invalide et message associé.

**The Action First Rule.** Dans ce moteur, les grandes surfaces noires signalent une action ou une sélection ; le beige souligne les états et les repères.

## Typography

**Display Font:** Playfair Display, avec Georgia et serif en repli.
**Body Font:** Inter, avec Arial et sans-serif en repli.

**Character:** Le titre conserve la voix éditoriale du portail. Les critères, dates et quantités utilisent la même famille de contrôle que le reste de l'interface existante ; aucune police supplémentaire n'est requise.

### Hierarchy
- **Headline** : titre de section, avec la variante `headline-mobile` au seuil mobile ; graisse et approche héritées du portail.
- **Title** : titres des panneaux, noms d'adresses et quantités. Les titres de panneau passent à une taille plus compacte sur mobile (14px).
- **Body** : valeur d'un champ ; la variante `body-mobile` renforce sa lecture en pile verticale. Les mois du calendrier utilisent une taille de contrôle (14px), les jours une taille plus compacte (13px).
- **Caption** : notes et récapitulatif ; le pied de barre passe à une taille compacte sur mobile (11px).
- **Label** : libellé fonctionnel en capitales au-dessus de chaque valeur. Il reste visuellement subordonné au critère choisi.
- **Action** : texte en capitales de la recherche. Le bouton d'application conserve une approche légèrement plus ouverte (0.08em).

**The Existing Type Rule.** Conserver Inter pour les contrôles et Playfair Display pour le titre de ce composant ; la continuité graphique est une contrainte explicite.

## Layout

Le moteur suit le conteneur déjà utilisé par le portail : largeur maximale (1280px), gouttière fluide (`clamp(22px,4vw,52px)`), puis gouttière fixe (22px) jusqu'à la largeur mobile du portail (620px). La section possède son propre espace vertical (42px en haut, 34px en bas ; 32px et 26px jusqu'à 700px). Le titre et sa phrase d'accompagnement précèdent la barre ; le résumé et l'explication de réservation directe la suivent.

À partir de la largeur desktop (1200px), la barre comporte six colonnes : établissement, arrivée, départ, chambres, voyageurs, recherche. La grille exacte est `minmax(205px,1.5fr) minmax(140px,1fr) minmax(140px,1fr) minmax(128px,.85fr) minmax(145px,1fr) minmax(222px,1.35fr)`. Les champs et l'action ont une hauteur minimale commune (80px) ; de fins séparateurs verticaux rythment les cinq critères.

Entre les seuils tablette (701px à 1199px), la grille devient trois colonnes (`1.2fr 1fr 1fr`) sur deux rangées. Les contrôles ont une hauteur minimale (76px), les trois premiers champs reçoivent un séparateur inférieur et les panneaux se positionnent par rapport à la barre.

Jusqu'au seuil mobile (700px), les cinq champs et l'action se superposent dans le même ordre. L'insertion de la barre devient compacte, les champs conservent leur hauteur minimale (76px), et la recherche devient plus basse (58px). Les séparateurs sont horizontaux. Le titre, l'accompagnement et le pied de barre s'empilent.

Les panneaux desktop s'ouvrent sous la barre, avec un écart (16px). Ils sont bornés au viewport et à la barre par le code de positionnement ; l'ouverture réserve leur hauteur dans la mise en page. Le panneau standard mesure (350px), celui des adresses (390px), les calendriers (650px). Les calendriers affichent deux mois espacés (30px), puis un seul mois sur mobile. Sur mobile, tous les panneaux entrent dans le flux du champ, sans position flottante ni ombre. Le moteur entier reste dans le flux de la page.

**The Same Criteria Rule.** Les changements de largeur réorganisent les cinq critères et la recherche ; ils ne créent pas un deuxième moteur ni un parcours différent.

## Elevation & Depth

La profondeur est légère et fonctionnelle : une ombre diffuse distingue la barre du fond ivoire et une ombre plus ample identifie les panneaux ouverts. Les bordures restent fines (1px). Sur mobile, la différence de ton et la bordure suffisent pour les panneaux insérés dans le flux.

### Shadow Vocabulary
- **Barre** (`0 12px 36px -20px #3f30293d`) : ancrage discret du contenant commun.
- **Panneau ouvert** (`0 18px 45px -20px #2e201540`) : détachement du panneau desktop.
- **Champ ouvert** (`0 3px 12px #4d3e2d0c`) : accent léger sur le déclencheur actif.
- **Recherche au survol** (`0 5px 12px #10101016`) : retour sur l'action principale.

**The In Flow Panel Rule.** Au seuil mobile du moteur, supprimer l'ombre des panneaux et les laisser agrandir leur champ dans le flux.

## Shapes

Le contenant principal et les panneaux desktop utilisent les rayons `bar` et `panel` du frontmatter. Les contrôles internes sont plus serrés (`control`, `option`, `apply`) ; le panneau mobile rejoint le rayon de contrôle. Les contrôles de quantité, les flèches de mois et les dates isolées sont circulaires. Les jours intermédiaires d'un séjour sont contigus, avec des coins droits, afin de montrer une plage entre les deux dates noires.

Les pictogrammes sont des SVG intégrés, sans remplissage, au trait arrondi (1.5). Les pictogrammes de champ mesurent (20px), puis (22px) sur mobile ; les chevrons sont plus petits (14px). Les icônes d'action n'emploient pas de glyphe de police.

## Components

### Booking bar

Un contenant unique rassemble le moteur. Utiliser le fond blanc, le cadre fin, le rayon de barre et son ombre. L'espacement interne compact laisse les champs partager une surface plutôt que produire une rangée de cartes indépendantes.

### Buttons

La recherche est le point de décision : fond noir, texte blanc, pictogramme de recherche au trait, texte en capitales. Au survol, elle adopte le noir chaud, une ombre légère et un déplacement vertical (−1px) ; la pression inverse ce déplacement (1px). Pendant la transmission, elle est désactivée avec une opacité réduite (0.8), son pictogramme est remplacé par un indicateur circulaire et le formulaire expose son état occupé.

L'application dans les panneaux de quantité est pleine largeur avec une hauteur minimale (44px). Son fond noir rejoint la recherche ; sa silhouette est plus compacte. Tous les boutons du moteur reçoivent le contour de focus bronze (2px), décalé (3px).

Les transitions de couleur, fond et bordure des boutons suivent la règle existante du portail (200ms ease), celles de transformation et d'ombre (250ms ease). La rotation de chevron et l'apparition de panneau utilisent une durée plus brève (160ms ease). L'indicateur tourne en continu (700ms linear). La préférence de mouvement réduit supprime animations, transitions et déplacements de survol/ouverture.

### Inputs / Fields

Chaque critère est un bouton composé d'un pictogramme, d'un libellé, d'une valeur et d'un chevron. Le survol pose un fond papier clair. Le champ ouvert adopte l'ivoire, une bordure beige, la petite ombre d'état et le chevron retourné. Un critère invalide reçoit un cadre terre cuite et un fond chaud très clair ; le message lié apparaît sous le formulaire.

Les cinq critères restent : établissement, arrivée, départ, chambres, voyageurs. Les valeurs longues ne changent pas le nombre ni l'ordre des colonnes. La sélection de l'établissement utilise une liste d'options ; les autres critères ouvrent des panneaux de dialogue non modaux.

### Property options

Une adresse est une ligne lisible : nom, quartier et type d'hébergement. Son fond devient ivoire à la sélection et au survol ; la coche SVG confirme la sélection. Le panneau est peu rembourré pour laisser les lignes occuper sa largeur. Sur mobile, le quartier passe sous le nom et le pictogramme initial disparaît.

### Calendar

Les mois et les jours sont structurés en grille de sept colonnes. Les dates sélectionnées sont noires avec chiffres blancs ; la date du jour possède un contour beige ; les dates entre arrivée et départ utilisent le papier de plage. Les dates indisponibles à la sélection sont atténuées. Le calendrier mobile ne montre que le premier mois et garde une hauteur de jour minimale (34px). Les flèches de mois passent de contrôles circulaires (36px) à des cibles plus grandes (40px) sur mobile.

### Counters

Les rangées associent un titre, une note et des commandes circulaires avec quantité à chiffres tabulaires. Les commandes passent d'une taille compacte (36px) à des cibles tactiles (44px) sur mobile. Les limites désactivent les commandes concernées avec une opacité réduite (0.3). Le panneau voyageurs rappelle la limite totale de trois personnes, toutes chambres confondues, avec au moins un adulte ; l'état de limite renforce le texte sans créer de nouvel élément décoratif.

### Summary and feedback

Le récapitulatif annonce les nuits et le total de voyageurs, avec une explication séparée de la réservation directe. L'état et les erreurs sont transmis dans une zone vivante. La recherche valide les critères avant de transférer vers l'URL existante de l'établissement choisi ; le composant n'affiche ni inventaire ni disponibilité calculée.

## Do's and Don'ts

### Do:
- **Do** limiter ce système au moteur commun de la homepage HLH Reprise V48.
- **Do** conserver les cinq critères, leur ordre et une seule action de recherche visible.
- **Do** reprendre les typographies déjà chargées et les SVG au trait du composant.
- **Do** maintenir les différences entre repos, survol, ouverture, focus, sélection, erreur et attente.
- **Do** garder les panneaux mobiles dans le flux et respecter la préférence de mouvement réduit.

### Don't:
- **Don't** appliquer ces règles aux autres sections, pages ou moteurs indépendants des établissements.
- **Don't** transformer ce moteur en élément flottant ou fixe.
- **Don't** ajouter de police, de nouvelle photographie ou de décoration pour distinguer ce composant.
- **Don't** présenter la limite de trois voyageurs comme une limite par chambre.
- **Don't** laisser la documentation transformer une alerte générique de détecteur en changement d'identité : Inter est ici une continuité graphique explicitement requise.
