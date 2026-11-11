# Aperçu Chambres & Suites — 8 novembre 2026

Branche : ux/hlh-hebergements-20261108. Aucun commit envoyé, aucune publication. main et develop inchangées. Les modifications locales antérieures sont conservées.

Structure : Astral (2), ATTA (4), WIA Nouvelle Conception V48 (4). Médias copiés dans public/assets/hlh-hebergements depuis les projets locaux ; aucune dépendance photographique distante ajoutée. Sources : Astral lib/defaults.ts ; ATTA lib/atta-flow.ts et lib/atta-search.ts ; WIA src/script.js et src/pages/suites.html.

Les montants affichés sont explicitement des tarifs de démonstration, non contractuels. Capacités Astral/WIA non confirmées : à confirmer. Superficies non confirmées omises. ATTA : plafond global de trois voyageurs préservé. Aucun équipement ajouté sans confirmation.

Vérification : compilation Netlify locale réussie ; 115 contrôles moteur réussis avec NODE_PATH vers work/hlh-tools/node_modules (jsdom déjà disponible) ; dix contrôles API démo réussis ; destinations réussies. Navigateur intégré : structure 2/4/4, dix images chargées, navigation ancrée, ouverture du moteur avec WIA présélectionné, captures ordinateur/tablette/mobile ; absence de débordement mobile. Chrome/Safari natifs et téléphone physique restent à contrôler. Les boutons de réservation réutilisent le moteur existant et sa conservation des paramètres. Les liens de découverte Astral/ATTA restent leurs accueils validés ; WIA ouvre /suites/.

Sauvegarde préalable : outputs/HLH-chambres-avant-20261108 dans le dossier de travail Codex. Prévisualisation : http://localhost:4314/chambres-suites.
