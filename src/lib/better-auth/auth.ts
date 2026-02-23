import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { Pool } from 'pg';

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
  user: {
    additionalFields: {
      first_name: {
        type: 'string',
        required: false,
      },
      last_name: {
        type: 'string',
        required: false,
      },
      role: {
        type: ['member', 'admin'],
        defaultValue: 'member',
        input: false,
      },
      is_active: {
        type: 'boolean',
        defaultValue: true,
      },
    },
  },
});
