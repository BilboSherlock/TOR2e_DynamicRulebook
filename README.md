# The One Ring 2nd Edition Dynamic Rulebook

An interactive, responsive digital reference and reader application for *The One Ring 2nd Edition* tabletop roleplaying game (TTRPG). Built with React, TypeScript, and Tailwind CSS.

---

## Features

- **Interactive Reader**: Chapter and section reader powered by React Markdown with custom styling for quotes, callout boxes, tables, and special mechanics (*Favoured* / *Ill-Favoured* indicators).
- **LoreMaster Mode**: Quick toggle in the header to hide or reveal Loremaster-specific sections (*The World* and *The Loremaster*) for player-safe browsing.
- **Heroic Cultures Grid**: Dedicated reference view detailing character attributes, derived stats, skill allocations, combat proficiencies, and cultural blessings.
- **Full-Text Search**: In-memory modal search across all chapters, headers, and subheaders with instant jump navigation.
- **Structured Navigation**: Sidebar navigation with auto-closing inactive sections, supplement switching (*Core Rules* vs. *Heroic Cultures*), and breadcrumbs.
- **Style Inspector**: Included style guide modal detailing typography rules, callouts, and layout guidelines.

---

## Tech Stack

- **Framework**: React 19 & TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Markdown Parsing**: `react-markdown`, `remark-gfm`, `rehype-raw`
- **Build Tool**: Vite 6

---

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm 10 or higher

### Installation & Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/BilboSherlock/TOR2e_DynamicRulebook.git
   cd TOR2e_DynamicRulebook
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

---

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be placed in the `dist/` directory, ready to be served statically.

---

## GitHub Pages Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) configured for GitHub Pages deployment.

### Enabling Deployment

1. Push your changes to the `main` branch.
2. In your GitHub repository, go to **Settings > Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. The site will automatically build and deploy whenever updates are pushed to `main`.

---

## Repository Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment pipeline
├── src/
│   ├── components/         # UI components (Header, Sidebar, Reader, Search)
│   ├── content/            # Rulebook Markdown files
│   ├── data/               # Loader scripts and chapter definitions
│   ├── types.ts            # Core TypeScript interfaces
│   ├── App.tsx             # Main application state and view routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global typography and theme rules
├── package.json
├── vite.config.ts          # Vite configuration
└── README.md
```

---

## License

This project is for personal and reference use with *The One Ring 2nd Edition* rules content. All rulebook rights belong to Sophisticated Games and Free League Publishing.
