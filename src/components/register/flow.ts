// Which steps the wizard shows, based on the solutions the retailer picks

export type Solution = 'paper' | 'esl' | 'screens';

export const SOLUTION_NAMES: Record<Solution, string> = {
  paper: 'Paper',
  esl: 'Electronic Shelf Labels',
  screens: 'Digital Screens',
};

export type StepId =
  | 'start'
  | 'solution'
  | 'brand'
  | 'paper-sizes-everyday'
  | 'paper-sizes-promo'
  | 'paper-bg-everyday'
  | 'paper-bg-promo'
  | 'paper-font'
  | 'paper-buy'
  | 'esl-choose'
  | 'esl-design'
  | 'esl-font'
  | 'esl-buy'
  | 'screen-choose'
  | 'screen-content'
  | 'screen-motion'
  | 'screen-buy'
  | 'order'
  | 'products'
  | 'golive';

export interface WizardStep {
  id: StepId;
  label: string;
}

const GET_STARTED: WizardStep[] = [
  { id: 'start', label: 'Start' },
  { id: 'solution', label: 'Choose your solution' },
  { id: 'brand', label: 'Your brand' },
];

const SOLUTION_STEPS: Record<Solution, WizardStep[]> = {
  paper: [
    { id: 'paper-sizes-everyday', label: 'Everyday Ticket Sizes' },
    { id: 'paper-sizes-promo', label: 'Promotional Ticket Sizes' },
    { id: 'paper-bg-everyday', label: 'Build your Everyday Ticket' },
    { id: 'paper-bg-promo', label: 'Build your Promotional Ticket' },
    { id: 'paper-font', label: 'Select Font layout Test' },
    { id: 'paper-buy', label: 'Buy Printers & Paper' },
  ],
  esl: [
    { id: 'esl-choose', label: 'Choose your ESLs' },
    { id: 'esl-design', label: 'Design your ESL tickets' },
    { id: 'esl-font', label: 'ESL font and layout' },
    { id: 'esl-buy', label: 'Fixtures and access points' },
  ],
  screens: [
    { id: 'screen-choose', label: 'Choose your screens' },
    { id: 'screen-content', label: 'Design your screen content' },
    { id: 'screen-motion', label: 'Screen font and layout' },
    { id: 'screen-buy', label: 'Mounts and network' },
  ],
};

const FINISH: WizardStep[] = [
  { id: 'order', label: 'Review and checkout' },
  { id: 'products', label: 'Add products and prices' },
  { id: 'golive', label: 'Go live' },
];

export const SOLUTION_ORDER: Solution[] = ['paper', 'esl', 'screens'];

export const buildSteps = (solutions: Solution[]): WizardStep[] => {
  const chosen = SOLUTION_ORDER.filter((s) => solutions.includes(s));
  // Until a solution is picked, show the shared steps only
  if (chosen.length === 0) return [...GET_STARTED, ...FINISH];
  return [...GET_STARTED, ...chosen.flatMap((s) => SOLUTION_STEPS[s]), ...FINISH];
};
