# Palette - Setup Instructions

## Quick Start

### 1. Install Dependencies
```bash
cd palette-app
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open http://localhost:3000 in your browser and sign in with Google.

### 3. Build for Production
```bash
npm run build
```
This creates a `dist/` folder ready for deployment.

### 4. Deploy to GitHub Pages

1. **Create a GitHub repository** (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/palette.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repo's Settings → Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch
   - Save

3. **GitHub Actions will automatically deploy** when you push to main. Your app will be live at:
   ```
   https://YOUR_USERNAME.github.io/palette/
   ```

## File Structure

```
palette-app/
├── index.html                 # HTML entry point
├── package.json              # Dependencies
├── vite.config.js            # Vite config with base: '/palette/'
├── tailwind.config.js        # Tailwind CSS config
├── postcss.config.js         # PostCSS config
├── README.md                 # Full documentation
├── .gitignore               # Git ignore file
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deployment
├── src/
│   ├── main.jsx             # React entry point
│   ├── App.jsx              # Main app with routing
│   ├── index.css            # Global styles (Tailwind)
│   ├── firebase.js          # Firebase config
│   ├── data/
│   │   └── paints.js        # 100+ paint database
│   ├── hooks/
│   │   ├── useAuth.js       # Authentication context
│   │   └── useCollection.js # Paint collection logic
│   ├── components/
│   │   ├── PaintCard.jsx    # Individual paint card
│   │   ├── PaintFilter.jsx  # Filter sidebar
│   │   └── NavBar.jsx       # Top navigation
│   └── pages/
│       ├── Login.jsx        # Sign-in page
│       ├── Collection.jsx   # Paint collection browser
│       ├── Palettes.jsx     # Palette management
│       ├── PaletteDetail.jsx # Individual palette view
│       ├── Recipes.jsx      # Recipe management
│       └── RecipeDetail.jsx # Individual recipe editor
```

## Firebase Setup (Optional - Already Configured)

The app comes with a working Firebase configuration. To use your own:

1. Go to https://firebase.google.com and create a project
2. Enable Google Sign-In in Authentication
3. Create a Firestore database
4. Replace `firebaseConfig` in `src/firebase.js`

## Key Features

✓ Google sign-in authentication
✓ Browse 100+ paints from major manufacturers
✓ Filter by brand, type, colour family
✓ Mark paints as owned with personal notes
✓ Create named colour palettes
✓ Shopping list generator
✓ Paint recipe creator with step-by-step guides
✓ Mobile-first responsive design
✓ Colour-blind friendly (descriptions + families)
✓ Cloud sync with Firebase

## Colour-Blind Accessibility

Every paint has:
- Plain English description (e.g., "warm mid-tone red", "cold dark blue-grey")
- Colour family tag (Reds, Greens, Cool Greys, etc.)
- Hex code for reference (not primary)

Filter controls are:
- High contrast text
- Large, easy-to-tap buttons
- No colour-only information
- Clear labels on all inputs

## Troubleshooting

**"Module not found" errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 already in use?**
```bash
npm run dev -- --port 3001
```

**Build fails?**
```bash
npm run build -- --verbose
```

**Firebase auth not working?**
- Check Firebase console for errors
- Ensure Google Sign-In is enabled
- Verify Firestore rules allow authenticated users to read/write

---

That's it! You're ready to track your Warhammer paints. 🎨
