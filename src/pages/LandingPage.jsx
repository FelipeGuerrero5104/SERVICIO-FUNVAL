import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="h-screen">
      <nav className="p-2 text-white flex items-center justify-between bg-[#023866]">
        <div>
          <button
            onClick={() => navigate("/login")}
            className="mr-5 bg-gradient-to-br from-[#2196f3] to-[#0d47a1] hover:bg-gradient-to-br hover:from-[#1e88e5] hover:to-[#12345a] transition-colors text-white font-bold py-1 px-4 md:py-3 md:px-12 rounded-lg cursor-pointer"
          >
            Login
          </button>
        </div>
      </nav>
      <main className="flex items-center justify-center h-full">
        <img src="hero2.gif" alt="gif funval" className="rounded-2xl w-[400px] h-[300px]  2xl:w-[1150px] 2xl:h-[600px] mb-16 lg:h-[450px] lg:w-[800px] md:h-[350px] md:w-[650px] sm:h-[350px] sm:w-[550px]" />
      </main>
    </div>
  );
}