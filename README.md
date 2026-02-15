This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Install project dependencies:
npm install

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

Run these commands for linter (DONE BEFORE EVERY COMMIT):
npm run lint
npm run lint:fix 

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment

Next.js automatically loads the correct env file based on the mode:

- `next dev` loads `.env.development`
- `next build` / `next start` loads `.env.production`

## Project Architecture

```
src/
├── app/                            # Next.js App Router — pages, layouts, styles
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   └── examples/
│       ├── page.tsx
│       └── components/             # Page-specific components (not shared)
│           ├── ButtonShowcase.tsx
│           ├── DatePickerShowcase.tsx
│           ├── ImageShowcase.tsx
│           └── ModalShowcase.tsx
│
├── components/                     # Shared, reusable UI components
│   ├── layout/                     # App shell components
│   │   ├── navbar/
│   │   │   └── Navbar.tsx
│   │   └── footer/
│   │       └── Footer.tsx
│   ├── modals-and-forms/           # Custom form modals per use case
│   │   └── CreateTaskModal.tsx
│   └── utils/                      # Generic primitives
│       ├── buttons/
│       │   └── CustomButton.tsx
│       ├── date-pickers/
│       │   └── DatePicker.tsx
│       ├── images/
│       │   └── Image.tsx
│       └── modals/
│           └── Modal.tsx
│
├── config/                         # App-wide configuration
│   ├── constants.ts                # Static values (APP_NAME, limits, display arrays)
│   └── enums.ts                    # Enums (ETaskStatus, EPriority)
│
├── hooks/                          # Shared custom React hooks
│   └── useDebounce.ts
│
├── lib/                            # External service configs
│   └── firebase/
│       ├── config.ts               # Firebase init (reads from .env automatically)
│       └── auth.ts                 # Sign in / sign up / sign out helpers
│
├── server/                         # Server Actions (backend logic)
│   └── tasks/
│       └── tasks.ts                # createTask() server action
│
├── types/                          # Shared TypeScript types & interfaces
│   └── task.ts                     # Task, TaskCreateInput (uses enums)
│
└── utils/                          # Pure utility functions (no React)
    └── format.ts                   # round(), truncate(), timeAgo()
```

### Folder Roles

- **app/** — Pages, layouts, and page-specific components
- **components/** — Shared UI components used across multiple pages
- **config/** — Constants and enums
- **hooks/** — Custom React hooks
- **lib/** — External service configs (Firebase)
- **server/** — Server Actions (backend logic)
- **types/** — TypeScript types and interfaces
- **utils/** — Pure utility functions (no React dependencies)
