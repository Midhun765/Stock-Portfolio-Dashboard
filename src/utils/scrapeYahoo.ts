import { initialPortfolio, nseResult } from "@/types/portfolio";
import yahooFinance from "yahoo-finance2";

export async function scrapeYahooCMP(symbol: string): Promise<number | string> {
    try {
        let finalSymbol = symbol;
        const portfolio = initialPortfolio.find((p) => p.nse_bse === symbol);

        const isNumeric = /^\d+$/.test(symbol);
        if (isNumeric && portfolio) {
            const searchResults = await yahooFinance.search(portfolio.particulars);

            const nseResult: nseResult | undefined = searchResults.quotes.find((q: nseResult) => {
                return (
                    q?.symbol?.endsWith(".BO")
                );
            });
            if (!nseResult || !nseResult.symbol) {
                return '';
            }
            finalSymbol = nseResult.symbol;
        }
        else if (!symbol.includes(".NS") && !symbol.includes(".BO")) {
            finalSymbol = `${symbol}.NS`;
        }

        const result = await yahooFinance.quote(finalSymbol);

        const price = result.regularMarketPrice ?? 'nan';

        if (typeof price !== 'number' || isNaN(price)) {
            throw new Error("Unable to parse CMP from Yahoo Finance");
        }

        return price;
    } catch (error) {
        console.error("Yahoo CMP scrape error:", error);
        throw error;
    }
}

