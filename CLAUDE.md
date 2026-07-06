# SOLAR SYSTEM - Jeu Immersif du Système Solaire

## À propos

SOLAR SYSTEM est un jeu indépendant immersif 3D qui permet d'explorer le système solaire avec une précision scientifique et des visuels époustouflants. Le jeu est actuellement en phase de développement avec une base solide pour l'ajout de mécaniques de jeu.

## Tech Stack

- **Three.js**: Rendu 3D haute performance
- **Vite**: Bundler et serveur de développement
- **JavaScript (ES6+)**: Code modulaire et moderne

## Structure du Projet

```
src/
├── main.js                 # Point d'entrée, boucle d'animation
├── SolarSystem.js          # Gestion du système solaire
├── Controls.js             # Gestion des entrées (zoom, rotation, tactile)
├── PlanetData.js           # Données scientifiques des planètes
└── TextureGenerator.js     # Génération procédurale des textures

index.html                  # Template HTML
vite.config.js             # Configuration Vite
package.json               # Dépendances et scripts
```

## Commandes

```bash
# Démarrage dev
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

## Fonctionnalités Implémentées

✅ Orbites réalistes avec distances à l'échelle
✅ Textures procédurales pour chaque planète
✅ Rotation individuelle des planètes
✅ Zoom intelligent (molette souris / pincement tactile)
✅ Rotation 3D (clic+glisser / geste à 1 doigt)
✅ Sélection et informations planétaires
✅ Interface UI responsive
✅ Support desktop et mobile

## Fonctionnalités à Venir

- Énigmes et défis scientifiques
- Mode histoire interactif
- Système de quête pédagogique
- Simulation physique avancée
- Passage du temps accéléré configurable
- Mode multijoueur (optionnel)

## Notes de Développement

### Performance
- Utilisation de geometries optimisées (IcosahedronGeometry)
- MipmapLinearFilter pour les textures
- Antialiasing activé avec pixel ratio limité
- Raycasting optimisé pour sélection

### Données Scientifiques
- Distances à l'échelle logarithmique pour visualisation
- Rayons légèrement exagérés pour lisibilité
- Vitesses relatives réalistes
- Données basées sur NASA/JPL

### Architecture
- Système modulaire facilement extensible
- Séparation des concerns (système solaire, contrôles, textures)
- Pas de dépendances externes au-delà de Three.js et Vite
- Code maintenable avec commentaires aux points critiques

## Prochaines Étapes

1. Tester sur tous les appareils (desktop, tablet, mobile)
2. Optimiser les performances sur appareils faibles
3. Ajouter des effets visuels (traînées orbitales, pulsations)
4. Implémenter des énigmes basées sur les données planétaires
5. Ajouter un système de progression et de récompenses

---

Créé avec ❤️ pour explorer les merveilles de l'univers.
