Voici les commandes pratiques pour exécuter, tester et publier ton projet **Schematics** JantTaf compatible avec Angular 18.

---

## **1. Installation des dépendances**
Avant toute chose, assure-toi d’installer les dépendances requises :
```bash
npm install
```

---

## **2. Compiler le projet**
Avant de tester ton Schematics, compile-le avec :
```bash
npm run build
```
Cela génère les fichiers JavaScript nécessaires.

---

## **3. Tester le Schematics en local**
Pour tester la génération d’un composant sans publier, utilise :
```bash
schematics .:component --name=test-component
```
Si tu veux tester avec un projet Angular spécifique :
```bash
cd ../mon-projet-angular
ng add ../chemin-vers-ton-schematics
ng generate jant-taf:component test-component
```

---

## **4. Lien symbolique pour tester en mode développement**
Au lieu de re-publier à chaque test, utilise un **lien symbolique** :
1. **Dans ton projet Schematics JantTaf**, exécute :
   ```bash
   npm link
   ```
2. **Dans un projet Angular où tu veux tester**, exécute :
   ```bash
   npm link jant-taf
   ```

Tu peux maintenant exécuter :
```bash
ng g jant-taf:component test-component
```
Et voir si le composant est bien généré.

---

## **5. Publier ton Schematics sur NPM**
Une fois les tests validés, publie-le sur NPM :
1. **Assure-toi d’être connecté à ton compte NPM** :
   ```bash
   npm login
   ```
2. **Incrémente la version (`package.json`)** :
   ```bash
   npm version patch
   ```
   ou  
   ```bash
   npm version minor
   ```
   ou  
   ```bash
   npm version major
   ```

3. **Publie le package sur NPM** :
   ```bash
   npm publish --access public
   ```
   ⚠️ Si ton package est privé, retire `--access public`.

---

## **6. Installer ton Schematics dans un projet Angular**
Si ton Schematics est sur **NPM**, tu peux l’installer dans n’importe quel projet Angular avec :
```bash
ng add jant-taf
```

Puis, pour générer un composant :
```bash
ng g jant-taf:component mon-nouveau-composant
```

---

## **7. Mettre à jour un projet qui utilise JantTaf**
Si tu as publié une nouvelle version et veux la mettre à jour :
```bash
npm update jant-taf
```
ou
```bash
ng update jant-taf
```

---

## **8. Vérifier et lister les commandes disponibles**
Si tu veux voir toutes les commandes disponibles pour ton Schematics :
```bash
schematics . --list-schematics
```

---

Avec ces commandes, tu peux **compiler, tester, lier en local, publier et utiliser** ton Schematics Angular 18 dans n'importe quel projet. 🚀