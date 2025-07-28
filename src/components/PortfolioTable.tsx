"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { SECTOR_GROUPS, Stock } from '../types/portfolio';
import axios from 'axios';
import classNames from 'classnames';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface Props {
    stocks: Stock[];
}

export const PortfolioTable = ({ stocks }: Props) => {
    const [data, setData] = useState<Stock[]>(stocks);
    const [collapsedSectors, setCollapsedSectors] = useState<Record<string, boolean>>({});
    const [mounted, setMounted] = useState(false);
    const [showLoadMessage, setShowLoadMessage] = useState(true);

    const fetchCMP = useCallback(async () => {
        const updated = await Promise.all(
            stocks.map(async (stock) => {
                try {
                    const res = await axios.get(`/api/stock-data?symbol=${stock.nse_bse}`);
                    return {
                        ...stock,
                        cmp: res.data.cmp,
                        peRatio: res.data.peRatio,
                        latestEarnings: res.data.earnings,
                        dataReady: true
                    };
                } catch {
                    return {
                        ...stock,
                        dataReady: false,
                    };
                }
            })
        );
        setData(updated);
    }, [stocks]);

    useEffect(() => {
        setMounted(true);
        fetchCMP();
        const interval = setInterval(fetchCMP, 15000);
        return () => clearInterval(interval);
    }, [fetchCMP]);

    const toggleSector = (sector: string) => {
        setCollapsedSectors((prev) => ({
            ...prev,
            [sector]: !prev[sector]
        }));
    };

    const totalInvestment = data.reduce((acc, s) => acc + s.purchasePrice * s.quantity, 0);

    return (
        <div className="overflow-x-auto p-4">
            <div className="flex justify-end mb-4">
                {showLoadMessage && (
                    <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded text-sm font-medium flex justify-between items-start">
                        <span>Please wait up to 2 minutes for the data to load.</span>
                        <button
                            onClick={() => setShowLoadMessage(false)}
                            className="ml-4 text-blue-600 hover:text-blue-800 focus:outline-none"
                            aria-label="Dismiss"
                        >
                            &times;
                        </button>
                    </div>
                )}
            </div>
            <table className="min-w-full table-auto border border-black-700">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border-b border-gray-300 px-2 py-1">Particulars</th>
                        <th className="border-b border-l border-gray-300 px-2 py-1">Purchase Price</th>
                        <th className="border-b border-l border-gray-300 px-2 py-1">Qty</th>
                        <th className="border-b border-l border-gray-300 px-2 py-1">Investment</th>
                        <th className="border-b border-l border-gray-300 px-2 py-1">Portfolio %</th>
                        <th className="border-b border-l border-gray-300 px-2 py-1">NSE/BSE</th>
                        <th className="border-b border-l border-gray-300 px-2 py-1">CMP</th>
                        <th className="border-b border-l border-gray-300 px-2 py-1">Present Value</th>
                        <th className="border-b border-l border-gray-300 px-2 py-1">Gain/Loss</th>
                        <th className="border-b border-l border-gray-300 px-2 py-1">P/E Ratio</th>
                        <th className="border-b border-l border-gray-300 px-2 py-1">Latest Earnings</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(SECTOR_GROUPS).map(([sector, stocksInSector]) => {
                        const sectorStocks = data.filter((stock) => stocksInSector.includes(stock.particulars));
                        if (sectorStocks.length === 0) return null;

                        const isCollapsed = collapsedSectors[sector];

                        return (
                            <React.Fragment key={sector}>
                                <tr
                                    className="bg-gray-200 cursor-pointer"
                                    onClick={() => toggleSector(sector)}
                                >
                                    <td colSpan={12} className="font-bold text-left py-2 pl-2">
                                        <span className="flex items-center gap-1">
                                            {isCollapsed ? (
                                                <ChevronRightIcon className="w-4 h-4" />
                                            ) : (
                                                <ChevronDownIcon className="w-4 h-4" />
                                            )}
                                            {sector}
                                        </span>
                                    </td>
                                </tr>
                                {!isCollapsed &&
                                    sectorStocks.map((stock) => {
                                        const investment = stock.purchasePrice * stock.quantity;
                                        const percent = ((investment / totalInvestment) * 100).toFixed(2);

                                        const isReady = stock.dataReady && typeof stock.cmp === 'number';

                                        const cmpDisplay = isReady ? Number(stock.cmp).toFixed(2) : 0;
                                        const presentValue = isReady ? (Number(stock.cmp) * stock.quantity).toFixed(2) : 0;
                                        const gainLossRaw = isReady ? Number(stock.cmp) * stock.quantity - investment : null;
                                        const gainLoss = gainLossRaw !== null ? gainLossRaw.toFixed(2) : 0;

                                        return (
                                            <tr
                                                key={stock.particulars}
                                                className="text-center hover:bg-violet-100 transition-colors"
                                            >
                                                <td>{stock.particulars}</td>
                                                <td className="border-l border-gray-300 px-2 py-1">{stock.purchasePrice}</td>
                                                <td className="border-l border-gray-300 px-2 py-1">{stock.quantity}</td>
                                                <td className="border-l border-gray-300 px-2 py-1">{investment.toFixed(2)}</td>
                                                <td className="border-l border-gray-300 px-2 py-1">{percent}%</td>
                                                <td className="border-l border-gray-300 px-2 py-1">{stock.nse_bse}</td>
                                                <td className="border-l border-gray-300 px-2 py-1">{cmpDisplay}</td>
                                                <td className="border-l border-gray-300 px-2 py-1">{presentValue}</td>
                                                <td
                                                    className={classNames(
                                                        {
                                                            'text-green-600': isReady && gainLossRaw! > 0,
                                                            'text-red-600': isReady && gainLossRaw! < 0,
                                                        },
                                                        'border-l border-gray-300 px-2 py-1'
                                                    )}
                                                >
                                                    {mounted ? gainLoss : 0}
                                                </td>
                                                <td className="border-l border-gray-300 px-2 py-1">{stock.peRatio ?? 0}</td>
                                                <td className="border-l border-gray-300 px-2 py-1">{stock.latestEarnings ?? 0}</td>
                                            </tr>
                                        );
                                    })}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
