## Getting Started

Install project dependencies:
- npm install

Run the development server:
- npm run dev

Run these commands for linter (DONE BEFORE EVERY COMMIT):
- npm run lint
- npm run lint:fix 

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



## Docker
Start container:
- docker compse up -d

Stop container:
- docker compose down -v

To connect to db from dbeaver (see KS-9 task in jira for picture):
- Host: localhost
- Database: jira-ultra-db
- Port: 5555
- Username: root
- Password: postgres


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
