"use client";
import SideNavBar from "./SideNavBar";
import TopNavBar from "./TopNavBar";

export default function GPOIPageShell({ children }) {
  return (
    <>
        <SideNavBar />
        <main className="ml-64 min-h-screen">
            <TopNavBar />
            <div className="p-8 space-y-8">
                {children}
            </div>
        </main>
        {/* Background Subtle Glows */}
        <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-primary-container/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-[#ffdad9]/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </>
  );
}
