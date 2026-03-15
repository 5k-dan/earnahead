This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## ZipMap component

### Setup

Drop `src/components/ZipMap.tsx` into any Next.js or React project and import it:

```tsx
import ZipMap from "@/components/ZipMap";

<ZipMap center={[-87.63, 41.88]} pins={[]} />
```

### Environment variables

Add to `.env.local` (Next.js) or `.env` (CRA):

```env
# Required — public Mapbox token
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJ...

# Optional — route map/Census API calls through the local proxy server
NEXT_PUBLIC_USE_PROXY=false
```

For the proxy server only (never exposed to the browser):

```env
# Server-side token used by the proxy (keeps the token off the client)
MAPBOX_TOKEN=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJ...
```

### Running the proxy server (optional)

The proxy (`src/server/api/mapProxy.ts`) exposes `GET /api/geocode?zip=` and `GET /api/zcta?zip=`, rate-limited to 60 req/min per IP with a 5-minute in-memory cache. Start it alongside Next.js:

```bash
npx ts-node src/server/api/mapProxy.ts
# default port: 3001
```

Set `NEXT_PUBLIC_USE_PROXY=true` so ZipMap routes requests through it instead of calling Mapbox and Census directly.

### Tests

```bash
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

Tests mock `mapbox-gl` and `idb-keyval` entirely — no browser or network required.

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
