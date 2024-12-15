'use client';

import Navbar from "./components/Navbar/navbar";
import HomePage from "@/app/components/home/HomePage";
import Daily from "./components/Daily/daily";
import Quest from "@/app/components/Quests/page";
import CyclePage from "./components/Cycle/CyclePage";
import Bonus from "./components/Bonus/Bonus";
import LeaderboardPage from "./components/leaderboard/leaderboard";
import RatePage from "./components/Rate/RatePage";
import MemoWallet from "./components/Wallet/MemoWallet";
import Did from "./components/Did/Did"; // Assuming Did is the correct component
import Activity from "./components/Cycle/Activity";
import { FlagProvider } from "@/app/lib/context/FlagContext";
import { useWallet } from "./lib/context/WalletContext";
import { useDid } from "./lib/context/DidContext";
import { useActivity } from "./lib/context/ActivityContext";

export default function Home() {
  const { isOpened } = useWallet();
  const { isOpenDid } = useDid();
  const { joinedCards } = useActivity();

  return (
    <div>
      <main className="bg-[#051610] px-[20px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[102px] py-[20px] sm:py-[25px] md:py-[30px] lg:py-[35px] xl:px-[40px] min-h-[100vh]">
        <FlagProvider>
          <Navbar />
          {isOpened ? (
            <MemoWallet />
          ) : isOpenDid ? (
            <Did />
          ) : joinedCards.length !== 0 ? ( // Use length to check if no joined cards exist
            <Activity />
          ) : (
            <div>
              <HomePage />
              <Daily />
              <Quest />
              <CyclePage />
              <Bonus />
              <LeaderboardPage />
              <RatePage />
            </div>
          )}
        </FlagProvider>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* Add footer content if needed */}
      </footer>
    </div>
  );
}
