import StudentDashboard from "../components/StudentDashboard";
import AdminDashboard from "../components/AdminDashboard";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <main className="p-6 max-w-7xl mx-auto ">
        {user?.role?.name === "Admin" ? (
          <AdminDashboard />
        ) : (
          <StudentDashboard />
        )}
      </main>
    </div>
  );
}
