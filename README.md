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

The steps depend on the solutions the retailer picks (Paper, Electronic Shelf Labels, Digital Screens; one, two or all three). The progress list on the left shows them in order and lets the user revisit any step already reached.

| Group | Step | What the user does |
|---|---|---|
| Get started | Start | Enter user details (name, login, password, email, contact and address) |
| | Choose your solution | Pick Paper, ESL and/or Digital Screens |
| | Your brand | Store category, logo, brand colours and promo colours, entered once and reused everywhere |
| Paper | Everyday Ticket Sizes, Promotional Ticket Sizes | Choose a print process and ticket sizes |
| | Build your Everyday Ticket, Build your Promotional Ticket | Three tabs: Select a design, Build with AI or Upload your own. Everyday has one design; Promotional has a design per promotion type (Special Price, Sale, Clear Out, Buy More & Save, New, Members Deal) |
| | Select Font layout Test | Pick a Google font, then a tab per ticket (Everyday and each promotion) to pick its text layout on the background chosen earlier; build and print a test ticket; download templates |
| | Buy Printers & Paper | Add a printer lease and order paper stock |
| Electronic Shelf Labels | Choose your ESLs | Zkong ZKC23Q, ZKC31Q, ZKC42Q, ZKC97B, ZKC102B with quantities |
| | Design your ESL tickets | One Everyday design and a design per promotion in black, white, red and yellow, previewed on each chosen ESL size; starts from the Paper designs when Paper is chosen |
| | ESL font and layout | Font, then Everyday and Promotional tabs to pick each ticket's text layout on its ESL design; Multi Product Ticket |
| | Fixtures and access points | Recommended rails, clips, holders, stands, wall mounts, access points and 3 months of subscription |
| Digital Screens | Choose your screens | Zkong Legendary bars, wide displays and portrait floor-standing screens with quantities |
| | Design your screen content | Select a design, Build with AI or Upload your own: one Everyday design (the Paper textures) and a design per promotion (the Paper designs); starts from the Paper designs when Paper is chosen |
| | Screen font and layout | Font, then Everyday and Promotional tabs to pick each ticket's text layout on its screen design; static or animated, single or Multi Product; preview in each chosen screen's frame |
| | Mounts and network | Clamps or brackets (integrated stands are included), screen access points and 3 months of subscription |
| Order and go live | Review and checkout | One order grouped by Paper, ESL and Digital Screens, then the confirmation screen |
| | Add products and prices | Spreadsheet upload, retail system connection (Retail Express, Shopify, Lightspeed, Odoo) or help request; Save and finish later |
| | Go live | Activation checklist and the same product shown on every chosen output |

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
      Stepper.tsx          Grouped progress list on the left
      flow.ts              Which steps show for the chosen solutions
      steps.ts             User details type
      data.ts              Sizes, printers, paper, colours and other static content
      devices.ts           ESL and Digital Screen models, fixtures, mounts, network and subscription
      products.ts          Sample products and retail systems
      pricing.ts           Recommendations and order lines
      state.ts             State types and defaults for each step
      fonts.ts             Google fonts offered on the font step
      StepCard.module.css  Shared step card, title band, sections and footer
      UserDetailsForm.tsx  Start step
      steps/               All other steps
      ui/                  Carousel, ticket, ESL and screen previews, illustrations, footer
public/
  images/                  Logos, login background, core background textures
  fonts/                   Acumin Pro
```

## Notes

- Logos, the login background, the Acumin font and the core background textures are copied from the main Ticket-IT app (`New-Frontend`).
- Promotional backgrounds and ticket layouts are drawn in CSS, so they use the brand colours, header and font the user picks.
- "Build with AI" is a placeholder. It picks backgrounds from the store category and colours, and no AI service is called.
- The Excel and background template downloads produce sample CSV and SVG files.
- "Use Foodvilla sample artwork" on the Paper background and screen content uploads loads the client's Foodvilla artwork from `public/images/foodvilla` (copied from `Campaign-AI-Ticket-it/Ticket-templates`). Uploaded screen artwork is shown as it is.
- ESL and screen previews are drawn at each model's real pixel size. Device, fixture and equipment pictures are SVG illustrations.
- All prices on the ESL, Digital Screens and order steps are demonstration pricing. Uploads, connections, device activation and checkout are simulated.
