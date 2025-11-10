
# Florida Pro-Se Docs – MVP Starter (Vercel Ready)

This starter shows the end-to-end shape of your product:

- Next.js 14 app router
- Landing page with pricing & how-it-works
- `/eligibility` page with real yes/no logic
- `/api/eligibility` route that evaluates answers
- Stubbed `/api/checkout` for Stripe integration
- Stubbed `/api/build-pdf` for document generation

## Run locally

1. Install Node 18+
2. `npm install`
3. `npm run dev`
4. Visit http://localhost:3000

## Deploy on Vercel

1. Push this project to GitHub.
2. In Vercel, click "New Project" and import the repo.
3. Use default build settings (`npm run build`).
4. When you're ready to charge, add env vars (e.g. STRIPE_SECRET_KEY).
5. Add Supabase (or similar) when you're ready to persist users/matters.

From here, a dev (or we, step-by-step) can:
- Expand eligibility into full interviews.
- Persist answers and generate official Florida packets.
- Add auth + dashboard.
