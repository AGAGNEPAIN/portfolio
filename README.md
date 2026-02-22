# Portfolio - Antoine Gagnepain

Un portfolio interactif, immersif et performant, développé en **Vanilla JavaScript** et propulsé par **Three.js** pour offrir une expérience spatiale unique.

## 🚀 Vue d'Ensemble des Technologies

- **HTML5 / CSS3 / JavaScript (ES6+)** : Développé sans framework frontend lourd pour garantir des temps de chargement minimes et un contrôle total sur les animations.
- **[Tailwind CSS](https://tailwindcss.com/)** : Framework CSS utilitaire utilisé (via CDN pour ce prototype) pour un web design réactif, moderne et sans friction.
- **[Three.js](https://threejs.org/)** : Bibliothèque JavaScript 3D (WebGL) incontournable, utilisée pour la génération et l'animation de la scène de particules en arrière-plan.

---

## 🌌 Au Cœur de l'Expérience : L'Arrière-Plan Three.js

L'effet "waouh" visuel et technique de ce portfolio repose sur une scène WebGL complexe entièrement configurée sur mesure. Voici les techniques avancées employées pour son développement :

### 1. Système de Particules (Galaxy)

Au lieu d'importer un objet 3D lourd, la scène génère de bout en bout un système de particules composé de milliers de points spatiaux (`THREE.Points`).

- **Génération Mathématique :** Les coordonnées de jusqu'à 50 000 particules sont calculées pour former les courbes spécifiques des bras spiraux d'une galaxie. Une valeur mathématique de `randomness` (dispersion) est ajoutée de façon exponentielle pour recréer l'aspect chaotique et organique de l'espace.
- **Shaders sur Mesure (GLSL) :** Un matériau personnalisé (`THREE.ShaderMaterial`) est écrit en GLSL (Vertex & Fragment Shaders). Les shaders permettent d'avoir des particules circulaires aux bords diffus (halo), d'appliquer une couleur qui transite du centre vers l'extérieur du rayon spatial, et d'ajouter de très légères ondulations.
- **Responsive Design 3D :** La `BufferGeometry` adapte sa densité (nombre de points) et la caméra change sa distance (`CAMERA_START_Z`) automatiquement si un appareil mobile est détecté, optimisant la lisibilité et sauvant la batterie de l'utilisateur.

### 2. Post-Processing Cinématographique

Une scène brute WebGL manque souvent de réalisme. Un pipeline de post-traitement (`EffectComposer`) est ajouté avec plusieurs "Pass" de filtres appliqués à l'image rendue à chaque frame :

- **UnrealBloomPass (Luminescence) :** Cet effet récupère les pixels brillants et leur applique un "flou directionnel" (Bloom), recréant un intense éclat type néon, crucial pour le style science-fiction/cyberpunk de la scène. Sa puissance est calibrée différemment sur mobile et desktop.
- **RGBShiftShader (Aberration Chromatique) :** Inspiré par le cinéma et les caméras défectueuses, cet effet décale très légèrement les canaux de couleur (Rouge, Vert, Bleu). Dans ce projet, _la valeur de ce filtre s'accentue dynamiquement en fonction de la vitesse de scroll de l'utilisateur_, simulant un effet de vitesse de la lumière (warp).

### 3. Mathématiques et "Lerp" au Service de l'Interaction

Plutôt que d'avoir d'abruptes transitions lors des interactions, les mathématiques ajoutent de l'élégance :

- **Interpolation Linéaire (Lerp) :** Utilisée massivement dans la fonction `animate()`. Lorsque l'utilisateur bouge la souris ou touche l'écran, la caméra ne cible pas instantanément le nouveau point (`currentLookAtX += (targetX - currentLookAtX) * factor`). Elle "tourne la tête" avec du retard, donnant une sensation de poids gravitationnel très agréable.
- **Animation liée au Scroll :** Le `scrollPercent` influence directement l'axe `Y` (élévation façon drone) et l'axe `Z` de la caméra. Descendre sur la page fait littéralement avancer et monter la caméra dans le modèle 3D.

---

## ✨ Autres Effets Frontend Développés

Outre le WebGL, plusieurs techniques JavaScript et CSS viennent parfaire l'interface utilisateur en premier plan :

- **Curseur Magnétique (`#custom-cursor`) :** Un système complet de curseur personnalisé pour ordinateur, incluant un algorithme qui "attire" littéralement la hitbox et l'aspect visuel du bouton de contact (bouton magnétique).
- **Effet Scramble (Brutalisme) :** Une classe JavaScript custom `TextScramble` remplace temporairement les caractères d'un titre par des symboles spatiaux, générant un effet de décodage informatique de la "matrice".
- **Scroll Reveal API :** Utilisation propre de l'`IntersectionObserver` pour déclencher les apparitions asynchrones des blocs de textes (fade in + translateY) sans impacter les performances liées au scroll de la page.
- **Filtres CSS Passifs :** Intégration performante (via `pointer-events: none` et `z-index`) de texture de pellicule de film (`.film-grain` en SVG data URI) et d'une esthétique `.cyber-grid` pour texturer les boîtes d'information.

---

## 🛠️ Déploiement CI/CD

Ce projet est hébergé publiquement de façon automatisée via **GitHub Pages**. Un pipeline CI/CD léger est configuré avec **GitHub Actions** (`.github/workflows/static.yml`). Chaque `git push` sur la branche principale compile statiquement le projet et l'injecte instantanément en ligne.
