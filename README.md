# HLH — site et gestion des demandes

Trois établissements : Palais WIA, Résidences ATTA, Hôtel Astral. Version de travail privée, avec photos provisoires remplaçables. Interface française avec navigation anglaise et traductions éditables.

## Modifier sans coder

1. Ouvrir `/gestion` avec le compte ChatGPT autorisé du propriétaire.
2. Choisir Accueil, Établissements, Chambres, Offres, Services, FAQ ou Actualités.
3. Modifier les champs ou importer une photo JPEG, PNG ou WebP (8 Mo maximum).
4. Cliquer **Enregistrer & publier les contenus**. Ces contenus sont enregistrés dans D1 et immédiatement utilisés par le site ; aucun redéploiement du code n'est nécessaire.
5. Dans Demandes reçues, lire les coordonnées et changer le statut. La note de suivi est visible au client : ne pas y mettre de commentaire interne.
6. Sauvegarde & guide permet d'exporter le contenu JSON. Les exports de demandes et newsletter contiennent des données personnelles : conserver les copies dans un emplacement sécurisé.

Les dates saisonnières sont inclusives. Exemple : `[{"start":"2026-12-01","end":"2026-12-31","rate":150000}]`. Les saisons d'une catégorie ne doivent pas se chevaucher. Les tarifs sont en XOF. Les codes promotionnels remisent l'hébergement ; les suppléments sont ajoutés ensuite. Les montants affichés restent des estimations, sans facture ni calcul fiscal automatique.

## Fonctions et limites

Recherche par établissement, dates, voyageurs et type de séjour ; fiches et galerie ; sélection de plusieurs catégories ; minimum de nuits et capacité lorsqu'elle est renseignée ; tarifs de base et saisonniers ; services et codes promotionnels ; coordonnées et consentement ; enregistrement durable de demandes ; suivi invité avec référence et code secret ; suivi connecté et demande d'annulation ; administration protégée ; newsletter avec export ; actualités, FAQ et avis avec source.

Une demande ne bloque pas de chambre. Aucun stock réel, paiement, facture, email automatique, PMS, channel manager ou calendrier OTA n'est connecté. L'équipe examine les demandes. Le code de suivi invité n'est affiché qu'au reçu : le client doit le conserver ou télécharger le reçu. Les inscriptions newsletter sont enregistrées mais aucun message n'est envoyé.

## Déploiement dans ChatGPT Sites

Le projet existant est conservé avec `.openai/hosting.json`. Les changements de code sont construits puis publiés sur ce même projet. Les réglages de partage et de domaine du Site permettent de préparer l'ouverture publique et le domaine personnalisé. L'accès est actuellement privé et n'a pas été élargi. Lire aussi `/guide`.

Avant ouverture publique : renseigner les coordonnées réelles, valider les catégories/capacités/tarifs et conditions, remplacer les images d'inspiration, compléter la notice de confidentialité (responsable, contacts, conservation) et faire traiter une demande d'essai par l'équipe.

## Déploiement externe par un développeur

Ce projet est un Worker Vinext, pas un thème WordPress ni un site HTML autonome. Node.js ≥22.13 ; utiliser la version pnpm indiquée dans `package.json`.

1. Installer : `corepack enable`, puis `pnpm install --frozen-lockfile`.
2. Construire : `pnpm build`.
3. Créer une base Cloudflare D1 et un bucket R2. Le Worker utilise les bindings `DB` et `BUCKET`.
4. Copier `dist/server/wrangler.json` en configuration de déploiement et remplacer les identifiants de ressource factices par les véritables ressources. Garder les chemins du Worker et des assets corrects.
5. Appliquer dans l'ordre les migrations `drizzle/*.sql` sur la nouvelle base via Wrangler D1 ; sauvegarder d'abord une base existante. Ne jamais rejouer arbitrairement une migration déjà appliquée.
6. **Remplacer l'authentification avant exposition.** `lib/api.ts` reçoit actuellement des en-têtes d'identité injectés et protégés par ChatGPT Sites. Hors Sites, ces en-têtes clients ne sont pas une preuve d'identité. Intégrer une session serveur ou vérifier un JWT Cloudflare Access (signature, issuer, audience, expiration) et remplacer `/signin-with-chatgpt`. Protéger les routes de gestion et tester un utilisateur non autorisé.
7. Déployer le Worker avec Wrangler, puis raccorder le domaine. Importer le contenu JSON dans la gestion après avoir rétabli l'authentification. Transférer également les objets R2 référencés dans les contenus ; un export JSON ne contient pas les images téléversées.

Le ZIP n'inclut aucune base, demande client, clé, dépendance installée ni image importée dans R2. Un export des demandes via la gestion sert d'archive métier ; il ne constitue pas une restauration complète de la base. Utiliser les outils de sauvegarde D1/R2 pour une migration complète.

## Référence étudiée

https://demo.goodlayers.com/hotale/hotelchain/
https://demo.goodlayers.com/document/hotale/

Parcours exploré : accueil, hôtels et catégories, recherche, fiche chambre, panier, services/code, choix invité/compte et étapes de paiement de la démo. Aucun paiement ou compte de démo n'a été soumis. L'administration privée du thème n'était pas accessible. HLH reprend les parcours utiles avec son propre code ; ce ZIP n'inclut pas le thème Hotale sous licence. WordPress + Hotale serait une installation/migration distincte.

## Validation

Compilation Worker et TypeScript ; tests locaux avec D1/R2 simulés pour droits de gestion, conflit de version, tarifs saisonniers/services/remise, demande, code de suivi, dates, annulation et newsletter. Tests DOM pour les pages, panier/contact/reçu et saisie de gestion. Les tests DOM ne remplacent pas une vérification visuelle réelle sur mobile et ordinateur, ni un test des futurs services de paiement/PMS.
