
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import FloatingSidebar from './components/FloatingSidebar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Dashboard from './pages/Dashboard';
import AIHub from './pages/AIHub';
import Auth from './pages/Auth';
import { Service } from './types';
import { PLANS } from './constants';
import { supabaseService, supabase } from './services/supabase';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'explore' | 'dashboard' | 'ai-hub' | 'auth'>('home');
  const [dashboardTab, setDashboardTab] = useState<'manage' | 'post' | 'admin'>('manage');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [exploreFilters, setExploreFilters] = useState<any>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [preSelectedPlan, setPreSelectedPlan] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserEmail(session?.user?.email || null);
      
      try {
        const data = await supabaseService.getServices();
        setServices(data || []);
      } catch (err) {
        console.error("Erro ao buscar dados do Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const addService = useCallback((newService: Service) => {
    setServices(prev => [newService, ...prev]);
  }, []);

  const updateServiceInState = useCallback((updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  }, []);

  const deleteServiceInState = useCallback(async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este anúncio permanentemente?")) return;
    try {
      await supabaseService.deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      if (currentUserEmail) {
        await supabaseService.createLog(currentUserEmail, 'Remoção de Anúncio', `Anúncio ID ${id} removido pelo usuário.`);
      }
    } catch (err) {
      alert("Erro ao remover serviço.");
    }
  }, [currentUserEmail]);

  const navigateTo = (page: 'home' | 'explore' | 'dashboard' | 'ai-hub' | 'auth', data?: any) => {
    setCurrentPage(page);
    if (page === 'explore' && data) {
      setExploreFilters(data);
    } else if (page === 'dashboard' && typeof data === 'string') {
      setDashboardTab(data as any);
    } else {
      setExploreFilters(null);
    }
  };

  const handlePostWithPlan = (planId?: string) => {
    if (planId) {
      setPreSelectedPlan(planId);
    }
    setShowPlansModal(false);
    
    if (currentUserEmail) {
      navigateTo('dashboard', 'post');
    } else {
      navigateTo('auth');
    }
  };

  const handleLogin = (email: string) => {
    setCurrentUserEmail(email);
    if (preSelectedPlan) {
      navigateTo('dashboard', 'post');
    } else {
      navigateTo('dashboard', 'manage');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUserEmail(null);
    setPreSelectedPlan(null);
    navigateTo('home');
  };

  const faqData = [
    { q: "Como anuncio na Rede365?", a: "Clique em 'Anunciar Grátis', escolha um plano e preencha os dados do seu serviço." },
    { q: "É seguro contratar por aqui?", a: "Sim! Priorizamos anúncios com verificação e avaliações reais de clientes locais em Salvador e região." },
    { q: "Quais cidades a Rede365 atende?", a: "Atualmente Salvador, Simões Filho e Lauro de Freitas." }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Carregando Rede365...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar 
        onNavigate={navigateTo} 
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onShowPlans={() => setShowPlansModal(true)}
        currentPage={currentPage} 
      />
      
      <FloatingSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={navigateTo}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onShowPlans={() => setShowPlansModal(true)}
        currentUserEmail={currentUserEmail}
      />

      <main className="flex-grow">
        {currentPage === 'home' && (
          <Home 
            services={services}
            onExplore={() => navigateTo('explore')} 
            onPost={handlePostWithPlan}
            onShowPlans={() => setShowPlansModal(true)}
            onShowFAQ={() => setShowFAQModal(true)}
            onViewService={(s) => navigateTo('explore', { searchTerm: s.title })}
          />
        )}
        {currentPage === 'explore' && <Explore services={services} externalFilters={exploreFilters} />}
        {currentPage === 'auth' && <Auth onAuthSuccess={handleLogin} />}
        {currentPage === 'dashboard' && (
          <Dashboard 
            onAddService={addService} 
            onUpdateService={updateServiceInState}
            onDeleteService={deleteServiceInState}
            services={services} 
            initialTab={dashboardTab}
            currentUserEmail={currentUserEmail}
            preSelectedPlanId={preSelectedPlan}
            onNavigateToAI={() => navigateTo('ai-hub')}
            onNavigateHome={() => navigateTo('home')}
            onSetActiveTab={setDashboardTab}
          />
        )}
        {currentPage === 'ai-hub' && <AIHub />}
      </main>

      {showPlansModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-500">
            <div className="p-8 md:p-12 overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-4xl font-black text-slate-900">Seu Plano <span className="text-indigo-600">Rede365</span></h2>
                  <p className="text-slate-500 text-lg mt-2 font-medium">Divulgue seu serviço em Salvador e região com quem entende da Bahia.</p>
                </div>
                <button onClick={() => setShowPlansModal(false)} className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center hover:text-red-500"><i className="fa-solid fa-xmark text-xl"></i></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {PLANS.map((plan) => (
                  <div key={plan.id} className={`relative p-8 rounded-[2rem] border-2 transition-all duration-300 flex flex-col h-full ${plan.highlight ? 'border-indigo-600 bg-indigo-50/50 scale-105 shadow-xl' : 'border-slate-100 bg-white hover:border-indigo-200'}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.highlight ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-indigo-600'}`}><i className={`fa-solid ${plan.icon} text-2xl`}></i></div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">{plan.name}</h3>
                    <div className="text-2xl font-black text-slate-900 mb-4">R$ {plan.price.toFixed(2)}</div>
                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] font-bold text-slate-600 leading-tight"><i className="fa-solid fa-circle-check text-green-500 mt-0.5"></i> {benefit}</li>
                      ))}
                    </ul>
                    <button onClick={() => handlePostWithPlan(plan.id)} className={`w-full py-4 rounded-xl font-black transition-all ${plan.highlight ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}>{plan.id === 'free' ? 'Começar Grátis' : 'Selecionar'}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showFAQModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-8 md:p-12 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-start mb-10"><h2 className="text-3xl font-black text-slate-900">Dúvidas <span className="text-indigo-600">Rede365</span></h2><button onClick={() => setShowFAQModal(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center"><i className="fa-solid fa-xmark"></i></button></div>
            <div className="space-y-6">{faqData.map((f, i) => <div key={i} className="bg-slate-50 p-6 rounded-2xl"><h4 className="font-bold text-slate-900 mb-2">{f.q}</h4><p className="text-sm text-slate-600">{f.a}</p></div>)}</div>
          </div>
        </div>
      )}

      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-slate-500 text-sm mb-4">&copy; {new Date().getFullYear()} Rede365. Conectando Salvador ao sucesso.</div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Tecnologia por <a href="https://cid-engenharia360.vercel.app/#/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-4">CidEngenharia</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
