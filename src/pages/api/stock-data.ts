import type { NextApiRequest, NextApiResponse } from 'next';
import { scrapeYahooCMP } from '../../utils/scrapeYahoo';
import { scrapeGoogleFinance } from '../../utils/scrapeGoogle';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { symbol } = req.query;
    if (!symbol || typeof symbol !== 'string') return res.status(400).json({ error: 'Symbol required' });
    const isNumeric = /^\d+$/.test(symbol); // matches only digits
    const yahooFormattedSymbol = isNumeric ? symbol : `${symbol}.NS`;

    try {
        const [cmp, googleData] = await Promise.all([
            scrapeYahooCMP(yahooFormattedSymbol),
            scrapeGoogleFinance(symbol)
        ]);

        const data = {
            cmp,
            peRatio: googleData.peRatio,
            earnings: googleData.earnings
        };
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
}