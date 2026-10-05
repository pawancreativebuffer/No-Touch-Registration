# Ticket-IT – No-Touch Signup

Clickable prototype of the **No-Touch Signup** flow for Ticket-IT. A new retailer can register and set up their ticketing in one guided wizard, without help from the Ticket-IT team.

This is a front-end prototype only. There is no backend, and entered data stays in the browser.

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The login page loads first. Click **Register** to start the signup wizard at `/register`.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Signup flow

| # | Step | What the user does |
|---|---|---|
| 1 | Start | Enter user details (name, login, password, email, contact and address) |
| 2 | Print Process and Sizes | Choose a print process and the **standard** ticket sizes (portrait, landscape, shelf talker, shelf edge) |
| 3 | Promotional Ticket Sizes | Same choices for **promotional** tickets |
| 4 | Build your Everyday Ticket | Upload backgrounds, or enter store details (category, brand colours, logo, headers) and pick portrait and landscape backgrounds |
| 5 | Build your Promo Ticket | Same as step 4 for promotional backgrounds |
| 6 | Select Font layout Test | Pick a Google font and text layout, build and print a test ticket, download templates |
| 7 | Buy Printers & Paper | Add a printer lease and order paper stock, then **Finish & Login** returns to the login page |

Each step checks its required choices before moving on. Going back keeps what the user already entered.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) with React 19 and TypeScript
- CSS Modules for styling, with brand colours as CSS variables in `src/app/globals.css`
- Google Fonts via `next/font`

## Project structure

```
src/
  app/
    page.tsx               Login page
    register/page.tsx      Signup wizard page
    globals.css            Fonts, brand colours, base styles
  components/
    Header.tsx             Site header (nav and sub-nav)
    LoginCard.tsx          Login form
    ui/Form.module.css     Shared field and button styles (login look)
    register/
      RegisterWizard.tsx   Holds wizard state and switches steps
      Stepper.tsx          Progress bar
      steps.ts             Step names, user details type
      data.ts              Sizes, printers, paper, colours and other static content
      state.ts             State types and defaults for each step
      fonts.ts             Google fonts offered on the font step
      StepCard.module.css  Shared step card, title band, sections and footer
      UserDetailsForm.tsx  Step 1
      steps/               Steps 2 to 7
      ui/                  Carousel, sheet diagrams, ticket backgrounds and previews, footer
public/
  images/                  Logos, login background, core background textures
  fonts/                   Acumin Pro
```

## Notes

- Logos, the login background, the Acumin font and the core background textures are copied from the main Ticket-IT app (`New-Frontend`).
- Promotional backgrounds and ticket layouts are drawn in CSS, so they use the brand colours, header and font the user picks.
- "Build with AI" is a placeholder. It picks backgrounds from the store category and colours, and no AI service is called.
- The Excel and background template downloads produce sample CSV and SVG files.
