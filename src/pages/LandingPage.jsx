import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="h-screen">
      <nav className="p-2 text-white flex items-center justify-between bg-[#023866]">
        <div>
          <button
            onClick={() => navigate("/login")}
            className="mr-5 bg-[#2c7ee2] hover:bg-[#023866] transition-colors text-white font-bold py-1 px-4 md:py-3 md:px-12 rounded-lg cursor-pointer"
          >
            Login
          </button>
        </div>
      </nav>
      <main className="flex items-center justify-center h-full">
        <img src="HERO.gif" alt="gif funval" className="rounded-2xl w-[1150px] "/>
      </main>
    </div>
  );
}