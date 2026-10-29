# Contrôles du moteur commun HLH

Les tests concernent exclusivement le moteur de la page d’accueil : validation partagée par le nouvel endpoint, combinaisons de voyageurs, calendriers, compteurs, panneaux, erreurs et construction des URL de réservation.

Exécution avec Node 24 et jsdom 30.1.3 installé dans un répertoire temporaire séparé (sans modifier les dépendances de l’application) :

```sh
npm install --prefix /tmp/hlh-test-runtime --no-audit --no-fund jsdom@30.1.3
HLH_TEST_RUNTIME=/tmp/hlh-test-runtime node --experimental-strip-types tests/hlh-booking.test.mjs
```

Le résultat détaillé est écrit dans `.impeccable/review/functional-tests.json`. Les contrôles de mise en page et les véritables redirections sont effectués séparément dans le navigateur. Les tests DOM ne prétendent pas vérifier le rendu CSS. Aucun test ne crée de réservation ni ne modifie une base de production.
