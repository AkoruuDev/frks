import React, { useState, useEffect, useRef } from 'react';
import type { ObjectiveType, IdentityMode, Profile, Book, Transaction } from './types';
import { ObjectiveType as ObjectiveTypeConst, IdentityMode as IdentityModeConst } from './types';
import { getTacticalBriefing } from './services/geminiService';
import { BOOK_ARSENAL, INITIAL_TASKS } from './constants';
import { Plus, Minus, LogOut, Trash2, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, DollarSign, ShieldAlert, Target, Lock, User, Activity } from 'lucide-react';

// --- HELPERS ---
import formatCurrency from './utils/formatCurrency';
import useAppPersistence from './hooks/useAppPersistence';
import useFocusTimer from './hooks/useFocusTimer';

export default function App() {
  // --- STATES ---
  const [splashPhase, setSplashPhase] = useState<number>(1);
  const [screen, setScreen] = useState<string>('home');
  const [history, setHistory] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [briefing, setBriefing] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [popupBook, setPopupBook] = useState<any>(null);

  // App Data
  const [profile, setProfile] = useState<Profile>({ email: '', phone: '', city: '', objective: null, notifications: false });
  const [finances, setFinances] = useState({ balance: 0, transactions: [] as Transaction[] });
  const [financialSetup, setFinancialSetup] = useState({ salary: '', fixedExpenses: '', goalAmount: '', startDate: '', targetDate: '', goalType: '' });
  const [intellectual, setIntellectual] = useState({ books: [] as Book[], totalFocusMinutes: 0, goal: '' });
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [userMode, setUserMode] = useState<IdentityMode>(IdentityModeConst.TRACKER);

  // UI Locals
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState(''); // Simulated
  const [transDesc, setTransDesc] = useState('');
  const [transValue, setTransValue] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [bookPages, setBookPages] = useState('');
  const [editBookId, setEditBookId] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState('');

  // Timer
  const { timer, setTimer } = useFocusTimer(() => {
    setIntellectual(prev => ({
      ...prev,
      totalFocusMinutes: prev.totalFocusMinutes + 25
    }));
  });

  // --- PERSISTENCE ---
  useAppPersistence(loading, { profile, finances, financialSetup, intellectual, tasks, userMode }, (state) => {
    setProfile(state.profile);
    setFinances(state.finances);
    setFinancialSetup(state.financialSetup);
    setIntellectual(state.intellectual);
    setTasks(state.tasks);
    setUserMode(state.userMode);
  });  

  // --- NAVIGATION ---
  const changeScreen = (newScreen: string) => {
    setHistory(prev => [...prev, screen]);
    setFuture([]);
    setScreen(newScreen);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setFuture(f => [screen, ...f]);
    setHistory(h => h.slice(0, -1));
    setScreen(prev);
  };

  const goForward = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory(h => [...h, screen]);
    setFuture(f => f.slice(1));
    setScreen(next);
  };

  // --- ACTIONS ---
  const handleStartProtocol = () => {
    setProfile({ email: '', phone: '', city: '', objective: null, notifications: false });
    changeScreen('create_profile');
  };

  const handleLogin = () => {
    const saved = localStorage.getItem('freak_data');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.profile.email.toLowerCase() === loginEmail.toLowerCase()) {
        setProfile(data.profile);
        setFinances(data.finances);
        setFinancialSetup(data.financialSetup);
        setIntellectual(data.intellectual);
        setTasks(data.tasks);
        setUserMode(data.userMode);
        changeScreen('dashboard');
      } else {
        alert("OPERADOR NÃO ENCONTRADO NO BANCO DE DADOS.");
      }
    } else {
      alert("NENHUM OPERADOR REGISTRADO NESTE TERMINAL.");
    }
  };

  const handleObjectiveSelect = (type: ObjectiveType) => {
    setProfile((p: any) => ({ ...p, objective: type }));
    setTasks(INITIAL_TASKS[type] || {});
    if (type === ObjectiveTypeConst.FINANCIAL) changeScreen('financial_intro');
    else if (type === ObjectiveTypeConst.INTELLECTUAL) changeScreen('intellectual_intro');
    else changeScreen('dashboard');
  };

  const handleAddTransaction = (type: 'IN' | 'OUT') => {
    if (!transValue || !transDesc) return;
    const val = parseFloat(transValue.replace(',', '.'));
    const newTrans: Transaction = {
      id: Date.now().toString(),
      description: transDesc,
      value: val,
      type,
      date: new Date().toLocaleDateString('pt-BR')
    };
    setFinances(prev => ({
      balance: type === 'IN' ? prev.balance + val : prev.balance - val,
      transactions: [newTrans, ...prev.transactions]
    }));
    setTransDesc('');
    setTransValue('');
  };

  const handleAddBook = () => {
    if (!bookTitle || !bookPages) return;
    const newBook: Book = {
      id: Date.now().toString(),
      title: bookTitle,
      totalPages: parseInt(bookPages),
      currentPage: 0
    };
    setIntellectual(prev => ({ ...prev, books: [newBook, ...prev.books] }));
    setBookTitle('');
    setBookPages('');
  };

  const updateBriefing = async () => {
    if (profile.objective) {
      const b = await getTacticalBriefing(profile.objective, userMode);
      setBriefing(b);
      const randomBook = BOOK_ARSENAL[Math.floor(Math.random() * BOOK_ARSENAL.length)];
      setPopupBook(randomBook);
      setModalVisible(true);
    }
  };

  // --- RENDERERS ---
  const TacticalLine = ({ className = "" }) => (
    <div className={`h-px bg-zinc-800 w-full relative ${className}`}>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-red-600"></div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-red-600"></div>
    </div>
  );

  const Layout = ({ children, title, subtitle }: { children?: React.ReactNode, title?: string, subtitle?: string }) => (
    <div className="min-h-screen bg-black text-white flex flex-col pb-24">
      {/* Header */}
      <header className="p-6 border-b border-zinc-900 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-md z-40">
        <div className="flex items-center gap-4">
          {history.length > 0 && (
            <button onClick={goBack} className="p-2 hover:bg-zinc-800 rounded transition-colors">
              <ChevronLeft size={24} />
            </button>
          )}
          <div>
            <h1 className="text-xl font-black tracking-widest text-white uppercase">{title || 'FREAKS CO.'}</h1>
            <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em]">{subtitle || 'OBSESSED WITH DISCIPLINE'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {future.length > 0 && (
            <button onClick={goForward} className="p-2 hover:bg-zinc-800 rounded transition-colors">
              <ChevronRight size={24} />
            </button>
          )}
          {screen === 'dashboard' && (
             <button onClick={() => changeScreen('home')} className="p-2 hover:bg-zinc-800 rounded text-red-600 transition-colors">
                <LogOut size={20} />
             </button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>

      {/* Persistent Bottom Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl p-2 rounded-2xl flex justify-around items-center z-50">
        <button onClick={() => changeScreen('dashboard')} className={`p-3 rounded-xl transition-all ${screen === 'dashboard' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white'}`}>
          <Target size={24} />
        </button>
        <button onClick={updateBriefing} className="p-3 bg-white text-black rounded-xl hover:bg-red-600 hover:text-white transition-all">
          <ShieldAlert size={24} />
        </button>
        <button onClick={() => changeScreen('home')} className={`p-3 rounded-xl text-zinc-500 hover:text-white transition-all`}>
          <LogOut size={24} className="rotate-180" />
        </button>
      </div>
    </div>
  );

  if (splashPhase === 1) {
    return (
      <div className="flex items-center justify-center h-screen bg-black transition-opacity duration-1000">
        <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter animate-pulse uppercase">BE A FREAK</h1>
      </div>
    );
  }

  if (splashPhase === 2) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="w-24 h-24 border-t-4 border-red-600 border-r-4 border-zinc-900 rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-black text-white tracking-[0.3em] uppercase">FREAKS CO.</h2>
        <div className="mt-4 flex gap-1">
          <div className="w-2 h-2 bg-red-600 animate-bounce delay-75"></div>
          <div className="w-2 h-2 bg-red-600 animate-bounce delay-150"></div>
          <div className="w-2 h-2 bg-red-600 animate-bounce delay-300"></div>
        </div>
      </div>
    );
  }

  if (screen === 'home') {
    return (
      <div className="h-screen bg-black relative flex flex-col items-center justify-between p-12 overflow-hidden">
        <div className="z-10 text-center mt-20">
          <h1 className="text-zinc-500 text-sm font-black tracking-[0.5em] mb-4">FREAKS COMPANY</h1>
          <h2 className="text-5xl md:text-7xl font-black text-white leading-tight uppercase">
            UM FREAK <br/> <span className="text-red-600">NUNCA DESISTE.</span>
          </h2>
          <TacticalLine className="my-8" />
          <p className="text-zinc-400 mt-2 max-w-md mx-auto font-medium">A mediocridade é o seu maior inimigo. O conforto é uma armadilha. Escolha a sua guerra.</p>
        </div>

        <div className="z-10 w-full max-w-sm flex flex-col gap-4">
          <button 
            onClick={handleStartProtocol}
            className="w-full py-5 bg-white text-black font-black text-lg tracking-widest hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 border-2 border-white"
          >
            INICIAR PROTOCOLO
          </button>
          <button 
            onClick={() => changeScreen('login')}
            className="w-full py-5 bg-transparent border-2 border-zinc-800 text-zinc-400 font-bold text-sm tracking-widest hover:border-white hover:text-white transition-all"
          >
            JÁ SOU MEMBRO (LOGIN)
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'login') {
    return (
      <Layout title="ACESSO OPERADOR" subtitle="BANCO DE DADOS FREAK">
        <div className="space-y-10 py-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tighter">IDENTIFIQUE-SE</h2>
            <p className="text-zinc-500 text-xs font-bold tracking-widest">INSIRA SUAS CREDENCIAIS DE CAMPO</p>
          </div>
          
          <div className="space-y-6">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-red-600 transition-colors" size={20} />
              <input 
                className="w-full bg-zinc-950 border border-zinc-900 p-5 pl-14 text-white focus:outline-none focus:border-red-600 transition-all font-bold tracking-wide" 
                placeholder="E-MAIL OPERACIONAL"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-red-600 transition-colors" size={20} />
              <input 
                type="password"
                className="w-full bg-zinc-950 border border-zinc-900 p-5 pl-14 text-white focus:outline-none focus:border-red-600 transition-all font-bold tracking-wide" 
                placeholder="CÓDIGO DE ACESSO"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
          </div>

          <TacticalLine />

          <button 
            onClick={handleLogin}
            className="w-full py-5 bg-red-600 text-white font-black text-lg tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/20"
          >
            AUTENTICAR ACESSO
          </button>

          <button 
            onClick={() => changeScreen('home')}
            className="w-full text-zinc-600 text-[10px] font-black tracking-[0.3em] uppercase hover:text-white transition-colors"
          >
            CANCELAR OPERAÇÃO
          </button>
        </div>
      </Layout>
    );
  }

  if (screen === 'create_profile') {
    return (
      <Layout title="NOVO OPERADOR">
        <div className="space-y-8 py-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-red-600 tracking-widest block uppercase">IDENTIFICAÇÃO</label>
            <input 
              className="w-full bg-zinc-950 border border-zinc-900 p-5 text-white focus:outline-none focus:border-red-600 transition-all font-bold" 
              placeholder="E-MAIL OPERACIONAL"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
            <input 
              className="w-full bg-zinc-950 border border-zinc-900 p-5 text-white focus:outline-none focus:border-red-600 transition-all font-bold" 
              placeholder="TELEFONE DE CONTATO"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>

          <TacticalLine />

          <div className="space-y-4">
             <label className="text-[10px] font-black text-red-600 tracking-widest block uppercase">LOCALIZAÇÃO</label>
             <input 
              className="w-full bg-zinc-950 border border-zinc-900 p-5 text-white focus:outline-none focus:border-red-600 transition-all font-bold" 
              placeholder="CIDADE / ESTADO"
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
            />
          </div>

          <button 
            onClick={() => changeScreen('choose_identity')}
            className="w-full py-5 bg-red-600 text-white font-black text-lg tracking-widest hover:bg-red-700 transition-all"
          >
            AVANÇAR PARA IDENTIDADE
          </button>
        </div>
      </Layout>
    );
  }

  if (screen === 'choose_identity') {
    return (
      <Layout title="ESCOLHA SUA IDENTIDADE">
        <div className="grid gap-6 py-10">
          {[
            { mode: IdentityModeConst.TRACKER, desc: "Um auxiliador passivo para sua rotina diária." },
            { mode: IdentityModeConst.MONK, desc: "Foco absoluto. Modo caverna ativado. Sem distrações." },
            { mode: IdentityModeConst.DARK, desc: "Obsessão total. Limite extremo. Sem desculpas." }
          ].map((item) => (
            <button 
              key={item.mode}
              onClick={() => { setUserMode(item.mode); changeScreen('choose_objective'); }}
              className="p-8 bg-zinc-950 border border-zinc-900 text-left hover:border-red-600 group transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 bg-zinc-900 group-hover:bg-red-600 transition-colors">
                <Activity size={12} className="text-zinc-700 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-red-600 transition-colors uppercase">{item.mode}</h3>
              <p className="text-sm text-zinc-500 mt-2 font-medium">{item.desc}</p>
            </button>
          ))}
        </div>
      </Layout>
    );
  }

  if (screen === 'choose_objective') {
    return (
      <Layout title="ESCOLHA SUA GUERRA">
        <div className="grid gap-6 py-10">
          {[
            { obj: ObjectiveTypeConst.PHYSICAL, title: "FÍSICA", desc: "Corpo, resistência e performance atlética." },
            { obj: ObjectiveTypeConst.INTELLECTUAL, title: "INTELECTUAL", desc: "Mente, estudos e sabedoria estóica." },
            { obj: ObjectiveTypeConst.FINANCIAL, title: "FINANCEIRA", desc: "Patrimônio, controle e liberdade absoluta." }
          ].map((item) => (
            <button 
              key={item.obj}
              onClick={() => handleObjectiveSelect(item.obj)}
              className="p-8 bg-zinc-950 border border-zinc-900 text-left hover:border-red-600 group transition-all relative"
            >
              <h3 className="text-xl font-black text-white group-hover:text-red-600 transition-colors uppercase">{item.title}</h3>
              <p className="text-sm text-zinc-500 mt-2 font-medium">{item.desc}</p>
              <div className="absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center opacity-10 group-hover:opacity-100 transition-opacity">
                 <Target size={20} />
              </div>
            </button>
          ))}
        </div>
      </Layout>
    );
  }

  if (screen === 'financial_intro') {
    return (
      <Layout title="DOUTRINA FINANCEIRA">
        <div className="space-y-8 py-10">
          <div className="bg-red-950/20 border-l-4 border-red-600 p-6">
            <h4 className="text-red-600 font-black text-sm tracking-widest mb-2 uppercase">AVISO TÁTICO</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">
              ESTE APLICATIVO NÃO É UM BANCO. NÃO ACEITAMOS DEPÓSITOS OU TRANSFERÊNCIAS. 
              FERRAMENTA EXCLUSIVA PARA DISCIPLINA E GESTÃO DE RECURSOS PRÓPRIOS.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black italic uppercase">"A LIBERDADE VEM DO CONTROLE."</h3>
            <p className="text-zinc-400 leading-relaxed">
              Sem controle, você é escravo do sistema. A abundância não vem da sorte, vem da <span className="text-white font-bold">OBSESSÃO PELO CÁLCULO</span>. 
              Aqui você registra cada centavo. Você encara a verdade. Você assume o comando.
            </p>
          </div>
          
          <TacticalLine />

          <button 
            onClick={() => changeScreen('financial_setup')}
            className="w-full py-5 bg-white text-black font-black tracking-widest hover:bg-red-600 hover:text-white transition-all border-2 border-white"
          >
            ENTENDIDO. IR PARA BRIEFING.
          </button>
        </div>
      </Layout>
    );
  }

  if (screen === 'financial_setup') {
    return (
      <Layout title="BRIEFING FINANCEIRO">
        <div className="space-y-6 py-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 tracking-widest block uppercase">GANHOS</label>
              <input 
                className="w-full bg-zinc-950 border border-zinc-900 p-5 text-white focus:outline-none focus:border-red-600 font-bold" 
                placeholder="R$ 0,00"
                value={financialSetup.salary}
                onChange={(e) => setFinancialSetup({ ...financialSetup, salary: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 tracking-widest block uppercase">GASTOS FIXOS</label>
              <input 
                className="w-full bg-zinc-950 border border-zinc-900 p-5 text-white focus:outline-none focus:border-red-600 font-bold" 
                placeholder="R$ 0,00"
                value={financialSetup.fixedExpenses}
                onChange={(e) => setFinancialSetup({ ...financialSetup, fixedExpenses: e.target.value })}
              />
            </div>
          </div>

          <TacticalLine />

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 tracking-widest block uppercase">META TOTAL DE PATRIMÔNIO</label>
            <input 
              className="w-full bg-zinc-950 border border-zinc-900 p-5 text-white focus:outline-none focus:border-red-600 font-bold" 
              placeholder="R$ 0,00"
              value={financialSetup.goalAmount}
              onChange={(e) => setFinancialSetup({ ...financialSetup, goalAmount: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 tracking-widest block uppercase">DATA ALVO</label>
              <input 
                className="w-full bg-zinc-950 border border-zinc-900 p-5 text-white focus:outline-none focus:border-red-600 font-bold" 
                placeholder="DD/MM/AAAA"
                value={financialSetup.targetDate}
                onChange={(e) => setFinancialSetup({ ...financialSetup, targetDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 tracking-widest block uppercase">TIPO DE META</label>
              <select 
                className="w-full h-16 bg-zinc-950 border border-zinc-900 px-4 text-white focus:outline-none focus:border-red-600 appearance-none font-bold"
                value={financialSetup.goalType}
                onChange={(e) => setFinancialSetup({ ...financialSetup, goalType: e.target.value })}
              >
                <option value="">SELECIONE</option>
                <option value="RESERVA">RESERVA EMERGÊNCIA</option>
                <option value="LIBERDADE">LIBERDADE FINANCEIRA</option>
                <option value="AQUISIÇÃO">AQUISIÇÃO ATIVOS</option>
              </select>
            </div>
          </div>
          <button 
            onClick={() => changeScreen('dashboard')}
            className="w-full py-5 bg-red-600 text-white font-black tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/10"
          >
            CONFIRMAR PROTOCOLO
          </button>
        </div>
      </Layout>
    );
  }

  if (screen === 'intellectual_intro') {
     return (
      <Layout title="DOUTRINA MENTAL">
        <div className="space-y-8 py-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-black italic uppercase">"A INTELIGÊNCIA É UMA ESCOLHA DE GUERRA."</h3>
            <p className="text-zinc-400 leading-relaxed">
              Em um mundo de distrações baratas, o foco profundo (Deep Work) é o superpoder do século XXI. 
              Não leia para se divertir. Leia para adquirir armas. Estude para dominar. 
              A mente mente. A preguiça é natural. <span className="text-red-600 font-bold">O CONFORTO É O INIMIGO.</span>
            </p>
          </div>

          <TacticalLine />

          <button 
            onClick={() => changeScreen('dashboard')}
            className="w-full py-5 bg-white text-black font-black tracking-widest hover:bg-red-600 hover:text-white transition-all border-2 border-white"
          >
            ENTENDIDO. IR PARA O FRONT.
          </button>
        </div>
      </Layout>
    );
  }

  if (screen === 'dashboard') {
    const taskTotal = Object.keys(tasks).length;
    const taskDone = Object.values(tasks).filter(v => v).length;
    const taskProgress = taskTotal > 0 ? Math.round((taskDone / taskTotal) * 100) : 0;

    const goalVal = parseFloat(financialSetup.goalAmount || '0');
    const metaPercent = goalVal > 0 ? Math.min(100, Math.max(0, (finances.balance / goalVal) * 100)) : 0;

    return (
      <Layout 
        title={`OPERADOR: ${profile.email.split('@')[0].toUpperCase()}`} 
        subtitle={`${userMode} / ${profile.objective}`}
      >
        <div className="space-y-12">
          {/* Progress Overview */}
          <div className="bg-zinc-950 border border-zinc-900 p-8 flex flex-col items-center text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-2 bg-red-600"></div>
             <div className="absolute top-0 right-0 w-2 h-2 bg-red-600"></div>
             <div className="absolute bottom-0 left-0 w-2 h-2 bg-red-600"></div>
             <div className="absolute bottom-0 right-0 w-2 h-2 bg-red-600"></div>

             <div className="text-6xl font-black mb-2 text-white">{taskProgress}%</div>
             <div className="text-[10px] font-black tracking-[0.4em] text-red-600 uppercase">DISCIPLINA DIÁRIA</div>
             <div className="w-full bg-zinc-900 h-1.5 mt-8 relative">
                <div className="bg-red-600 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ width: `${taskProgress}%` }}></div>
             </div>
          </div>

          {/* AI Tactical Briefing Section */}
          {briefing && (
            <div className="bg-zinc-950 border-l-4 border-red-600 p-8 animate-in slide-in-from-left duration-700">
              <div className="flex items-center gap-2 mb-4">
                 <ShieldAlert size={14} className="text-red-600" />
                 <h4 className="text-red-600 text-[10px] font-black tracking-widest uppercase">TACTICAL BRIEFING</h4>
              </div>
              <p className="text-zinc-200 font-medium italic text-lg leading-relaxed">"{briefing}"</p>
            </div>
          )}

          {/* Objectives Content */}
          {profile.objective === ObjectiveTypeConst.FINANCIAL && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-end">
                <h3 className="text-sm font-black tracking-widest text-zinc-500 uppercase">FLUXO DE CAIXA</h3>
                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{metaPercent.toFixed(1)}% DA META</span>
              </div>
              
              <div className="bg-zinc-950 p-12 border border-zinc-900 flex flex-col items-center shadow-2xl relative">
                <DollarSign size={20} className="text-zinc-800 absolute top-4 left-4" />
                <span className="text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">SALDO DISPONÍVEL EM CAMPO</span>
                <span className={`text-5xl font-black ${finances.balance >= 0 ? 'text-white' : 'text-red-600'}`}>
                  {formatCurrency(finances.balance)}
                </span>
              </div>

              <TacticalLine />

              <div className="grid grid-cols-2 gap-4">
                <input 
                  className="bg-zinc-950 border border-zinc-900 p-5 focus:border-red-600 outline-none text-sm font-bold uppercase tracking-tight"
                  placeholder="DESCRIÇÃO OPERAÇÃO"
                  value={transDesc}
                  onChange={(e) => setTransDesc(e.target.value)}
                />
                <input 
                  className="bg-zinc-950 border border-zinc-900 p-5 focus:border-red-600 outline-none text-sm font-bold"
                  placeholder="VALOR R$"
                  value={transValue}
                  onChange={(e) => setTransValue(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleAddTransaction('IN')}
                  className="bg-green-600 py-5 font-black text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-green-500 transition-all uppercase"
                >
                  <Plus size={18} /> ENTRADA
                </button>
                <button 
                  onClick={() => handleAddTransaction('OUT')}
                  className="bg-red-600 py-5 font-black text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 transition-all uppercase"
                >
                  <Minus size={18} /> SAÍDA
                </button>
              </div>

              <div className="space-y-3">
                {finances.transactions.map(t => (
                  <div key={t.id} className="bg-zinc-950 border border-zinc-900 p-5 flex justify-between items-center group transition-colors hover:bg-zinc-900/50">
                    <div className="flex gap-4 items-center">
                      <div className={`w-1 h-8 ${t.type === 'IN' ? 'bg-green-500' : 'bg-red-600'}`}></div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight">{t.description}</p>
                        <p className="text-[10px] text-zinc-600 font-bold">{t.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`font-black text-lg ${t.type === 'IN' ? 'text-green-500' : 'text-red-600'}`}>
                        {t.type === 'IN' ? '+' : '-'} {formatCurrency(t.value)}
                      </span>
                      <button className="text-zinc-800 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.objective === ObjectiveTypeConst.INTELLECTUAL && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h3 className="text-sm font-black tracking-widest text-zinc-500 uppercase">DEEP WORK TIMER</h3>
              
              <div className="bg-zinc-950 p-12 border border-zinc-900 flex flex-col items-center shadow-inner relative">
                 <div className="absolute top-4 right-4 animate-pulse">
                   <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                 </div>
                 <span className={`text-xs font-black tracking-widest mb-6 ${timer.mode === 'FOCUS' ? 'text-red-600' : 'text-green-500'} uppercase`}>
                   {timer.mode === 'FOCUS' ? 'FOCUS PROTOCOL' : 'REST PROTOCOL'}
                 </span>
                 <span className="text-8xl font-black text-white tabular-nums tracking-tighter">
                   {Math.floor(timer.timeLeft / 60).toString().padStart(2, '0')}:
                   {(timer.timeLeft % 60).toString().padStart(2, '0')}
                 </span>
                 <div className="flex gap-6 mt-10">
                    <button 
                      onClick={() => setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }))}
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 ${timer.isRunning ? 'bg-red-600' : 'bg-white text-black'}`}
                    >
                      {timer.isRunning ? <Pause size={32} /> : <Play size={32} />}
                    </button>
                    <button 
                      onClick={() => setTimer({ timeLeft: 25 * 60, isRunning: false, mode: 'FOCUS' })}
                      className="w-20 h-20 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-all"
                    >
                      <RotateCcw size={28} />
                    </button>
                 </div>
                 <TacticalLine className="mt-10" />
                 <p className="mt-4 text-[10px] font-black text-zinc-600 tracking-[0.3em] uppercase">
                   XP ACUMULADO: {intellectual.totalFocusMinutes} MIN
                 </p>
              </div>

              <TacticalLine />

              <h3 className="text-sm font-black tracking-widest text-zinc-500 uppercase mt-12">BIBLIOTECA TÁTICA</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    className="bg-zinc-950 border border-zinc-900 p-5 focus:border-red-600 outline-none text-sm font-bold uppercase"
                    placeholder="TÍTULO DO ARQUIVO"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                  />
                  <input 
                    className="bg-zinc-950 border border-zinc-900 p-5 focus:border-red-600 outline-none text-sm font-bold"
                    placeholder="TOTAL PÁGS"
                    value={bookPages}
                    onChange={(e) => setBookPages(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleAddBook}
                  className="w-full bg-white text-black py-5 font-black text-xs tracking-widest hover:bg-red-600 hover:text-white transition-all border-2 border-white uppercase"
                >
                  ADICIONAR LIVRO AO ARSENAL
                </button>
              </div>

              <div className="space-y-4">
                {intellectual.books.map(b => {
                  const progress = Math.round((b.currentPage / b.totalPages) * 100);
                  return (
                    <div key={b.id} className="bg-zinc-950 border border-zinc-900 p-8 space-y-6 group hover:border-zinc-700 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-black text-white uppercase tracking-tight">{b.title}</h4>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{b.currentPage} / {b.totalPages} PÁGINAS PROCESSADAS</p>
                        </div>
                        <div className="text-lg font-black text-red-600">{progress}%</div>
                      </div>
                      <div className="w-full bg-zinc-900 h-2 rounded-none overflow-hidden">
                        <div className="bg-red-600 h-full shadow-[0_0_8px_rgba(220,38,38,0.4)]" style={{ width: `${progress}%` }}></div>
                      </div>
                      <div className="flex justify-end gap-6 pt-2 border-t border-zinc-900">
                        {editBookId === b.id ? (
                           <div className="flex gap-4 items-center">
                             <input 
                              autoFocus
                              className="w-20 bg-zinc-900 border border-zinc-800 p-2 text-xs text-center font-bold"
                              value={pageInput}
                              onChange={(e) => setPageInput(e.target.value)}
                             />
                             <button 
                               onClick={() => {
                                 setIntellectual(prev => ({
                                   ...prev,
                                   books: prev.books.map(x => x.id === b.id ? { ...x, currentPage: Math.min(x.totalPages, parseInt(pageInput)) } : x)
                                 }));
                                 setEditBookId(null);
                                 setPageInput('');
                               }}
                               className="text-[10px] font-black text-green-500 uppercase tracking-widest"
                             >
                               SALVAR
                             </button>
                           </div>
                        ) : (
                          <button 
                            onClick={() => { setEditBookId(b.id); setPageInput(b.currentPage.toString()); }}
                            className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-colors"
                          >
                            ATUALIZAR PROGRESSO
                          </button>
                        )}
                        <button 
                          onClick={() => setIntellectual(prev => ({ ...prev, books: prev.books.filter(x => x.id !== b.id) }))}
                          className="text-[10px] font-black text-zinc-800 hover:text-red-600 uppercase tracking-widest transition-colors"
                        >
                          EXCLUIR
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Daily Protocol Checklist */}
          <div className="space-y-8">
            <h3 className="text-sm font-black tracking-widest text-zinc-500 uppercase">PROTOCOLO DIÁRIO</h3>
            <div className="space-y-4">
              {Object.keys(tasks).map(k => (
                <button 
                  key={k}
                  onClick={() => setTasks(prev => ({ ...prev, [k]: !prev[k] }))}
                  className={`w-full p-6 border text-left flex items-center justify-between transition-all group relative ${tasks[k] ? 'bg-zinc-950 border-zinc-900 opacity-40' : 'bg-black border-zinc-900 hover:border-red-600'}`}
                >
                  <div className="flex items-center gap-4">
                     <div className={`w-1 h-6 ${tasks[k] ? 'bg-zinc-800' : 'bg-red-600'}`}></div>
                     <span className={`font-black text-sm tracking-[0.1em] uppercase ${tasks[k] ? 'line-through text-zinc-600' : 'text-white'}`}>{k}</span>
                  </div>
                  <div className={`w-8 h-8 border-2 flex items-center justify-center transition-all ${tasks[k] ? 'bg-red-600 border-red-600' : 'border-zinc-800 group-hover:border-red-600'}`}>
                    {tasks[k] && <div className="w-3 h-3 bg-white"></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <TacticalLine className="opacity-30" />

          {/* Reset Action */}
          <div className="pt-10 flex flex-col items-center gap-4">
             <button 
               onClick={() => { if(confirm("ESTA AÇÃO IRÁ APAGAR TODO O SEU HISTÓRICO DE DISCIPLINE. CONFIRMAR?")) { localStorage.clear(); window.location.reload(); } }}
               className="text-[10px] font-black text-zinc-800 hover:text-red-900 tracking-[0.4em] uppercase transition-colors"
             >
               DESTRUIÇÃO TOTAL DE DADOS
             </button>
             <p className="text-[8px] text-zinc-900 font-bold uppercase tracking-widest">ENCRYPTED END-TO-END DISCIPLINE TERMINAL</p>
          </div>
        </div>

        {/* Tactical Briefing Modal */}
        {modalVisible && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <div className="bg-zinc-950 border-2 border-red-600 w-full max-w-sm p-12 relative animate-in zoom-in-95 duration-300 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
               <button onClick={() => setModalVisible(false)} className="absolute top-6 right-6 text-zinc-800 hover:text-white transition-colors">
                 <Plus size={24} className="rotate-45" />
               </button>
               <h2 className="text-red-600 font-black text-sm tracking-[0.3em] mb-10 uppercase text-center">TACTICAL ARSENAL</h2>
               
               {popupBook && (
                 <div className="text-center space-y-6">
                    <div className="inline-block px-3 py-1 bg-zinc-900 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 border border-zinc-800">{popupBook.category}</div>
                    <div className="text-4xl font-black text-white italic leading-tight uppercase tracking-tighter">"{popupBook.title}"</div>
                    <div className="text-sm text-zinc-500 font-black tracking-widest">OPERADOR AUTOR: {popupBook.author}</div>
                    <TacticalLine className="my-6 opacity-50" />
                    <p className="text-zinc-300 text-base leading-relaxed font-medium italic">"{popupBook.desc}"</p>
                 </div>
               )}

               <button 
                onClick={() => setModalVisible(false)}
                className="w-full py-5 bg-white text-black font-black text-xs tracking-widest mt-12 hover:bg-red-600 hover:text-white transition-all border-2 border-white uppercase"
               >
                 ACEITAR MISSÃO
               </button>
            </div>
          </div>
        )}
      </Layout>
    );
  }

  return (
    <div className="h-screen bg-black flex items-center justify-center text-zinc-800 font-black tracking-[1em]">
      CARREGANDO...
    </div>
  );
}