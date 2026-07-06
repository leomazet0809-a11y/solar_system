# SOLAR SYSTEM - Jeu Immersif du Système Solaire

Un jeu indépendant immersif en 3D qui permet d'explorer le système solaire avec une précision scientifique et des visuels époustouflants.

## Caractéristiques

✨ **Orbites Réalistes**: Les planètes tournent autour du soleil sur leurs trajectoires réelles, avec des distances à l'échelle

🌍 **Visuels Hautes Résolutions**: Chaque planète est texturée en temps réel selon sa composition réelle (océans, continents, atmosphère, gaz, etc.)

🔄 **Rotation Axiale**: Les planètes tournent sur leurs propres axes avec les vitesses réalistes

🔍 **Zoom Intelligent**: 
- Molette souris pour zoomer/dézommer
- Pincement à 2 doigts sur mobile
- Du zoom minimum (vue globale du système) au zoom maximum (détails de chaque planète)

🎮 **Navigation 3D Fluide**:
- Clic + glisser à la souris
- Geste tactile à 1 doigt sur mobile
- Rotation autour du système solaire comme dans un jeu 4D

📊 **Informations Détaillées**: Sélectionnez une planète pour voir ses caractéristiques scientifiques

## Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build
```

## Contrôles

### Ordinateur (Desktop)
- **Molette souris**: Zoom avant/arrière (vers la position du curseur)
- **Clic + Glisser**: Rotation du système solaire
- **Clic simple**: Sélectionner une planète

### Mobile/Tactile
- **Pincement 2 doigts**: Zoom avant/arrière
- **Glisser 1 doigt**: Rotation du système solaire
- **Appui**: Sélectionner une planète

## Architecture

Le projet utilise **Three.js** pour le rendu 3D haute performance:

- `src/main.js` - Boucle d'animation et initialisation
- `src/SolarSystem.js` - Gestion du système solaire, orbites et planètes
- `src/Controls.js` - Gestion des contrôles (zoom, rotation, tactile)
- `src/PlanetData.js` - Données réelles des planètes (positions, vitesses, caractéristiques)
- `src/TextureGenerator.js` - Génération procédurale des textures planétaires

## Optimisations UX

- **Rendu haute performance** avec antialiasing et ombres
- **Support multi-écran** responsive
- **Gestion tactile native** pour mobile
- **Raycasting** pour sélection intuitive
- **Animations fluides** avec deltaTime
- **Esthétique spatiale** avec UI translucide et néon

## Données Scientifiques

Les distances orbitales, rayons, vitesses et compositions sont basés sur les données NASA/JPL:
- Distances à l'échelle logarithmique pour la visualisation
- Tailles exagérées légèrement pour la lisibilité
- Vitesses de rotation réalistes relatives

## Futur

Le jeu est conçu comme une base pour ajouter:
- Énigmes et défis scientifiques
- Mode histoire interactif
- Système de quête pédagogique
- Simulation physique en temps réel
- Passage du temps accéléré

---

Créé avec ❤️ pour explorer les merveilles de l'univers
