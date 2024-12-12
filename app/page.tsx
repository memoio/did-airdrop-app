import Navbar from "./components/Navbar/navbar";
import HomePage from "@/app/components/home/HomePage";
import Daily from "./components/Daily/daily";
import Quest from "@/app/components/Quests/page"
import CyclePage from "./components/Cycle/CyclePage";
import Bonus from "./components/Bonus/Bonus";
import LeaderboardPage from "./components/leaderboard/leaderboard";
import RatePage from "./components/Rate/RatePage";
import { FlagProvider } from "@/app/lib/context/FlagContext";
import Sign from "./components/home/Mint";

export default function Home() {
  return (
    <div>
      <main className="bg-[#051610] px-[20px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[102px] py-[20px] sm:py-[25px] md:py-[30px] lg:py-[35px] xl:py-[40px]">
        <FlagProvider>
          <Sign />
          <Navbar />
          <HomePage />
          <div>
            <Daily />
            <Quest />
            <CyclePage />
            <Bonus />
            <LeaderboardPage />
            <RatePage />
          </div>
        </FlagProvider>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}