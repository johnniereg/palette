# Palette - Warhammer Paint Tracker

A colour-blind-friendly web app for tracking Warhammer miniature paints, creating colour palettes, and organizing painting recipes. Built with React, Vite, Firebase, and Tailwind CSS.

## Features

### Paint Collection
- Browse 80+ real paints from Citadel, Vallejo, Army Painter, and AK Interactive
- Filter by brand, paint type, and colour family
- Search by paint name
- Mark paints as owned and add personal notes
- Prominent colour descriptions (e.g., "warm mid-tone red") for colour-blind users
- Colour swatches shown for visual reference

### Palettes
- Create named colour palettes for your projects (e.g., "Ork Skin", "Rusted Metal")
- Add paints to palettes
- View shopping lists of unowned paints in a palette
- Track which paints you own vs need to buy

### Painting Recipes
- Create step-by-step painting guides for your miniatures
- Add ordered steps, each with a specific paint and optional instructions
- Organize recipes by model/project name
- Full editing capabilities for recipes and steps

### Design for Accessibility
- **Colour-blind friendly**: Paint names and plain English descriptions are the primary information
- Colour families (Reds, Greens, Cool Greys, etc.) for organization
- Hex codes shown for reference but not emphasized
- Mobile-first responsive design with large tap targets

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Backend**: Firebase (Authentication + Firestore)
- **Deployment**: GitHub Pages

## Setup

### Prerequisites
- Node.js 16+ and npm

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/palette.git
cd palette-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the dev server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm run preview
```

## Deployment to GitHub Pages

### Setup GitHub Repository

1. Create a new repository on GitHub named `palette` (or any name you prefer)
2. Push this code to your repository:
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/palette.git
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to **Settings** > **Pages**
   - Under "Build and deployment", select **Deploy from a branch**
   - Branch: `gh-pages`
   - Folder: `/ (root)`

4. The GitHub Actions workflow will automatically build and deploy your app when you push to main

### Access Your Deployed App

Once deployed, your app will be available at:
```
https://YOUR_USERNAME.github.io/palette/
```

## Firebase Configuration

This app uses Firebase for authentication and data storage. The Firebase configuration is included in `src/firebase.js`. To use your own Firebase project:

1. Create a Firebase project at https://firebase.google.com
2. Enable Google Sign-In in Authentication
3. Create a Firestore database
4. Replace the `firebaseConfig` in `src/firebase.js` with your credentials

## Data Structure

User data is stored in Firestore under this structure:

```
users/{uid}/
  collection/{paintId}       → { owned: true, notes: "..." }
  palettes/{paletteId}       → { name: "...", paintIds: [...], createdAt: ... }
  recipes/{recipeId}         → { name: "...", miniature: "...", steps: [...], createdAt: ... }
```

## Paint Database

The app includes 100+ paints from:
- **Citadel**: Base, Layer, Shade, Contrast, Dry, Technical, Primer colours
- **Vallejo Model Colour**: Historic and modern military colours
- **Vallejo Game Colour**: Fantasy gaming colours
- **Army Painter**: Miniature painting colours
- **AK Interactive**: Realistic and weathering colours

Each paint includes:
- Name and brand
- Paint type (Base, Layer, Shade, etc.)
- Colour family (Reds, Blues, Metallics, etc.)
- Plain English description for colour-blind users
- Hex code for visual reference

## Accessibility Notes

This app is designed for colour-blind users:

1. **Colour descriptions in plain English**: Every paint has a description like "warm mid-tone red" or "cold dark blue-grey"
2. **Colour families**: Paints are tagged with families (Reds, Greens, Cool Greys, Metallics, etc.)
3. **Large tap targets**: All buttons and interactive elements are sized for easy mobile interaction
4. **High contrast**: Light background with dark text ensures readability
5. **No colour-only indicators**: Information is never conveyed by colour alone

## License

This project is provided as-is for personal use.

## Support

For issues, suggestions, or contributions, please open an issue on GitHub.

---

**Happy painting!** 🎨
