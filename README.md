# Stock Portfolio Dashboard

A web dashboard to track and analyze your stock portfolio, built with Next.js, React, and Tailwind CSS. The dashboard fetches real-time stock data (current market price, P/E ratio, earnings) from Yahoo Finance and Google Finance, and organizes your holdings by sector.

## Features
- View your portfolio with live updates for CMP, P/E ratio, and earnings
- Sector-wise grouping and collapsible sections
- Gain/loss, present value, and portfolio allocation calculations
- Data fetched using Yahoo Finance API and Google Finance scraping

## Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd stock-portfolio-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Usage
- The dashboard displays your portfolio as defined in `src/types/portfolio.ts` (`initialPortfolio`).
- Real-time data is fetched automatically every 15 seconds.
- You can customize your portfolio by editing the `initialPortfolio` array.
- Sector groups can be collapsed/expanded for easier navigation.

## Notes on Data Fetching
- **Yahoo Finance:** Uses the `yahoo-finance2` npm package for fetching current market price (CMP).
- **Google Finance:** Uses Puppeteer to scrape P/E ratio and earnings per share. This requires extra system resources and may not work on all hosting platforms (e.g., serverless environments).
- No API keys are required, but scraping may be rate-limited or blocked by Google.

## Customization
- To add or modify stocks, edit the `initialPortfolio` array in `src/types/portfolio.ts`.
- To change sector groupings, update the `SECTOR_GROUPS` object in `src/types/portfolio.ts`.

## Available Scripts
- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm start` — Start the production server
- `npm run lint` — Run ESLint

## Dependencies
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Puppeteer](https://pptr.dev/) (for Google Finance scraping)
- [yahoo-finance2](https://www.npmjs.com/package/yahoo-finance2)
- [Axios](https://axios-http.com/)

## License
MIT
