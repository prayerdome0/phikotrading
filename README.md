# Seedwel Hub

**Buy. Sell. Manage. Grow.**

Seedwel Hub is being rebuilt as a frontend-first prototype for an AI-powered business platform. Supabase, authentication, real business data and the official logo will be integrated later.

## Current build

- React + Vite frontend
- Placeholder Seedwel Hub brand mark
- Public landing page
- Marketplace discovery UI
- Business profiles UI
- Business solutions page
- Seller/business dashboard preview
- CSV inventory synchronization UI
- Document center preview
- Seedwel AI assistant preview
- Mobile-first responsive navigation

## Run locally

```bash
npm install
npm run dev
```

## Backend plan

Data is currently mocked in `src/lib/mockData.js`. Future Supabase integration should replace the repository layer in `src/lib/seedwelRepository.js` with RLS-aware Supabase queries.
