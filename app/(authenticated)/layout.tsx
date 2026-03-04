import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "./Sidebar";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0c0c1a] flex">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto bg-[#0c0c1a] text-white">
        {children}
      </main>
    </div>
  );
}
