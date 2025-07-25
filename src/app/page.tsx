import { PortfolioTable } from "@/components/PortfolioTable";
import { initialPortfolio } from "@/types/portfolio";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-3xl text-center font-bold mb-4">My Portfolio</h1>
      <PortfolioTable stocks={initialPortfolio}/>
    </main>
  );
}
