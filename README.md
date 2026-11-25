# SplitWise – Shared Expense Manager

A React + Vite academic project demonstrating:
- React component-based structure
- React Router page navigation
- Bootstrap 5 and custom CSS
- CSS Grid, Flexbox and responsive media queries
- Local Storage based demo login and signup
- Admin and User modules
- Groups, expenses and settlement records

## Run locally

1. Open this folder in VS Code.
2. Open Terminal > New Terminal.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the localhost URL shown by Vite.

## Demo admin login

- Email: `admin@splitwise.com`
- Password: `admin123`

## User login

Use Sign up to create a new user account. User accounts are stored in the browser's Local Storage.

## Build for deployment

```bash
npm run build
```

Vite creates the production website in the `dist` folder. For Vercel, use:
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Important academic/demo limitation

This is a front-end demonstration. Local Storage is browser-specific and is not a secure database. Passwords are stored in plain text, and admin role checks happen in the client. Do not use real passwords or sensitive personal information. A production system needs a backend, database, secure password hashing and server-side authorization.

Expense entries are recorded and settlements can be logged. This starter does not yet calculate a legally/accounting-grade net balance or automatically transfer money.
