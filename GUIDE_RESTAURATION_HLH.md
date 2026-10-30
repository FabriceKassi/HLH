# GUIDE_RESTAURATION_HLH

État vérifié le 30 octobre 2026. Projet : portail HLH V17 uniquement.

## Ce qui protège votre projet

Le code de référence est sur https://github.com/FabriceKassi/HLH. La branche `develop` sert au développement et à la démonstration Netlify ; `main` reste stable. La prévisualisation est https://hlh-portail-v17-preview.netlify.app. Le Mac peut être éteint sans arrêter ce site.

Les ajouts de portabilité sont proposés sur `test/restauration-portable-20261030`. Ils ne sont pas fusionnés automatiquement. Tant que cette branche n’est pas validée, y récupérer ce guide et `scripts/init-local-db.mjs`. Le portail publié demeure inchangé.

## 1. Préparer un ordinateur

Installer Git, Node.js 24.19.0 (ou une mise à jour compatible de Node 24, à retester) depuis https://nodejs.org, et GitHub CLI depuis https://cli.github.com. Sur Windows, utiliser de préférence WSL2 avec Ubuntu. Ouvrir Terminal sous macOS/Linux ou le terminal Ubuntu sous Windows.

Exécuter une ligne à la fois :

```sh
node --version
npm install --global pnpm@11.25.0
pnpm --version
gh auth login
```

Choisir GitHub.com, HTTPS et la connexion par navigateur. Saisir soi-même les codes demandés ; ne pas les mettre dans le dépôt. Le clonage du dépôt public ne nécessite pas de connexion, mais l’envoi de changements en nécessite une.

## 2. Récupérer le projet

Choisir un dossier local hors synchronisation iCloud, puis :

```sh
git clone https://github.com/FabriceKassi/HLH.git
cd HLH
git switch develop
pnpm install --frozen-lockfile
```

Ne pas lancer npm install dans le projet : conserver pnpm-lock.yaml et pnpm-workspace.yaml. La politique de dépendances et les autorisations de compilation du dépôt restent actives.

Pour tester les ajouts de portabilité avant leur validation :

```sh
git fetch origin test/restauration-portable-20261030
git switch --track origin/test/restauration-portable-20261030
```

Ne pas écraser un dossier existant ; cloner dans un nouveau dossier si nécessaire.

## 3. Base et variables locales

Aucun secret de production n’est nécessaire pour la démonstration. Ne pas importer une base client. Le code contient les migrations et le contenu éditorial de repli.

```sh
node scripts/init-local-db.mjs
```

Cette commande ne cible que `.wrangler/state` dans ce clone ; elle applique les migrations manquantes sans supprimer les données. Elle peut être répétée. Si une base ancienne comporte un schéma incompatible, la préserver et repartir dans un clone neuf. Ne pas ajouter `--remote` à une commande de base.

Les éventuelles variables privées doivent rester dans `.env.local` ou `.dev.vars`, ignorés par Git, avec accès limité. Les noms/configurations de production se documentent sans leurs valeurs. Les comptes ChatGPT Sites, CinetPay, Cloudflare D1/R2 et l’identité de gestion ne sont pas restaurés par GitHub.

## 4. Démarrer et arrêter

```sh
node --import ./scripts/sites-env.mjs scripts/run-framework.mjs dev --port 4314 --host 127.0.0.1 --strictPort
```

Garder le Terminal ouvert et ouvrir http://127.0.0.1:4314. Si le port est pris, utiliser 4417 et ouvrir cette adresse. `Ctrl+C` arrête seulement ce serveur. Cette commande indépendante ne dépend pas du lanceur des quatre sites de l’ancien Mac.

Les modifications du code sont prises en compte par Vite. Après modification d’un fichier public, recharger la page si nécessaire. La référence à `/hlh-local-preview.js` dans l’HTML original correspond à l’ancien rechargement commun : ce fichier optionnel n’est pas sauvegardé dans Git. Un 404 sur ce script n’empêche pas le site de fonctionner ; l’adaptation Netlify l’exclut déjà. Les bases de chaque clone restent séparées.

## 5. Vérifier avant d’envoyer

```sh
pnpm build
node scripts/build-netlify.mjs
node tests/netlify-demo.test.mjs
mkdir -p .impeccable/review
npm install --prefix .sites-runtime/tests --save-exact jsdom@30.1.3
HLH_TEST_RUNTIME="$PWD/.sites-runtime/tests" node tests/hlh-booking.test.mjs
git diff --check
git status --short
```

L’installation npm est ici limitée à un runtime de test ignoré, séparé des dépendances applicatives. Le test moteur doit annoncer 115 contrôles ; le test Netlify 10. Vérifier aussi le navigateur, les menus, calendriers, photographies et contacts. Le dépôt ne contient pas les trois sites d’établissements : les liens de réservation quittent le portail et peuvent demander une connexion Sites. Ne pas lancer de réservation ni de paiement réel.

La démo Netlify bloque demandes, newsletter, administration et paiement. Le serveur local complet peut écrire dans sa base locale isolée ; ne pas le présenter comme une plateforme de réservation de production. Les clés marchandes doivent rester absentes.

## 6. Modifier avec Codex et faire contrôler

Ouvrir le clone dans Codex et demander : « Travaille sur une branche issue de develop. Préserve le design hors de ma demande. Teste les changements et prépare une pull request vers develop ; ne fusionne pas sans mon accord. »

```sh
git switch develop
git pull --ff-only origin develop
git switch -c travail/ma-modification
# Modifier et exécuter les vérifications ci-dessus.
git add chemin/du/fichier
git diff --cached
git commit -m "Description précise du changement"
git push -u origin travail/ma-modification
gh pr create --base develop --title "Description du changement" --body "Changement et tests effectués"
```

Ajouter seulement les fichiers voulus. Vérifier qu’aucun secret, fichier de base ou export client n’est inclus. Codex peut aussi envoyer via le connecteur GitHub disponible ; son accès est distinct de l’authentification du Terminal.

Examiner les changements de la pull request et ses tests avant d’autoriser sa fusion vers develop. Ne jamais forcer un push, réinitialiser main ou fusionner vers main sans validation.

## 7. Vérifier Netlify

Un commit validé arrivant sur develop déclenche la liaison Git existante. Ne pas recréer le site ni lancer de déploiement manuel. Dans Netlify, ouvrir le projet `hlh-portail-v17-preview`, puis Deploys, et comparer le SHA du déploiement au commit attendu. Attendre l’état Published/Ready avant de vérifier le navigateur.

https://hlh-portail-v17-preview.netlify.app/preview-build.json donne le commit et la branche utilisés pour la compilation. L’adresse principale demeure stable. Un build échoué ne remplace pas la dernière publication fonctionnelle ; corriger le problème et pousser une correction. Pour une documentation seule sans besoin de déploiement, utiliser `[skip netlify]` dans le message du commit.

## 8. Retrouver une ancienne version

Pour la consulter sans changer les branches :

```sh
git log --oneline
git worktree add --detach ../HLH-ancienne-version SHA_DU_COMMIT
```

Installer les dépendances de cette copie et utiliser un autre port. Pour remettre en service un ancien comportement, créer une branche de correction et un commit d’annulation (`git revert` sur le commit précis, après analyse), puis faire contrôler une pull request vers develop. Ne pas utiliser reset/force-push ni republier un ancien déploiement Netlify. Les versions antérieures à la restauration GitHub restent dans les archives historiques, pas nécessairement dans l’historique du dépôt.

## 9. Codex Cloud

Le compte présente l’option Cloud et permet de sélectionner FabriceKassi/HLH. Une préparation HLH dédiée a été lancée le 30 octobre 2026 ; vérifier dans l’interface que l’environnement est publié avant de le considérer prêt pour de nouvelles tâches.

Dans Codex web/desktop : Exécuter dans → Cloud → sélectionner l’environnement HLH. Vérifier dépôt HLH uniquement, branche develop, Node 24.19.0, pnpm 11.25.0. Utiliser l’installation verrouillée et les tests de ce guide. Fournir seulement des données de démonstration. Faire préparer les changements sur une branche et une pull request ; aucune fusion automatique vers develop ou main.

Le conteneur Cloud, son système de fichiers et sa prévisualisation ne remplacent pas un commit GitHub ni une sauvegarde des données. Les ports/aperçus dépendent des options de l’environnement ; localhost du Cloud n’est pas localhost du Mac. Garder Netlify comme lien public stable après validation des changements. La connexion GitHub actuelle doit rester disponible dans le nouveau compte/appareil. Ne pas utiliser l’ancien Mac comme serveur distant pour cette reprise.

Documentation officielle : https://learn.chatgpt.com/docs/environments/cloud-environments

## 10. Sauvegardes hors du Mac

GitHub sauvegarde les fichiers suivis et leur historique ; Netlify conserve des déploiements, pas une sauvegarde complète des services. Aux versions majeures, créer une archive des fichiers suivis et son empreinte :

```sh
git archive --format=zip --output=../HLH-version-validee.zip HEAD
shasum -a 256 ../HLH-version-validee.zip
```

Sur Linux, utiliser `sha256sum`. Copier cette archive et son empreinte vers un disque externe et un stockage distant sécurisé indépendant du Mac. Ne pas écraser une ancienne archive. Ne pas y joindre les secrets ni les bases clients.

Inventaire séparé à protéger : archives ZIP historiques V11/V12/V17 ; éventuelles données locales .wrangler/state ; exports D1/R2 de production non inclus ; paramètres et comptes Cloudflare/Sites/Netlify ; secrets dans un gestionnaire de mots de passe ; récupération des comptes GitHub/ChatGPT/Netlify et codes de secours. Une sauvegarde SQLite doit être cohérente (API SQLite backup ou export officiel), pas une copie isolée d’un fichier actif sans son journal. Chiffrer les données privées et contrôler leur restauration. Un fichier qui reste seulement dans Downloads n’est pas protégé contre la perte du Mac.

## Résultat du test de reprise

Clone vierge de develop au commit fb27bd19e79e290c2c87c7ef50ac52de5067d56b ; aucune source, aucun média ni node_modules copié depuis l’ancien atelier. Outils Node 24.19.0 téléchargés depuis nodejs.org, empreinte vérifiée ; pnpm 11.25.0. Installation de 641 dépendances depuis le réseau, build Vinext et build Netlify réussis ; 115 + 10 contrôles réussis. Deux migrations appliquées à une base neuve. Huit pages et deux routes API répondent HTTP 200. Trente-six médias servis correspondent aux fichiers Git, dont le MP4. Accueil et calendrier vérifiés visuellement. Ce test a été réalisé dans un nouveau dossier sur le même Mac : il ne certifie pas Windows/Linux ; la préparation Cloud fournit un contrôle distant complémentaire.

### Limite Cloud constatée à la fin de la mission

Deux tentatives de publication de l’environnement HLH ont échoué avec « Impossible de publier l’environnement ». Les paramètres sont enregistrés et les tests de préparation réussissent, mais aucune nouvelle tâche depuis un environnement publié n’a pu être vérifiée. La cause n’est pas exposée par les outils accessibles. Codex Cloud reste donc préparé, non opérationnel. Reprendre dans le chat « Configurer HLH » et réessayer après résolution côté plateforme ; ne pas recréer la liaison GitHub → Netlify pour ce problème. La reprise sur un nouvel ordinateur depuis GitHub et le site Netlify restent disponibles indépendamment de cette limite.
