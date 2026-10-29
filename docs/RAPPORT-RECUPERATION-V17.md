# Rapport de récupération — Portail HLH V17

Récupération du 28 octobre 2026, sans modification du site hébergé.

## Identification vérifiée

- Projet : « HLH — Reprise privée V48 » ; projet Sites `appgprj_6ad2ba2aa8288191bfe36887a498608d`.
- Dernière version réellement sauvegardée : **V17**.
- Version déployée : **V17**, déploiement confirmé réussi le 25 octobre 2026 à 19:42:28 UTC.
- Commit des sources : `a0fd05923b3e237dc8061dca0a221fc48103c333`.
- Le dépôt récupéré pointe exactement sur ce commit ; aucun recours à une ancienne V13 ni reconstruction de site.
- L’archive hébergée de 110 fichiers est une sortie de compilation. La récupération a utilisé le dépôt source associé, qui contient **178 fichiers suivis**.

## Contenu récupéré

| Élément | Résultat |
|---|---|
| Sources, pages, routes, composants, JS/CSS et API | 178 fichiers sources conservés avec leur organisation. |
| Images, logos, icônes, favicons et vidéo | 36 fichiers ; images décodées pour vérification, SVG parsés et vidéo contrôlée avec ffprobe. |
| Vidéo | `palais-wia-banner.mp4`, H.264, 1280 × 720, durée 165,625 s ; fichier original conservé. |
| Polices | 12 fichiers provenant de l’URL Google Fonts originale ; Inter, Playfair Display et Poppins, avec trois licences OFL et leur provenance. Import CSS original conservé. |
| Dépendances | `package.json`, `pnpm-lock.yaml` et fichiers de configuration inclus ; pnpm 11.25.0, Node 24 recommandé. |
| Backend | Worker Vinext, Cloudflare D1/R2, API et scripts disponibles conservés ; deux migrations SQL incluses. |
| Documentation | README détaillé, historique, inventaire, modèles sans secrets, outils de reprise locale et contrôles inclus. |
| Sauvegardes antérieures | ZIP V11 et V12 intégrés sans modification, SHA-256 comparés au manifeste antérieur, intégrité ZIP vérifiée. |
| Versions natives | V1 à V17 identifiées et documentées ; aucune suppression, restauration ou nouvelle publication. |

## Contrôles réellement exécutés

- Installation des dépendances à partir du verrouillage : réussie ; 640 paquets réutilisés.
- Compilation du dépôt V17 dans le profil de l’environnement : réussie.
- Compilation de la copie exportée dans le profil **portable**, celui d’un nouveau poste : réussie.
- TypeScript sans émission et sans modification du cache suivi : réussi.
- **115 contrôles fonctionnels existants : réussis, zéro échec.**
- **21 contrôles HTTP locaux sur la copie exportée : réussis, zéro échec.** Pages, contenu D1, identité non administratrice par défaut, paiement non configuré, API du moteur pour les trois établissements, refus de quatre voyageurs et ressources JS/CSS/logo/vidéo.
- Initialisation D1 locale : deux migrations confirmées et six tables applicatives présentes. Un deuxième passage confirme la base sans réinitialisation.
- 26 références statiques `/assets/...` contrôlées : aucun fichier manquant.
- 36 médias vérifiés ; 12 fichiers de polices et trois licences téléchargés sans échec.
- Les empreintes des 178 fichiers exportés sont contrôlées contre l’inventaire ; chaque écart de confidentialité est explicitement signalé.
- Le manifeste SHA-256 couvre les fichiers livrés. Le ZIP final est relu intégralement et ses membres sont comparés au manifeste après création ; son empreinte externe est fournie séparément.

Aucun contrôle visuel nouveau sur appareil physique n’a été effectué pendant cette récupération. Il ne s’agit pas d’une refonte et les tests HTTP/DOM ne prétendent pas simuler Safari, iOS ou Android. Aucun achat, paiement ou réservation n’a été effectué.

## Limites et données non exportées

Les schémas et le contenu éditorial de repli sont inclus. Les lectures bornées des tables hébergées `content` et `atta_inventory` ont retourné zéro ligne, sans troncature. Les tables clients, demandes, abonnés, réservations et limitation d’accès n’ont pas été lues ni exportées. Il n’y a donc pas de dump complet des données de production.

Les éventuels objets R2 non suivis dans Git ne sont pas exportés ; aucune référence éditoriale `/api/media/...` n’a été trouvée dans cette version. L’identité ChatGPT, les droits Sites, domaines/DNS, connecteurs, secrets et comptes marchands restent attachés aux services d’origine et ne se restaurent pas avec un ZIP de sources.

Aucun secret actif n’est livré. L’adresse personnelle d’administration est neutralisée uniquement dans `projet/lib/api.ts` et dans le ZIP historique imbriqué `projet/public/downloads/HLH-source.zip`. Les sources hébergées sont inchangées. Les empreintes originales et exportées documentent exactement ces deux modifications de confidentialité. Les archives V11 et V12 déjà assainies sont conservées octet pour octet.

Le code des sites indépendants Palais WIA, Résidences ATTA et Astral n’est pas exporté en trois applications distinctes : il s’agit de la récupération du portail HLH et de son architecture partagée disponible. Les liens vers ces établissements restent conservés.

## Reprise et future migration

Le README donne les commandes pour installer, initialiser la base locale, démarrer, compiler, tester, vérifier les empreintes et créer un nouveau dépôt GitHub privé. Les dépendances installées et sorties de compilation ne sont pas copiées dans le ZIP ; elles sont reconstruites sur le nouveau système.

Le serveur V17 utilise `cloudflare:workers`, D1/R2 et l’authentification injectée par Sites. Il n’est pas configuré pour un déploiement Netlify complet en l’état. L’adaptation du runtime, du stockage et de l’authentification constitue une étape ultérieure, non réalisée dans cette mission de récupération. Aucune configuration Netlify prétendument opérationnelle n’a été ajoutée.

## Préservation du site existant

Le contrôle final confirme toujours V17, le même horodatage de dernière modification, un accès privé propriétaire et aucun visiteur externe ajouté. Aucun push distant, aucun changement de base de production, aucun changement de permissions et aucun nouveau déploiement n’ont été réalisés.
