# Portail HLH V17 — travail local et démonstration Netlify

Référence : source Sites V17, commit a0fd05923b3e237dc8061dca0a221fc48103c333, déployée le 25 octobre 2026. Le nom historique du projet contient V48 ; ce numéro ne désigne pas la version restaurée.

## Démarrer et arrêter sur le Mac

Dossier commun : /Users/fabricekassi/Downloads/HLH_CODEX_LOCAL.
Double-cliquer demarrer.command, arreter.command ou redemarrer.command.
Tableau de bord http://127.0.0.1:4310 ; WIA 4311 ; ATTA 4312/atta ; Astral 4313/hotel-astral ; portail V17 4314.
Le lanceur utilise portail-v17/projet pour HLH. Les autres dossiers ne changent pas. Les modifications de app, lib, components, public et db provoquent une actualisation locale. Node 24 est conservé dans portail-v17/.runtime/node ; pnpm 11.25.0 et le verrouillage sont conservés.

## Deux environnements distincts

Local : application Vinext/Cloudflare complète, base fraîche de démonstration dans .wrangler/state, initialisée avec les migrations originales ; aucune donnée hébergée importée. Le fichier .openai/hosting.json est conservé comme provenance et déclaration des bindings ; il ne déclenche aucune publication.
Netlify : commande node scripts/build-netlify.mjs, publication dist-netlify, fonctions netlify/functions. Interface et médias V17 conservés. API de contenu en lecture, calcul de devis et validation du moteur partagés avec la source. Administration, demandes, newsletter et paiements bloqués ; formulaire Contacts désactivé. Aucune base de clients connectée. Un bandeau identifie la démonstration.
Les fichiers générés sont reconstruits à chaque build et ignorés par Git. Les archives, bases, secrets, dépendances installées et .netlify restent hors Git. Aucun média de ce portail ne dépasse 100 Mo ; Git LFS n’est pas nécessaire pour cet instantané.

## Valider une évolution

1. Modifier sur develop, vérifier le navigateur et les changements Git.
2. Exécuter la compilation originale : pnpm build avec Node 24.
3. Exécuter node scripts/build-netlify.mjs puis node tests/netlify-demo.test.mjs.
4. Pour les 115 contrôles du moteur, installer jsdom 30.1.3 dans un dossier temporaire distinct, créer .impeccable/review, puis HLH_TEST_RUNTIME=/chemin/runtime node --experimental-strip-types tests/hlh-booking.test.mjs.
5. Contrôler les secrets et les fichiers avant git add, git commit puis git push origin develop. Une fois la liaison Git Netlify configurée sur develop, le push déclenche sa démonstration. Ne pas prétendre cette liaison active avant vérification d’un déploiement Git réussi.
6. Reporter les versions validées sur main par fusion normale ; aucun force push.

## Intégrer une future archive Sites

Conserver ZIP et empreinte, tester son intégrité et son manifeste. Extraire dans un nouveau dossier, comparer à la référence V17 et à develop. Sauvegarder sources et SQLite avant intégration. Reporter les changements utiles dans une branche dédiée, conserver les adaptations locales/Netlify, exécuter les tests et vérifier visuellement. Ne pas remplacer .env, .wrangler ou les données locales par l’archive. Il n’existe ici aucune synchronisation automatique directe avec ChatGPT Sites.

## Limites connues

Les boutons du moteur dirigent vers les trois sites ChatGPT Sites d’origine avec leurs critères. Ces destinations peuvent nécessiter une connexion ChatGPT ; leur disponibilité publique et leur parcours final ne sont pas garantis par ce portail. Les liens Maps du portail sont les recherches géographiques de la V17, préservées sans modification. Certaines illustrations portent volontairement la mention provisoire. Les polices Google sont conservées dans resources avec licences, mais la feuille originale utilise encore leur chargement Google externe. Les mentions légales demandent une validation avant exploitation publique réelle.
