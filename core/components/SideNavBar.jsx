"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useCurrentUser from '@/core/hooks/useCurrentUser'

export default function SideNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useCurrentUser()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Watchlist', path: '/watchlist', icon: 'visibility' },
    { name: 'Portfolio', path: '/portfolio', icon: 'account_balance_wallet' },
    { name: 'Markets', path: '/markets', icon: 'monitoring' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col py-6 bg-[#0b0e12] border-r border-white/5 z-50 font-manrope antialiased">
      <div className="px-6 mb-10">
        <h1 className="text-2xl font-extrabold tracking-tighter text-[#0df259]">Progetto GPOI</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">AFSF Management</p>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center px-3 py-3 font-bold rounded-lg transition-all group ${
                isActive
                  ? 'text-[#0df259] border-r-2 border-[#0df259] bg-gradient-to-r from-[#0df259]/10 to-transparent'
                  : 'text-slate-400 font-medium hover:bg-[#36393e] hover:text-[#e1e2e8]'
              }`}
            >
              <span className={`material-symbols-outlined mr-3 ${isActive ? '' : 'text-slate-500 group-hover:text-[#e1e2e8]'}`}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-3 space-y-2 border-t border-white/5 pt-6">
        <div className="px-4 py-3 glass-panel rounded-xl mb-4">
          <p className="text-xs text-slate-400 font-bold mb-2">PREMIUM ACCESS</p>
          <Link href="/pricing" className="block text-center w-full bg-surface-container hover:bg-surface-container-high border border-[#0df259]/30 text-[#0df259] py-2.5 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(13,242,89,0.1)] active:scale-95 transition-all">
            Vedi Piani
          </Link>
        </div>
        {user ? (
          <button
            onClick={async () => {
              try {
                await logout()
                router.push('/')
              } catch (err) {
                console.error('Logout error', err)
              }
            }}
            className="w-full text-left flex items-center px-3 py-2 text-slate-400 font-medium hover:text-[#e1e2e8] transition-colors"
          >
            <span className="material-symbols-outlined mr-3 text-sm">logout</span>
            <span className="text-sm">Logout</span>
          </button>
        ) : (
          <Link className="flex items-center px-3 py-2 text-slate-400 font-medium hover:text-[#e1e2e8] transition-colors" href="/login">
            <span className="material-symbols-outlined mr-3 text-sm">person</span>
            <span className="text-sm">Accedi</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
