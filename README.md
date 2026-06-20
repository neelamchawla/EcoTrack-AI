# EcoTrack AI – Personal Carbon Footprint Companion

**Chosen Vertical:** Environmental Sustainability

EcoTrack AI helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

## Approach and Logic

EcoTrack AI collects user lifestyle information and estimates carbon emissions across transportation, food, electricity, water, and waste. It then uses AI to generate personalized recommendations and sustainability challenges.

## How It Works

1. User enters daily habits on the **Calculator** page.
2. The carbon calculator estimates daily and monthly emissions.
3. The **AI Coach** analyzes patterns and suggests improvements.
4. The **Dashboard** visualizes trends, breakdowns, and green alternatives.
5. **Weekly challenges** gamify habit changes with badges.

## Features

| Feature | Description |
|---------|-------------|
| Carbon Calculator | Transport, food, electricity, water, waste inputs |
| AI Sustainability Coach | Gemini-powered tips with offline fallbacks |
| Analytics Dashboard | Recharts trends, breakdown, score, savings |
| Weekly Challenges | Meatless Monday, bike to work, and more |
| Gamification | Green Starter, Eco Warrior, Carbon Saver badges |
| Green Alternatives | Estimated CO₂ savings for lifestyle swaps |

## Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS, Recharts
- **AI:** Gemini API (via `VITE_GEMINI_API_KEY`)
- **Storage:** Local persistence + Firebase Firestore layer (`src/lib/`)
- **Testing:** Vitest (requires Node 18+)
- **Deployment:** Vercel-ready (static Vite build)

## Getting Started

**Requires Node.js 18+**

```bash
npm install
cp .env.example .env
# Add your Gemini API key to .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Run Vitest tests |

## Environment Variables

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Never commit `.env` files. The AI Coach works with intelligent fallbacks when no API key is set.

## Folder Structure

```
src/
 ├── components/     # UI components (Navbar, StatCard, ProgressRing)
 ├── pages/          # Calculator, Dashboard, Coach, Challenges
 ├── hooks/          # useEcoTrack state hook
 ├── utils/          # carbonCalculator, challenges, validation
 ├── services/       # aiService, storageService
 ├── types/          # Shared TypeScript types
 ├── tests/          # Vitest unit tests
 └── App.tsx
```

## Assumptions

- Average emission factors are used (not region-specific grid data).
- User inputs are self-reported.
- Recommendations are educational and approximate.

## Security

- Environment variables for API keys
- Input validation on all calculator fields
- No secrets committed (see `.gitignore`)
- HTTPS deployment recommended (Vercel default)

## Accessibility

- Semantic HTML and ARIA labels
- Keyboard navigation and focus rings
- High contrast mode toggle
- Responsive mobile-first design

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set `VITE_GEMINI_API_KEY` in project environment variables
4. Deploy

## License

MIT
