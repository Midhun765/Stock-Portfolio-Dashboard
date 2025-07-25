import puppeteer from "puppeteer";

export async function scrapeGoogleFinance(symbol: string): Promise<{ peRatio: number | null; earnings: number | null }> {
  try {
    let url;
    const isNumeric = /^\d+$/.test(symbol);
    if (isNumeric) {
      url = `https://www.google.com/finance/quote/${symbol}:BOM`;
    }
    else {

      url = `https://www.google.com/finance/quote/${symbol}:NSE`;
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const data = await page.evaluate(() => {
      const result: { pe: string | null; eps: string | null } = { pe: null, eps: null };

      const statBlocks = Array.from(document.querySelectorAll("div.gyFHrc"));
      statBlocks.forEach((block) => {
        const labelDiv = block.querySelector("div.mfs7Fc");
        const valueDiv = block.querySelector("div.P6K39c");

        if (!labelDiv || !valueDiv) return;

        const label = labelDiv.textContent?.trim();
        if (label === "P/E ratio") {
          result.pe = valueDiv.textContent?.trim() || null;
        }
      });

      const tableRows = Array.from(document.querySelectorAll("td.J9Jhg"));
      tableRows.forEach((td) => {
        const labelDiv = td.querySelector("div.rsPbEe");
        if (labelDiv?.textContent?.trim() === "Earnings per share") {
          const valueTd = td.nextElementSibling;
          if (valueTd && valueTd.classList.contains("QXDnM")) {
            result.eps = valueTd.textContent?.trim() || null;
          }
        }
      });

      return result;
    });
    await browser.close();
    const peRatio = data.pe ? parseFloat(data.pe.replace(/,/g, "")) : null;
    const earnings = data.eps ? parseFloat(data.eps.replace(/,/g, "")) : null;
    return { peRatio, earnings };
  } catch (error) {
    console.error("Google Finance scrape error:", error);
    return { peRatio: null, earnings: null };
  }
}