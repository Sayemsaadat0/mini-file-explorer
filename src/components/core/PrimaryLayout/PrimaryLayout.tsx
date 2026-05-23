import Navbar from "./Navbar";
import Sidebar from "@/components/core/Sidebar/Sidebar";

type PrimaryLayoutProps = {
  children: React.ReactNode;
};

const PrimaryLayout = ({ children }: PrimaryLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default PrimaryLayout;
