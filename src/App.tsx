import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Hop as Home, Users, Calendar as CalendarIcon, MessageSquare, LogOut, Loader as Loader2, Zap, Menu, X } from 'lucide-react';

interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

import Dashboard from './pages/Dashboard';
import Database from './pages/Database';
import Leads from './pages/Leads';
import CalendarPage from './pages/Calendar';
import Assistant from './pages/Assistant';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PricingPage from './pages/PricingPage';

type Page = 'dashboard' | 'database' | 'leads' | 'calendar' | 'assistant';

import Logo from './components/Logo';

export default function App() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
        setIsMobileMenuOpen(false);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAuthSuccess = (u: any, t?: string) => {
    setUser(u as MockUser);
    if (t) setToken(t);
    setShowAuth(false);
  };

  const handleLogout = async () => {
    setUser(null);
    setToken(null);
  };

  const handleNavClick = (pageId: Page) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LandingPage
          onLogin={() => { setAuthMode('signin'); setShowAuth(true); }}
          onSignUp={() => { setAuthMode('signup'); setShowAuth(true); }}
          onPricing={() => setShowPricing(true)}
          error={loginError}
        />
        <AnimatePresence>
          {showAuth && (
            <AuthPage
              onClose={() => setShowAuth(false)}
              onSuccess={handleAuthSuccess}
              initialMode={authMode}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Executive Hub', icon: LayoutDashboard },
    { id: 'database', label: 'Property Database', icon: Home },
    { id: 'leads', label: 'Priority Leads', icon: Users },
    { id: 'calendar', label: 'Concierge Schedule', icon: CalendarIcon },
    { id: 'assistant', label: 'Operations Assistant', icon: MessageSquare },
  ];

  const pageLabels: Record<Page, string> = {
    dashboard: 'Executive Hub',
    database: 'Property Database',
    leads: 'Priority Leads',
    calendar: 'Concierge Schedule',
    assistant: 'Operations Assistant',
  };

  const SidebarContent = ({ onNavClick }: { onNavClick: (id: Page) => void }) => (
    <>
      <div className="p-5 flex items-center gap-2 border-b border-[#1A1A1A]">
        <Logo className="w-5 h-5 shrink-0" />
        <span className="font-sans font-medium text-base text-white tracking-tight">PropAI</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[8px] uppercase tracking-[0.3em] text-[#444] mb-3 px-2 font-black">Operations</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavClick(item.id as Page)}
            className={`w-full flex items-center p-2.5 rounded-lg transition-all group ${
              currentPage === item.id
              ? 'bg-gold/10 text-gold border border-gold/20'
              : 'text-[#666] hover:text-white hover:bg-[#111]'
            }`}
          >
            <item.icon className={`w-4 h-4 shrink-0 mr-3 group-hover:scale-110 transition-transform ${currentPage === item.id ? 'text-gold' : ''}`} />
            <span className="text-[11px] font-medium tracking-wide">{item.label}</span>
          </button>
        ))}

        <div className="pt-2">
          <button
            onClick={() => { setShowPricing(true); setIsMobileMenuOpen(false); }}
            className="w-full flex items-center p-2.5 rounded-lg text-[#666] hover:text-gold hover:bg-gold/5 border border-transparent hover:border-gold/20 transition-all group"
          >
            <Zap className="w-4 h-4 shrink-0 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-medium tracking-wide">Manage Protocol</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-[#1A1A1A] bg-[#070707]">
        <div className="bg-[#111111] p-3 rounded-xl border border-[#222] mb-4">
          <p className="text-[8px] text-[#444] mb-1 font-sans uppercase tracking-widest font-black">Efficiency</p>
          <p className="text-lg font-light text-white">88%</p>
          <div className="w-full bg-[#222] h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-gold h-full w-[88%] shadow-[0_0_8px_rgba(197,160,89,0.4)]"></div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 px-1">
          <img src={user.photoURL || ''} alt="" className="w-7 h-7 rounded-full border border-[#333] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-white truncate">{user.displayName}</p>
            <p className="text-[9px] text-[#444] truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-2 rounded-lg text-[#444] hover:text-red-500 hover:bg-red-500/5 transition-all group"
        >
          <LogOut className="w-4 h-4 shrink-0 mr-3 group-hover:rotate-12 transition-transform" />
          <span className="text-[11px] font-medium tracking-wide">Exit Protocol</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex overflow-hidden font-sans">
      <AnimatePresence>
        {showPricing && (
          <PricingPage
            userEmail={user?.email}
            onBack={() => setShowPricing(false)}
            onSignUp={() => {
              setShowPricing(false);
              if (!user) { setAuthMode('signup'); setShowAuth(true); }
            }}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0A0A0A] border-r border-[#1A1A1A] flex-col shrink-0">
        <SidebarContent onNavClick={handleNavClick} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-[#0A0A0A] border-r border-[#1A1A1A] flex flex-col lg:hidden"
            >
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-[#444] hover:text-white hover:bg-[#1A1A1A] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent onNavClick={handleNavClick} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#050505] min-w-0">
        <header className="sticky top-0 z-10 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#1A1A1A] px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-[#666] hover:text-white hover:bg-[#1A1A1A] transition-all shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xs sm:text-sm font-sans font-black tracking-[0.15em] text-white uppercase truncate">
              {pageLabels[currentPage]}
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="flex items-center space-x-1.5 text-[8px] uppercase tracking-[0.2em] text-gold font-black bg-gold/5 px-2 sm:px-2.5 py-1 rounded-lg border border-gold/10">
              <span className="w-1 h-1 bg-gold rounded-full animate-pulse"></span>
              <span className="hidden sm:inline">Active Core</span>
              <span className="sm:hidden">Live</span>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 xl:p-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {currentPage === 'dashboard' && <Dashboard user={user} />}
              {currentPage === 'database' && <Database user={user} />}
              {currentPage === 'leads' && <Leads user={user} />}
              {currentPage === 'calendar' && <CalendarPage user={user} token={token} />}
              {currentPage === 'assistant' && <Assistant user={user} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
