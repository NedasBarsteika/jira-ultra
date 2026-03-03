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

- docker compose up -d

Stop container:

- docker compose down -v

To connect to db from dbeaver (see KS-9 task in jira for picture):

- Host: localhost
- Database: jira-ultra-db
- Port: 5555
- Username: root
- Password: postgres

# Database and Migrations

### Before getting started

Make sure the docker is running.

You can view the database with drizzle studio.<br/>
Run `npm run db:studio` (in a separate terminal if u want) and follow the link https://local.drizzle.studio.

To have the init migration applied:

1. Go to SQL console tab.
2. run these two sql commands:

```
CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
    id SERIAL PRIMARY KEY,
    hash TEXT NOT NULL,
    created_at BIGINT
);
```

```
INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
VALUES ('0000_init', extract(epoch from now()) * 1000);
```

Now drizzle knows that the init migration is applied. You will not going to need to this again for next migrations.

### New migrations

Database schema is written in `database\schema.ts`.<br/>
In this file TypeScript types and database tables are writen.

If u want to edit DB tables:

1. edit `\database\schema.ts` file
2. run in terminal `npm run db:generate -- example_name_of_migration`. This will generate migration in `\drizzle` folder
3. run in terminal `npm run db:migrate` to apply migration or just run the project `npm run dev`, it will also apply migrations

Make sure you have the database url in your `.env.development` file:

- `DATABASE_URL=postgresql://root:postgres@localhost:5555/jira-ultra-db`

Example you can use for writing your back-end mutations to the database:

- src\server\tasks\tasks.ts

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
│   └── better-auth/
│       └── auth.ts                 # Auth config
│
├── server/                         # Server Actions (backend logic)
│   ├── tasks/
│   │   └── tasks.ts                # createTask() server action
│   └── auth/
|       └── auth-actions            # Sign in, Sign Up, Sing Out helpers
|
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
