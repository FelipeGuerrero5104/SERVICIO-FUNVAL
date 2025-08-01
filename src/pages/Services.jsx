import ServicesList from "../components/Services/ServicesList";
import UserServices from "../components/Services/UserServices";
import { useAuth } from "../context/AuthContext";

export default function Services() {
  const { user } = useAuth();
  const isAdmin = user?.role?.name?.toLowerCase() === "admin";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 ">
      <main className="p-6 max-w-7xl mx-auto pt-10">
        {isAdmin ? <ServicesList /> : <UserServices />}
      </main>
    </div>
  );
}
