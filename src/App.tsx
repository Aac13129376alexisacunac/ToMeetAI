import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Users, 
  Check, 
  Lock, 
  Unlock, 
  Copy, 
  RotateCcw, 
  AlertTriangle, 
  Heart, 
  Info, 
  X, 
  ShieldCheck, 
  Wine, 
  MessageSquare, 
  HelpCircle, 
  UtensilsCrossed, 
  TrendingUp, 
  PartyPopper,
  CreditCard,
  LockKeyhole,
  Search,
  Share2,
  ExternalLink
} from 'lucide-react';
import { parseGuests, solveTables, buildWhatsAppCopy, buildWhatsAppHostsCopy, buildWhatsAppOrgsCopy, buildWhatsAppIndividualCopy, encodeTablesToUrl, decodeTablesFromUrl } from './utils';
import { Guest, Table } from './types';
import { Language, LANGUAGES, PRESETS_BY_LANG, translations } from './translations';

export default function App() {
  // Language State
  const [lang, setLang] = useState<Language>('es');

  // Application State
  const [inputText, setInputText] = useState(PRESETS_BY_LANG.es.boda.text);
  const [capacity, setCapacity] = useState(PRESETS_BY_LANG.es.boda.capacity);
  const [selectedPreset, setSelectedPreset] = useState<'amigos' | 'boda' | 'oficina' | 'consorcio'>('boda');
  
  const [isSolving, setIsSolving] = useState(false);
  const [solvingStep, setSolvingStep] = useState(0);
  const [solvedTables, setSolvedTables] = useState<Table[]>([]);
  const [hasSolvedOnce, setHasSolvedOnce] = useState(false);

  // Paywall & Payment State
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Premium WhatsApp Assistant States
  const [activeWaTab, setActiveWaTab] = useState<'hosts' | 'organizers' | 'guests'>('hosts');
  const [activeResultTab, setActiveResultTab] = useState<'tables' | 'whatsapp'>('tables');
  const [whatsappTone, setWhatsappTone] = useState<'elegant' | 'short' | 'informal'>('elegant');
  const [waSearchQuery, setWaSearchQuery] = useState('');
  const [copiedGuestId, setCopiedGuestId] = useState<string | null>(null);

  // Guest Shared Viewer Mode States
  const [sharedTables, setSharedTables] = useState<Table[] | null>(null);
  const [viewerSearchQuery, setViewerSearchQuery] = useState('');

  // Auto-derived interactive shareUrl
  const shareUrl = useMemo(() => {
    if (solvedTables.length === 0) return '';
    try {
      const b64 = encodeTablesToUrl(solvedTables);
      return `${window.location.origin}${window.location.pathname}?v=${b64}`;
    } catch (e) {
      console.error(e);
      return '';
    }
  }, [solvedTables]);

  // Read view parameter from URL on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') || params.get('v');
    const searchParam = params.get('search') || params.get('s');
    
    if (viewParam) {
      const parsed = decodeTablesFromUrl(viewParam);
      if (parsed && parsed.length > 0) {
        setSharedTables(parsed);
        if (searchParam) {
          setViewerSearchQuery(searchParam);
        }
      }
    }
  }, []);

  // Checkout Form State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Simulation Steps
  const solvingSteps = [
    { text: translations[lang].step1, percent: 18 },
    { text: translations[lang].step2, percent: 45 },
    { text: translations[lang].step3, percent: 75 },
    { text: translations[lang].step4, percent: 100 }
  ];

  // Auto-solving loop simulation
  useEffect(() => {
    let timer: any;
    if (isSolving) {
      if (solvingStep < solvingSteps.length - 1) {
        timer = setTimeout(() => {
          setSolvingStep(prev => prev + 1);
        }, 850);
      } else {
        // Complete the solving
        timer = setTimeout(() => {
          const parsed = parseGuests(inputText);
          const solved = solveTables(parsed, capacity);
          setSolvedTables(solved);
          setIsSolving(false);
          setHasSolvedOnce(true);
        }, 900);
      }
    }
    return () => clearTimeout(timer);
  }, [isSolving, solvingStep, solvingSteps.length]);

  // Synchronize Preset text when language shifts
  useEffect(() => {
    const presetsList = ['amigos', 'boda', 'oficina', 'consorcio'] as const;
    let foundPresetKey: 'amigos' | 'boda' | 'oficina' | 'consorcio' | null = null;
    
    // Check if the current inputText matches any preset in any language
    const languagesList: Language[] = ['es', 'en', 'fr', 'it'];
    for (const l of languagesList) {
      for (const p of presetsList) {
        if (inputText.trim() === PRESETS_BY_LANG[l][p].text.trim()) {
          foundPresetKey = p;
          break;
        }
      }
      if (foundPresetKey) break;
    }

    if (foundPresetKey) {
      setInputText(PRESETS_BY_LANG[lang][foundPresetKey].text);
      setCapacity(PRESETS_BY_LANG[lang][foundPresetKey].capacity);
    }
  }, [lang]);

  // Listen for the Escape key to close the paywall modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPaywallModal(false);
        setPaymentProcessing(false);
        setPaymentSuccess(false);
        setCheckoutError('');
      }
    };

    if (showPaywallModal) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPaywallModal]);

  // Handle Preset Selection
  const applyPreset = (key: 'amigos' | 'boda' | 'oficina' | 'consorcio') => {
    setSelectedPreset(key);
    setInputText(PRESETS_BY_LANG[lang][key].text);
    setCapacity(PRESETS_BY_LANG[lang][key].capacity);
    // Auto trigger solving to make it feel super snap
    triggerSolve(PRESETS_BY_LANG[lang][key].text, PRESETS_BY_LANG[lang][key].capacity);
  };

  const triggerSolve = (textToSolve = inputText, capToSolve = capacity) => {
    if (!textToSolve.trim()) return;
    setIsSolving(true);
    setSolvingStep(0);
    setIsUnlocked(false);
    setPaymentSuccess(false);
    setActiveResultTab('tables');
  };

  // Perform custom capacity changes and auto-re-solve
  const handleCapacityChange = (val: number) => {
    const newCap = Math.max(2, Math.min(10, val));
    setCapacity(newCap);
  };

  // Real copy to clipboard handler
  const handleCopyWhatsApp = () => {
    if (!isUnlocked) {
      setShowPaywallModal(true);
      return;
    }

    const whatsappText = buildWhatsAppCopy(solvedTables);
    navigator.clipboard.writeText(whatsappText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(err => {
      console.error('No se pudo copiar el texto: ', err);
    });
  };

  // Simulate Card Formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(v);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      setCardExpiry(`${v.substring(0, 2)}/${v.substring(2, 4)}`);
    } else {
      setCardExpiry(v);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCardCVC(v);
  };

  // Process payment simulation
  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName.trim()) {
      setCheckoutError('Por favor ingresa el nombre del titular');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length < 15) {
      setCheckoutError('Número de tarjeta inválido de prueba');
      return;
    }
    if (cardExpiry.length < 5) {
      setCheckoutError('Fecha de vencimiento inválida');
      return;
    }
    if (cardCVC.length < 3) {
      setCheckoutError('Código CVC incompleto');
      return;
    }

    setCheckoutError('');
    setPaymentProcessing(true);

    // Simulate server side authorization
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      setIsUnlocked(true);
      
      // Auto close modal after showing success screen
      setTimeout(() => {
        setShowPaywallModal(false);
        // Force an app notification copy of the selected premium tone and tab
        let whatsappText = '';
        if (activeWaTab === 'hosts') {
          whatsappText = buildWhatsAppHostsCopy(solvedTables, lang, shareUrl, whatsappTone);
        } else if (activeWaTab === 'organizers') {
          whatsappText = buildWhatsAppOrgsCopy(solvedTables, lang, shareUrl, whatsappTone);
        } else {
          whatsappText = buildWhatsAppHostsCopy(solvedTables, lang, shareUrl, whatsappTone);
        }
        navigator.clipboard.writeText(whatsappText).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }, 1800);

    }, 2200);
  };

  // Helper calculation for global statistics of solved tables
  const totalGuests = parseGuests(inputText).length;
  const averageHarmony = solvedTables.length > 0 
    ? Math.round(solvedTables.reduce((acc, t) => acc + t.harmonyScore, 0) / solvedTables.length)
    : 100;

  // Initial trigger
  useEffect(() => {
    const parsed = parseGuests(inputText);
    const solved = solveTables(parsed, capacity);
    setSolvedTables(solved);
    setHasSolvedOnce(true);
  }, []);

  if (sharedTables) {
    // Find matching guest for the search query
    const results = sharedTables.flatMap((t, tIdx) => 
      t.guests.map((g, gIdx) => ({
        guest: g,
        table: t,
        tableIdx: tIdx,
        guestIdx: gIdx
      }))
    ).filter(item => 
      item.guest.name.toLowerCase().includes(viewerSearchQuery.toLowerCase())
    );

    // Let's check if there's an exact match when searching
    const exactMatch = results.find(item => 
      item.guest.name.trim().toLowerCase() === viewerSearchQuery.trim().toLowerCase()
    );

    return (
      <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-sans selection:bg-[#C5A852]/20 selection:text-[#B29235]">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-[#C5A852]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 py-8 relative">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3.5 mb-3">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-md border border-amber-900/10">
                <Wine className="w-5.5 h-5.5 text-[#B29235]" />
              </div>
              <div>
                <h1 className="text-2xl font-serif italic text-[#B29235] tracking-tight text-left"></h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono text-left">Pase Digital de Asiento</p>
              </div>
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#B29235] mt-2 text-center">
              {translations[lang].viewerWelcome}
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed text-center">
              {translations[lang].viewerSubtitle}
            </p>
          </div>

          {/* Golden Search Box */}
          <div className="bg-white rounded-2xl border border-[#C5A852]/20 shadow-md p-6 max-w-xl mx-auto mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#B29235]" />
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                {translations[lang].viewerSearchPlaceholder}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#B29235]/65" />
                </div>
                <input
                  type="text"
                  value={viewerSearchQuery}
                  onChange={(e) => setViewerSearchQuery(e.target.value)}
                  placeholder={translations[lang].searchGuestsPlaceholder}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A852] focus:border-[#C5A852] font-semibold text-slate-800 transition text-sm"
                />
                {viewerSearchQuery && (
                  <button 
                    onClick={() => setViewerSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-slate-600 font-mono"
                  >
                    limpiar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Search Result - Seating Highlights Card */}
          {viewerSearchQuery.trim() !== '' && (
            <div className="space-y-6">
              {exactMatch ? (
                <div className="bg-gradient-to-br from-[#FCFAF8] to-white rounded-3xl border-2 border-[#C5A852]/60 p-6 md:p-8 shadow-lg max-w-2xl mx-auto animate-fadeIn relative">
                  {/* Decorative Sparkle */}
                  <Sparkles className="w-8 h-8 text-[#B29235] absolute top-4 right-4 animate-bounce" />
                  
                  <div className="text-center sm:text-left space-y-4">
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-widest font-mono inline-block">
                      {translations[lang].viewerCongratulations}
                    </span>
                    <h3 className="text-3xl font-serif font-bold text-slate-800">
                      ¡Hola, {exactMatch.guest.name}! 👋
                    </h3>
                    
                    <div className="py-6 border-y border-amber-900/10 flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-24 h-24 bg-[#B29235] text-white rounded-full flex flex-col items-center justify-center font-bold font-serif shadow-md shrink-0 relative">
                        <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping opacity-45" />
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#FDF9EA]">Mesa</span>
                        <span className="text-sm leading-tight text-center px-1 truncate max-w-full font-sans font-bold">
                          {exactMatch.table.name}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-center sm:text-left">
                        <p className="text-sm text-slate-600">
                          {translations[lang].viewerCompanionsLabel}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          {exactMatch.table.guests.map(other => {
                            const isMe = other.name === exactMatch.guest.name;
                            return (
                              <span 
                                key={other.id} 
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                  isMe 
                                    ? 'bg-[#B29235] text-white shadow-xs' 
                                    : 'bg-slate-100 text-slate-700 border border-slate-200/60'
                                }`}
                              >
                                {other.name} {other.diet && `🥦`}
                              </span>
                            );
                          })}
                        </div>
                        {exactMatch.guest.diet && (
                          <div className="flex items-center gap-2 pt-2 text-xs">
                            <span className="font-bold text-rose-600">{translations[lang].viewerDietLabel}</span>
                            <span className="bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase border border-rose-100">{exactMatch.guest.diet}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* QR Code Seating Pass Card */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4 mt-4 text-left">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`} 
                        alt="My pass QR"
                        className="w-16 h-16 bg-slate-50 p-1 rounded-xl border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1 grow text-left">
                        <h4 className="text-xs font-bold text-slate-800">{translations[lang].viewerQrMobileTitle}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {translations[lang].viewerQrMobileDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="max-w-xl mx-auto space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block text-center">Resultados de tu búsqueda ({results.length})</span>
                  {results.slice(0, 5).map(({ guest, table }) => (
                    <button
                      key={guest.id}
                      onClick={() => setViewerSearchQuery(guest.name)}
                      className="w-full bg-white hover:bg-amber-50/30 border border-slate-200 hover:border-[#C5A852]/40 rounded-xl p-3.5 text-left flex items-center justify-between shadow-xs transition duration-150 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-800 text-sm">{guest.name}</span>
                      </div>
                      <span className="text-xs bg-[#B29235]/15 text-[#B29235] px-2.5 py-1 rounded-lg font-bold">
                        📍 {table.name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 italic text-sm">
                  No se encontraron comensales llamados "{viewerSearchQuery}". Intenta con otro nombre.
                </div>
              )}
            </div>
          )}

          {/* Show All Tables for the event so guests can browse their friends */}
          <div className="mt-12">
            <h3 className="text-lg font-serif font-bold text-slate-700 border-b border-amber-900/10 pb-3 mb-6 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-[#B29235]" />
              {translations[lang].viewerAllTables}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sharedTables.map((table, tIdx) => (
                <div 
                  key={table.id}
                  className="bg-white rounded-2xl border border-[#C5A852]/10 p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-rose-50 mb-4">
                    <h4 className="font-serif font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-5.5 h-5.5 rounded-full bg-[#B29235]/10 flex items-center justify-center text-[10px] font-bold text-[#B29235]">
                        {tIdx + 1}
                      </div>
                      <span>{table.name}</span>
                    </h4>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded font-bold font-mono">
                      {table.guests.length} comensales
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {table.guests.map(g => {
                      const isHighlighted = viewerSearchQuery.trim() !== '' && g.name.toLowerCase().includes(viewerSearchQuery.trim().toLowerCase());
                      return (
                        <div 
                          key={g.id} 
                          className={`p-1.5 rounded-lg flex items-center gap-1 leading-normal ${
                            isHighlighted 
                              ? 'bg-[#B29235] text-white font-bold shadow-xs animate-pulse' 
                              : 'text-slate-600 bg-slate-50/45 hover:bg-slate-50 border border-slate-100'
                          }`}
                        >
                          <span className="truncate">{g.name}</span>
                          {g.diet && !g.diet.toLowerCase().includes('sin restric') && <span className="text-[10px]" title={g.diet}>🥬</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Back to planner button */}
          <div className="mt-16 text-center border-t border-amber-900/10 pt-8">
            <button
              onClick={() => {
                setSharedTables(null);
                window.history.replaceState({}, document.title, window.location.pathname);
              }}
              className="inline-flex items-center gap-2 bg-[#FAF8F5] hover:bg-[#FAF9F6] text-slate-500 hover:text-[#B29235] border border-slate-200 py-2.5 px-6 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer hover:border-[#C5A852]/30 active:scale-[0.98]"
            >
              <span>{translations[lang].viewerBackToApp}</span>
            </button>
            <p className="text-[10px] text-slate-450 mt-4 leading-normal font-mono">
              Organizado e impreso impecablemente con AcomodaAI • AI Studio Build
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-sans selection:bg-[#C5A852]/20 selection:text-[#B29235]">
      
      {/* Top Notification Promo Strip */}
      <div className="bg-gradient-to-r from-[#C5A852]/10 via-[#FCFAF6] to-[#FCFAF6] text-amber-900/90 text-center py-2 px-4 text-xs font-medium tracking-wide flex items-center justify-center gap-1.5 border-b border-amber-900/10 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#B29235]" />
        <span>{translations[lang].promoStrip}</span>
        <span className="hidden md:inline bg-[#C5A852]/15 text-[#B29235] text-[10px] px-1.5 py-0.5 rounded ml-1.5 uppercase font-bold tracking-tight border border-[#C5A852]/30">{translations[lang].algoVersion}</span>
      </div>

      {/* Main Luxury Header */}
      <header className="border-b border-amber-905/10 bg-white/80 backdrop-blur sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shadow-md border border-amber-900/10">
              <Wine className="w-5.5 h-5.5 text-[#B29235] stroke-[1.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-serif italic text-[#B29235] tracking-tight">AcomodaAI</h1>
                <span className="text-[9px] bg-[#C5A852]/10 text-[#B29235] px-1.5 py-0.5 rounded font-mono border border-[#C5A852]/20 tracking-wider">v1.99 PRO</span>
              </div>
              <p className="text-xs text-slate-500 font-sans tracking-wide">{translations[lang].subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            {/* Language Selector Selector */}
            <div className="flex items-center gap-1.5 bg-[#FAF9F6] px-2 py-1.5 rounded-xl border border-amber-900/10 select-none">
              <span className="text-[10px] font-sans font-semibold text-slate-400">🌐</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="text-xs bg-transparent border-none text-slate-600 focus:outline-none focus:ring-0 font-semibold cursor-pointer py-0.5 pl-1 pr-6"
                style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%23B29235\' height=\'16\' viewBox=\'0 0 24 24\' width=\'16\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="text-slate-800 bg-white">
                    {l.flag} {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Scenario Preset Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:block">{translations[lang].scenario}</span>
              <div className="bg-[#FAF9F6] p-1 rounded-xl flex gap-1 border border-amber-900/10">
                <button 
                  onClick={() => applyPreset('amigos')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium tracking-wide transition-all ${selectedPreset === 'amigos' ? 'bg-[#C5A852] text-white shadow-md font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {translations[lang].presetAmigos}
                </button>
                <button 
                  onClick={() => applyPreset('boda')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium tracking-wide transition-all ${selectedPreset === 'boda' ? 'bg-[#C5A852] text-white shadow-md font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {translations[lang].presetBoda}
                </button>
                <button 
                  onClick={() => applyPreset('oficina')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium tracking-wide transition-all ${selectedPreset === 'oficina' ? 'bg-[#C5A852] text-white shadow-md font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {translations[lang].presetOficina}
                </button>
                <button 
                  onClick={() => applyPreset('consorcio')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium tracking-wide transition-all ${selectedPreset === 'consorcio' ? 'bg-[#C5A852] text-white shadow-md font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {translations[lang].presetConsorcio}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Warning Alert for Drama */}
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-transparent border-l-4 border-[#C5A852] p-4 rounded-r-xl shadow-xs border border-amber-900/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#B29235] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold font-serif text-[#B29235]">{translations[lang].alertTitle}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {translations[lang].alertText}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Input Console (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Input Card Container */}
            <div className="bg-white rounded-2xl border border-amber-900/10 p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A852] via-amber-400 to-[#C5A852]" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="font-serif text-lg font-semibold text-slate-800">{translations[lang].notebookTitle}</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">{translations[lang].notebookTotal.replace('{count}', totalGuests.toString())}</span>
              </div>

              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                {translations[lang].notebookHelp}
              </p>

              {/* Text Area styling like an elegant piece of paper */}
              <div className="relative">
                <textarea
                  id="guest-textarea"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={translations[lang].notebookPlaceholder}
                  className="w-full h-84 p-4 text-xs font-mono text-slate-700 bg-[#FCFAF8] border border-amber-900/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C5A852]/50 focus:border-[#C5A852] resize-none leading-relaxed transition shadow-inner placeholder-slate-400"
                />
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <button 
                    onClick={() => {
                      setInputText('');
                      document.getElementById('guest-textarea')?.focus();
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
                    title="Limpiar lista"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Parameters Slider & Stepper */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="text-sm font-medium font-serif text-slate-700 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#B29235]" />
                      {translations[lang].maxCapacity}
                    </label>
                    <p className="text-[11px] text-slate-400">{translations[lang].maxCapacityHelp}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <button 
                      onClick={() => handleCapacityChange(capacity - 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#B29235] hover:bg-slate-100 transition text-lg font-bold"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-serif text-base font-bold text-[#B29235]">{capacity}</span>
                    <button 
                      onClick={() => handleCapacityChange(capacity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#B29235] hover:bg-slate-100 transition text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <input 
                  type="range" 
                  min="2" 
                  max="10" 
                  value={capacity} 
                  onChange={(e) => handleCapacityChange(parseInt(e.target.value))}
                  className="w-full accent-[#C5A852] bg-slate-100 h-1.5 rounded-lg cursor-pointer" 
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>{translations[lang].tableIntimate}</span>
                  <span>{translations[lang].tableImperial}</span>
                </div>
              </div>

              {/* Action Solve Button */}
              <button
                onClick={() => triggerSolve()}
                disabled={isSolving || !inputText.trim()}
                className="w-full mt-6 bg-[#B29235] hover:bg-[#A3812C] text-white font-bold uppercase tracking-widest py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer text-xs"
              >
                <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition duration-300" />
                <span className="font-sans tracking-widest font-bold">{translations[lang].solveBtn}</span>
              </button>
            </div>

            {/* Smart Statistics Banner (when solved) */}
            {solvedTables.length > 0 && !isSolving && (
              <div className="bg-white text-slate-700 rounded-2xl p-5 shadow-sm border border-amber-900/10 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-[#C5A852]/5 rounded-full filter blur-2xl -translate-x-1/2 -translate-y-1/2" />
                <h4 className="text-xs uppercase tracking-widest text-[#B29235] font-bold mb-3 border-b border-rose-50 pb-2 font-mono">{translations[lang].statsTitle}</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <span className="block text-xl font-serif text-slate-800 font-bold">{totalGuests}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-tighter font-mono">{translations[lang].statsGuests}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <span className="block text-xl font-serif text-slate-800 font-bold">{solvedTables.length}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-tighter font-mono">{translations[lang].statsTables}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <span className="block text-xl font-serif text-[#B29235] font-bold">{averageHarmony}%</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-tighter font-mono">{translations[lang].statsHarmony}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>{translations[lang].statsConflictLabel}</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> {translations[lang].statsMitigated}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Venue Presentation / Elegant Table Cards (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Case: Solving States Simulation */}
            {isSolving ? (
              <div className="bg-white rounded-3xl border border-amber-900/10 p-8 shadow-md flex flex-col items-center justify-center text-center min-h-[500px]">
                {/* Simulated Luxury Plaque Plate Spinner */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-[#B29235] animate-spin flex items-center justify-center" />
                  <Wine className="w-10 h-10 text-[#B29235] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                </div>

                <h3 className="text-2xl font-serif font-semibold text-slate-800 mb-2">{translations[lang].solvingTitle}</h3>
                <p className="text-xs font-sans text-slate-500 max-w-sm mb-6 leading-relaxed">
                  {translations[lang].solvingSubtitle}
                </p>

                {/* Simulated Logs Stepper */}
                <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl p-4 text-left divide-y divide-slate-100">
                  {solvingSteps.map((step, idx) => {
                    const isPassed = solvingStep > idx;
                    const isActive = solvingStep === idx;
                    return (
                      <div 
                        key={idx} 
                        className={`py-3 flex items-center gap-3 transition-all ${
                          isPassed ? 'text-emerald-700' : isActive ? 'text-slate-850 font-semibold scale-[1.01]' : 'text-slate-400'
                        }`}
                      >
                        {isPassed ? (
                          <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : isActive ? (
                          <div className="h-5 w-5 rounded-full bg-amber-50 flex items-center justify-center text-[#B29235] border border-amber-200 animate-pulse">
                            <Sparkles className="w-3 h-3 animate-spin" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 text-[10px] font-mono">
                            {idx + 1}
                          </div>
                        )}
                        <span className="text-xs font-mono grow leading-tight">{step.text}</span>
                        {isActive && <span className="text-xs text-[#B29235] font-mono font-bold animate-pulse">{step.percent}%</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : hasSolvedOnce && solvedTables.length > 0 ? (
              
              // Case: Tables list visual render
              <div className="space-y-6">
                
                {/* Responsive Dual View Switcher: Proposes Tables View by Default, very elegant design */}
                <div className="bg-white rounded-2xl border border-amber-900/10 p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <h3 className="font-serif text-base font-bold text-slate-800">{translations[lang].resultsTitle}</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{translations[lang].resultsSubtitle}</p>
                  </div>
                  
                  {/* Modern Dual-options Selector */}
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/50 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={() => setActiveResultTab('tables')}
                      className={`flex-1 md:flex-initial text-center py-2 px-4 rounded-lg text-xs font-bold transition-all duration-250 cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeResultTab === 'tables'
                          ? 'bg-[#B29235] text-white shadow-md'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                      }`}
                    >
                      📍 {lang === 'es' ? 'Diagrama de Mesas' : 'Seating Diagram'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveResultTab('whatsapp')}
                      className={`flex-1 md:flex-initial text-center py-2 px-4 rounded-lg text-xs font-bold transition-all duration-250 cursor-pointer relative flex items-center justify-center gap-1.5 ${
                        activeResultTab === 'whatsapp'
                          ? 'bg-[#B29235] text-white shadow-md'
                          : 'text-slate-500 hover:text-[#B29235] hover:bg-white/40'
                      }`}
                    >
                      <span>📲 WhatsApp & QR</span>
                      {!isUnlocked && (
                        <span className="bg-amber-500 h-1.5 w-1.5 rounded-full animate-ping absolute top-0.5 right-0.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 📲 ASISTENTE DE COORDINACIÓN DE WHATSAPP (Only shown under WhatsApp & QR tab) */}
                {activeResultTab === 'whatsapp' && (
                  <div className="bg-gradient-to-br from-[#FCFAF8] to-slate-50/50 rounded-3xl border border-amber-900/15 p-6 shadow-md space-y-5 animate-fadeIn">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-rose-50/70">
                    <div>
                      <h4 className="text-sm font-bold font-serif text-[#B29235] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#B29235] animate-pulse" />
                        {translations[lang].waAssistantTitle}
                      </h4>
                      <p className="text-[11.5px] text-slate-500 mt-0.5">
                        {translations[lang].waAssistantSub}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {isUnlocked ? (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono px-2.5 py-1 rounded-full border border-emerald-200 font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          PREMIUM UNLOCKED
                        </span>
                      ) : (
                        <span 
                          onClick={() => setShowPaywallModal(true)}
                          className="bg-amber-50 hover:bg-amber-100 text-[#B29235] text-[10px] sm:text-[11px] font-mono px-3 py-1.5 rounded-full border border-amber-200 font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs cursor-pointer transition active:scale-95"
                        >
                          <Lock className="w-3.5 h-3.5 text-[#B29235] shrink-0 animate-pulse" />
                          <span>PREMIUM LOCK (VISTA PREVIA)</span>
                        </span>
                      )}
                    </div>
                  </div>

                    {/* Tab Selectors */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-100/70 p-1 rounded-xl text-[11px] font-medium font-sans">
                      <button
                        type="button"
                        onClick={() => setActiveWaTab('hosts')}
                        className={`py-2 px-1 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                          activeWaTab === 'hosts'
                            ? 'bg-white text-slate-800 shadow-sm font-semibold border border-slate-200/40'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        👩‍❤️‍👨 {translations[lang].waTabHosts}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveWaTab('organizers')}
                        className={`py-2 px-1 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                          activeWaTab === 'organizers'
                            ? 'bg-white text-slate-800 shadow-sm font-semibold border border-slate-200/40'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        📋 {translations[lang].waTabOrganizers}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveWaTab('guests')}
                        className={`py-2 px-1 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                          activeWaTab === 'guests'
                            ? 'bg-white text-slate-800 shadow-sm font-semibold border border-slate-200/40'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        ✉️ {translations[lang].waTabGuests}
                      </button>
                    </div>

                    {/* Estilo/Tono del Mensaje Selector */}
                    <div className="bg-[#B29235]/5 rounded-xl p-3 border border-amber-200/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] mt-2">
                      <div className="font-sans font-semibold text-slate-700 flex items-center gap-1.5">
                        🎨 <span>Tono del Mensaje:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => setWhatsappTone('elegant')}
                          className={`px-2.5 py-1 rounded-lg font-bold border transition transition-all cursor-pointer ${
                            whatsappTone === 'elegant'
                              ? 'bg-[#B29235] text-white border-[#B29235] shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          ✨ Clásico
                        </button>
                        <button
                          type="button"
                          onClick={() => setWhatsappTone('short')}
                          className={`px-2.5 py-1 rounded-lg font-bold border transition transition-all cursor-pointer ${
                            whatsappTone === 'short'
                              ? 'bg-[#B29235] text-white border-[#B29235] shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          ⚡ Corto
                        </button>
                        <button
                          type="button"
                          onClick={() => setWhatsappTone('informal')}
                          className={`px-2.5 py-1 rounded-lg font-bold border transition transition-all cursor-pointer ${
                            whatsappTone === 'informal'
                              ? 'bg-[#B29235] text-white border-[#B29235] shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          🎉 Divertido
                        </button>
                      </div>
                    </div>

                    {/* Tab Contents */}
                    <div className="pt-1">
                      {activeWaTab === 'hosts' && (
                        <div className="space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                              {translations[lang].waCopyTitle}
                            </span>
                            <button
                              onClick={() => {
                                if (!isUnlocked) {
                                  setShowPaywallModal(true);
                                  return;
                                }
                                const text = buildWhatsAppHostsCopy(solvedTables, lang, shareUrl, whatsappTone);
                                navigator.clipboard.writeText(text);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2500);
                              }}
                              className="bg-[#B29235] hover:bg-[#A3812C] text-white text-xs font-bold py-1.5 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer transition shadow-xs active:scale-[0.98]"
                            >
                              {isUnlocked ? (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>{copied ? translations[lang].copiedLabel : translations[lang].btnCopied}</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3.5 h-3.5 text-white animate-pulse shrink-0" />
                                  <span>{translations[lang].btnCopyUnlock}</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Free Sample - Table 1 Draft Preview (Unblurred, Legible & Copyable as requested) */}
                          {!isUnlocked && solvedTables.length > 0 && (
                            <div className="bg-amber-50/25 border border-dashed border-[#C5A852]/30 rounded-2xl p-4.5 space-y-2 mb-2">
                              <div className="flex items-center gap-1.5 text-[10px] text-[#B29235] font-bold uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-[#B29235] animate-pulse shrink-0" />
                                <span>{lang === 'es' ? '✨ Muestra Gratis de Mensaje Real ' : '✨ Free Copy Sample '}({lang === 'es' ? 'Mesa 1 de ' : 'Table 1 of '}{solvedTables.length}):</span>
                              </div>
                              <div className="bg-white border border-rose-50/70 rounded-xl p-3.5 text-[10px] font-mono leading-relaxed whitespace-pre-wrap select-text max-h-36 overflow-y-auto shadow-xs text-slate-600">
                                {buildWhatsAppHostsCopy([solvedTables[0]], lang, shareUrl, whatsappTone)}
                              </div>
                              <span className="text-[9.5px] text-slate-400 block text-right font-medium italic">
                                * {lang === 'es' ? 'Solo se muestra la Mesa 1 en esta prueba. Desbloquea para ver el borrador completo.' : 'Only Table 1 shown in free sample. Upgrade to view and copy the full draft.'}
                              </span>
                            </div>
                          )}

                          <div className="relative group overflow-hidden rounded-2xl">
                            <div 
                              onCopy={(e) => {
                                if (!isUnlocked) {
                                  e.preventDefault();
                                  setShowPaywallModal(true);
                                }
                              }}
                              className={`bg-white rounded-2xl border border-amber-900/5 p-4 text-[11px] font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto text-slate-700 shadow-inner transition duration-300 ${
                                !isUnlocked ? 'select-none blur-[4px] pointer-events-none selection:bg-transparent opacity-60' : ''
                              }`}
                            >
                              {buildWhatsAppHostsCopy(solvedTables, lang, shareUrl, whatsappTone)}
                            </div>
                            {!isUnlocked && (
                              <div 
                                onClick={() => setShowPaywallModal(true)}
                                className="absolute inset-0 bg-slate-900/[0.01] backdrop-blur-[1px] hover:bg-slate-900/[0.04] transition flex flex-col items-center justify-center p-4 text-center cursor-pointer select-none"
                              >
                                <div className="bg-white/95 border border-[#C5A852]/40 rounded-xl p-3 shadow-md max-w-xs space-y-1.5 transform group-hover:scale-105 transition duration-200">
                                  <div className="mx-auto w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-[#B29235]">
                                    <Lock className="w-4 h-4 animate-bounce" />
                                  </div>
                                  <p className="text-[11px] font-bold text-slate-800">
                                    {lang === 'es' ? 'Contenido Protegido' : 'Protected Content'}
                                  </p>
                                  <p className="text-[9px] text-slate-500 leading-normal">
                                    {lang === 'es' ? 'Desbloquea premium para copiar o ver el borrador completo listo para WhatsApp.' : 'Unlock premium to copy or view the complete draft ready for WhatsApp.'}
                                  </p>
                                  <div className="pt-0.5">
                                    <span className="text-[9px] bg-[#B29235] text-white px-2.5 py-1 rounded-lg font-bold inline-block shadow-xs">
                                      {lang === 'es' ? '🔓 Desbloquear Borrador' : '🔓 Unlock Draft'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          {shareUrl && isUnlocked && (
                            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#B29235]/5 p-4 rounded-2xl border border-[#B29235]/15 mt-2 text-center sm:text-left">
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`} 
                                alt="QR Code" 
                                className="w-20 h-20 bg-white p-1 rounded-xl shadow-xs border border-[#C5A852]/30"
                                referrerPolicy="no-referrer"
                              />
                              <div className="space-y-1 grow min-w-0">
                                <span className="text-[10px] font-bold text-[#B29235] uppercase tracking-wider font-mono block">📱 Código QR del Evento Activo</span>
                                <p className="text-[11px] text-slate-600 leading-relaxed">
                                  Tus invitados pueden escanear este QR para ver su mesa de forma interactiva. El código se ha adjuntado a los mensajes de WhatsApp superiores.
                                </p>
                                <div className="pt-1 flex justify-start">
                                  <a 
                                    href={shareUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-[10px] bg-white hover:bg-slate-50 text-[#B29235] border border-amber-200/80 px-2.5 py-1 rounded-lg font-sans font-bold flex items-center gap-1 shadow-xs transition"
                                  >
                                    🔗 Probar Buscador de Mesas Online
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}

                          {shareUrl && !isUnlocked && (
                            <div 
                              onClick={() => setShowPaywallModal(true)}
                              className="flex flex-col sm:flex-row items-center gap-4 bg-[#B29235]/5 hover:bg-[#B29235]/10 p-4 rounded-2xl border-2 border-dashed border-[#B29235]/30 mt-2 text-center sm:text-left cursor-pointer transition active:scale-[0.99] relative overflow-hidden group shadow-xs"
                            >
                              <div className="absolute top-1 right-2 bg-[#B29235] text-white text-[8px] font-mono px-1.5 py-0.5 rounded uppercase tracking-widest font-bold">PREMIUM</div>
                              <div className="w-20 h-20 bg-slate-100 rounded-xl flex flex-col items-center justify-center border border-slate-200 shrink-0 relative p-1 shadow-inner">
                                <div className="absolute inset-0 bg-slate-900/[0.04] backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                                  <Lock className="w-6 h-6 text-[#B29235] group-hover:scale-110 transition duration-150" />
                                </div>
                                <div className="w-full h-full opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]" />
                              </div>
                              <div className="space-y-1 grow min-w-0">
                                <span className="text-[10px] font-bold text-[#B29235] uppercase tracking-wider font-mono block">🔒 Código QR y Buscador Interactivo Bloqueados</span>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                  Escanear el QR abrirá un moderno plano de mesa interactivo para que tus invitados se encuentren al instante. Desbloquea para activar este pase digital premium.
                                </p>
                                <div className="pt-1 flex justify-center sm:justify-start">
                                  <button 
                                    className="text-[10px] bg-[#B29235] text-white px-3 py-1.5 rounded-lg font-sans font-bold flex items-center gap-1 shadow-xs"
                                  >
                                    🔓 Desbloquear Enlace QR • $1.99
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeWaTab === 'organizers' && (
                        <div className="space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                              {translations[lang].waCopyTitle}
                            </span>
                            <button
                              onClick={() => {
                                if (!isUnlocked) {
                                  setShowPaywallModal(true);
                                  return;
                                }
                                const text = buildWhatsAppOrgsCopy(solvedTables, lang, shareUrl, whatsappTone);
                                navigator.clipboard.writeText(text);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2500);
                              }}
                              className="bg-[#B29235] hover:bg-[#A3812C] text-white text-xs font-bold py-1.5 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer transition shadow-xs active:scale-[0.98]"
                            >
                              {isUnlocked ? (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>{copied ? translations[lang].copiedLabel : translations[lang].btnCopied}</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3.5 h-3.5 text-white animate-pulse shrink-0" />
                                  <span>{translations[lang].btnCopyUnlock}</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Free Sample - Table 1 Catering Draft Preview (Unblurred, Legible & Copyable as requested) */}
                          {!isUnlocked && solvedTables.length > 0 && (
                            <div className="bg-amber-50/25 border border-dashed border-[#C5A852]/30 rounded-2xl p-4.5 space-y-2 mb-2">
                              <div className="flex items-center gap-1.5 text-[10px] text-[#B29235] font-bold uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-[#B29235] animate-pulse shrink-0" />
                                <span>{lang === 'es' ? '✨ Muestra Gratis de Reporte de Mesa ' : '✨ Free Copy Sample '}({lang === 'es' ? 'Mesa 1 de ' : 'Table 1 of '}{solvedTables.length}):</span>
                              </div>
                              <div className="bg-white border border-rose-50/70 rounded-xl p-3.5 text-[10px] font-mono leading-relaxed whitespace-pre-wrap select-text max-h-36 overflow-y-auto shadow-xs text-slate-600">
                                {buildWhatsAppOrgsCopy([solvedTables[0]], lang, shareUrl, whatsappTone)}
                              </div>
                              <span className="text-[9.5px] text-slate-400 block text-right font-medium italic">
                                * {lang === 'es' ? 'Solo se muestra el Reporte de Mesa 1 como prueba. Desbloquea para ver el reporte de organización completo.' : 'Only Table 1 Report shown in free sample. Upgrade to view and copy the full organizer report.'}
                              </span>
                            </div>
                          )}

                          <div className="relative group overflow-hidden rounded-2xl">
                            <div 
                              onCopy={(e) => {
                                if (!isUnlocked) {
                                  e.preventDefault();
                                  setShowPaywallModal(true);
                                }
                              }}
                              className={`bg-white rounded-2xl border border-amber-900/5 p-4 text-[11px] font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto text-slate-700 shadow-inner transition duration-300 ${
                                !isUnlocked ? 'select-none blur-[4px] pointer-events-none selection:bg-transparent opacity-60' : ''
                              }`}
                            >
                              {buildWhatsAppOrgsCopy(solvedTables, lang, shareUrl, whatsappTone)}
                            </div>
                            {!isUnlocked && (
                              <div 
                                onClick={() => setShowPaywallModal(true)}
                                className="absolute inset-0 bg-slate-900/[0.01] backdrop-blur-[1px] hover:bg-slate-900/[0.04] transition flex flex-col items-center justify-center p-4 text-center cursor-pointer select-none"
                              >
                                <div className="bg-white/95 border border-[#C5A852]/40 rounded-xl p-3 shadow-md max-w-xs space-y-1.5 transform group-hover:scale-105 transition duration-200">
                                  <div className="mx-auto w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-[#B29235]">
                                    <Lock className="w-4 h-4 animate-bounce" />
                                  </div>
                                  <p className="text-[11px] font-bold text-slate-800">
                                    {lang === 'es' ? 'Contenido Protegido' : 'Protected Content'}
                                  </p>
                                  <p className="text-[9px] text-slate-500 leading-normal">
                                    {lang === 'es' ? 'Desbloquea premium para copiar o ver el plano de coordinación listo para WhatsApp.' : 'Unlock premium to copy or view the technical coordinator draft ready for WhatsApp.'}
                                  </p>
                                  <div className="pt-0.5">
                                    <span className="text-[9px] bg-[#B29235] text-white px-2.5 py-1 rounded-lg font-bold inline-block shadow-xs">
                                      {lang === 'es' ? '🔓 Desbloquear Borrador' : '🔓 Unlock Draft'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          {shareUrl && isUnlocked && (
                            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#B29235]/5 p-4 rounded-2xl border border-[#B29235]/15 mt-2 text-center sm:text-left">
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`} 
                                alt="QR Code" 
                                className="w-20 h-20 bg-white p-1 rounded-xl shadow-xs border border-[#C5A852]/30"
                                referrerPolicy="no-referrer"
                              />
                              <div className="space-y-1 grow min-w-0">
                                <span className="text-[10px] font-bold text-[#B29235] uppercase tracking-wider font-mono block">📋 Mapa Técnico de Coordinación</span>
                                <p className="text-[11px] text-slate-600 leading-relaxed">
                                  Código QR listo para imprimir en la cocina o barra. Los meseros y el planner podrán vigilar alergias, dietas especiales y ubicaciones en tiempo real.
                                </p>
                                <div className="pt-1 flex justify-start">
                                  <a 
                                    href={shareUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-[10px] bg-white hover:bg-slate-50 text-[#B29235] border border-amber-200/80 px-2.5 py-1 rounded-lg font-sans font-bold flex items-center gap-1 shadow-xs transition"
                                  >
                                    🔗 Abrir Mapa de Catering Online
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}

                          {shareUrl && !isUnlocked && (
                            <div 
                              onClick={() => setShowPaywallModal(true)}
                              className="flex flex-col sm:flex-row items-center gap-4 bg-[#B29235]/5 hover:bg-[#B29235]/10 p-4 rounded-2xl border-2 border-dashed border-[#B29235]/30 mt-2 text-center sm:text-left cursor-pointer transition active:scale-[0.99] relative overflow-hidden group shadow-xs"
                            >
                              <div className="absolute top-1 right-2 bg-[#B29235] text-white text-[8px] font-mono px-1.5 py-0.5 rounded uppercase tracking-widest font-bold">PREMIUM</div>
                              <div className="w-20 h-20 bg-slate-100 rounded-xl flex flex-col items-center justify-center border border-slate-200 shrink-0 relative p-1 shadow-inner">
                                <div className="absolute inset-0 bg-slate-900/[0.04] backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                                  <Lock className="w-6 h-6 text-[#B29235] group-hover:scale-110 transition duration-150" />
                                </div>
                                <div className="w-full h-full opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]" />
                              </div>
                              <div className="space-y-1 grow min-w-0">
                                <span className="text-[10px] font-bold text-[#B29235] uppercase tracking-wider font-mono block">🔒 Mapa Técnico de Coordinación Bloqueado</span>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                  Genera un QR dinámico para colgar en barra o cocina, ayudando a meseros y planners a coordinar alergias y dietas especiales. Desbloquea para activar.
                                </p>
                                <div className="pt-1 flex justify-center sm:justify-start">
                                  <button 
                                    className="text-[10px] bg-[#B29235] text-white px-3 py-1.5 rounded-lg font-sans font-bold flex items-center gap-1 shadow-xs"
                                  >
                                    🔓 Desbloquear Mapa de Catering • $1.99
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeWaTab === 'guests' && (
                        <div className="space-y-4">
                          {/* Filter search bar */}
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <Search className="h-3.5 w-3.5 text-slate-450" />
                            </div>
                            <input
                              type="text"
                              value={waSearchQuery}
                              onChange={(e) => setWaSearchQuery(e.target.value)}
                              placeholder={translations[lang].searchGuestsPlaceholder}
                              className="block w-full pl-9 pr-3 py-2 bg-white text-xs text-slate-700 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C5A852] focus:border-[#C5A852] font-sans"
                            />
                          </div>

                          {/* Guest list of single messages */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                            {solvedTables.flatMap(t => 
                              t.guests.map(g => {
                                const companions = t.guests.filter(other => other.id !== g.id).map(other => other.name);
                                return {
                                  guest: g,
                                  table: t,
                                  companions
                                };
                              })
                            )
                            .filter(item => item.guest.name.toLowerCase().includes(waSearchQuery.toLowerCase()))
                            .map(({ guest, table, companions }, index) => {
                              const personalText = buildWhatsAppIndividualCopy(guest.name, table.name, companions, lang, shareUrl, whatsappTone);
                              const isCurrentlyCopied = copiedGuestId === guest.id;
                              const personalUrl = `${shareUrl}&search=${encodeURIComponent(guest.name)}`;
                              const personalQr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(personalUrl)}`;
                              const isItemUnlocked = isUnlocked || index === 0;
                              
                              return (
                                <div 
                                  key={guest.id}
                                  className="bg-white border border-slate-100 rounded-2xl p-3 shadow-xs hover:border-amber-200/50 transition flex flex-col justify-between space-y-2.5 hover:shadow-sm"
                                >
                                  <div className="flex items-start justify-between gap-1.5">
                                    <div className="min-w-0">
                                      <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 truncate">
                                        <Users className="w-3 h-3 text-slate-400 shrink-0" />
                                        <span className="truncate">{guest.name}</span>
                                        {!isUnlocked && index === 0 && (
                                          <span className="bg-emerald-500 text-white text-[8px] rounded px-1.5 py-0.5 tracking-wider font-extrabold animate-pulse shrink-0">
                                            {lang === 'es' ? 'MUESTRA' : 'SAMPLE'}
                                          </span>
                                        )}
                                      </h5>
                                      <div className="flex flex-wrap gap-1 mt-1.5">
                                        <span className="inline-block text-[9px] bg-amber-50 text-[#B29235] px-1.5 py-0.5 rounded font-mono font-bold">
                                          📍 {table.name}
                                        </span>
                                        {guest.diet && !guest.diet.toLowerCase().includes('sin restric') && (
                                          <span className="inline-block text-[9px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded font-mono font-bold">
                                            🥦 {guest.diet}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {shareUrl && (
                                        isItemUnlocked ? (
                                          <img 
                                            src={personalQr} 
                                            alt="QR" 
                                            title="Haga clic para ver QR ampliado"
                                            className="w-8 h-8 rounded border border-slate-200 shadow-inner bg-white p-0.5 cursor-pointer hover:scale-110 transition"
                                            referrerPolicy="no-referrer"
                                            onClick={() => {
                                              window.open(personalQr, '_blank');
                                            }}
                                          />
                                        ) : (
                                          <div 
                                            onClick={() => setShowPaywallModal(true)}
                                            title="Desbloquear QR premium"
                                            className="w-8 h-8 rounded border border-amber-200/50 bg-amber-50/50 p-0.5 cursor-pointer hover:bg-amber-100/50 transition flex items-center justify-center relative shadow-xs"
                                          >
                                            <Lock className="w-3.5 h-3.5 text-[#B29235]" />
                                          </div>
                                        )
                                      )}
                                      <button
                                        onClick={() => {
                                          if (!isItemUnlocked) {
                                            setShowPaywallModal(true);
                                            return;
                                          }
                                          navigator.clipboard.writeText(personalText);
                                          setCopiedGuestId(guest.id);
                                          setTimeout(() => setCopiedGuestId(null), 2500);
                                        }}
                                        className={`text-[9px] font-bold py-1.5 px-2.5 rounded-lg flex items-center gap-1 transition ${
                                          isCurrentlyCopied 
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : isItemUnlocked
                                              ? 'bg-slate-50 hover:bg-[#F5F0E1] text-[#B29235] border border-slate-200/50 hover:border-[#C5A852]/30 cursor-pointer shrink-0'
                                              : 'bg-amber-50/60 hover:bg-amber-100/60 text-[#B29235] border border-amber-250/30 cursor-pointer shrink-0'
                                        }`}
                                      >
                                        {isCurrentlyCopied ? (
                                          <>
                                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                            <span>{translations[lang].copiedLabel}</span>
                                          </>
                                        ) : isItemUnlocked ? (
                                          <>
                                            <Copy className="w-3 h-3 text-slate-400 shrink-0" />
                                            <span>{translations[lang].btnCopyReady}</span>
                                          </>
                                        ) : (
                                          <>
                                            <Lock className="w-2.5 h-2.5 text-[#B29235]/80 shrink-0 animate-pulse" />
                                            <span>{translations[lang].btnCopyUnlock}</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <div className="relative overflow-hidden rounded-xl">
                                    <div 
                                      onCopy={(e) => {
                                        if (!isItemUnlocked) {
                                          e.preventDefault();
                                          setShowPaywallModal(true);
                                        }
                                      }}
                                      className={`p-2.5 bg-slate-50 text-[10px] text-slate-550 rounded-xl italic font-sans leading-relaxed border border-slate-100 max-h-24 overflow-y-auto whitespace-pre-wrap transition duration-300 ${
                                        !isItemUnlocked ? 'select-none blur-[3.5px] pointer-events-none selection:bg-transparent opacity-50' : 'select-text'
                                      }`}
                                    >
                                      {personalText}
                                    </div>
                                    {!isItemUnlocked && (
                                      <div 
                                        onClick={() => setShowPaywallModal(true)}
                                        className="absolute inset-0 bg-slate-50/10 hover:bg-slate-900/[0.02] backdrop-blur-[0.5px] transition flex items-center justify-center cursor-pointer select-none"
                                      >
                                        <div className="bg-white/95 border border-amber-200/50 px-2 py-1 rounded-sm shadow-xs flex items-center gap-1">
                                          <Lock className="w-2.5 h-2.5 text-[#B29235]" />
                                          <span className="text-[8px] font-bold text-slate-600 font-sans">
                                            {lang === 'es' ? 'Desbloquear borrador' : 'Unlock draft'}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}

                            {/* Empty view for search */}
                            {solvedTables.flatMap(t => t.guests).filter(g => g.name.toLowerCase().includes(waSearchQuery.toLowerCase())).length === 0 && (
                              <div className="col-span-full py-8 text-center text-xs text-slate-400 font-sans italic">
                                {lang === 'es' ? 'Ninguno de los invitados coincide con la búsqueda.' : 
                                 lang === 'en' ? 'No guests found matching your search.' :
                                 lang === 'fr' ? 'Aucun invité ne correspond à la recherche.' :
                                 'Nessun ospite corrisponde alla ricerca.'}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Elegant Seating Grid (Only shown under Diagrama de Mesas tab) */}
                {activeResultTab === 'tables' && (
                  <div className="space-y-6">
                    {/* Guided flow thread / Call to Action to get texts/QRs */}
                    <div 
                      onClick={() => setActiveResultTab('whatsapp')}
                      className="bg-gradient-to-r from-amber-50 to-amber-100/25 border border-[#C5A852]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:border-[#B29235]/60 hover:shadow-md transition duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#B29235]/10 flex items-center justify-center text-[#B29235] shrink-0 group-hover:scale-110 transition duration-300">
                          <Sparkles className="w-5 h-5 text-[#B29235] animate-pulse" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 leading-none">
                            {lang === 'es' ? '🚀 ¡MESAS ORGANIZADAS CON ÉXITO!' : '🚀 TABLES SUCCESSFULLY ORGANIZED!'}
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-tight">
                            {lang === 'es' 
                              ? 'Presiona aquí para obtener los textos listos para enviar e invitaciones individuales con código QR para WhatsApp.' 
                              : 'Click here to get the ready-to-send copy and individual digital invitations with QR codes for WhatsApp.'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] bg-[#B29235] hover:bg-[#A3812C] text-white px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1 uppercase tracking-wider shadow-xs leading-none select-none shrink-0">
                        {lang === 'es' ? 'Ver Textos' : 'View Texts'} ➡️
                      </span>
                    </div>

                    {/* Elegant Seating Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                  {solvedTables.map((table, index) => {
                    const harmonyColor = table.harmonyScore >= 80 
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                      : table.harmonyScore >= 50 
                      ? 'text-[#B29235] bg-amber-50 border-amber-250/20' 
                      : 'text-rose-700 bg-rose-50 border-rose-200';

                    return (
                      <div 
                        key={table.id}
                        className="bg-white rounded-3xl border border-amber-900/10 shadow-md relative overflow-hidden flex flex-col"
                      >
                        {/* Cozy visual header card */}
                        <div className="p-5 border-b border-rose-50/50 flex items-center justify-between bg-amber-50/10">
                          <div>
                            <span className="text-[10px] text-[#B29235] uppercase tracking-widest font-mono font-bold">{translations[lang].tableHeader.replace('{index}', (index + 1).toString())}</span>
                            <h4 className="font-serif text-base font-semibold text-slate-800">{table.name}</h4>
                          </div>

                          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${harmonyColor}`}>
                            <Heart className="w-3 h-3 fill-current" />
                            <span>{table.harmonyScore}% {translations[lang].statsHarmony}</span>
                          </div>
                        </div>

                        {/* Beautiful simulated circular plate center indicator of the physical table */}
                        <div className="py-6 px-10 flex justify-center bg-gradient-to-b from-amber-50/15 via-[#FCFAF6] to-white border-b border-rose-50/50 relative">
                          <div className="w-32 h-32 rounded-full bg-white border-4 border-[#C5A852]/50 shadow-md flex flex-col items-center justify-center text-center relative z-10">
                            <span className="text-[9px] font-mono text-slate-450 uppercase tracking-widest font-semibold">{translations[lang].capacityLabel}</span>
                            <span className="text-xl font-bold font-serif text-[#B29235]">{table.guests.length} / {capacity}</span>
                            <span className="text-[9px] text-slate-400 lowercase">{table.guests.length === capacity ? translations[lang].tableFull : translations[lang].tableSpace}</span>
                          </div>
                          
                          {/* Radial lines representing the relative chairs surroundings */}
                          {table.guests.map((g, gIdx) => {
                            const angle = (gIdx * 360) / table.guests.length;
                            return (
                              <div 
                                key={g.id}
                                style={{ transform: `rotate(${angle}deg) translateY(-80px)` }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                              >
                                <div className="h-6 w-6 rounded-full bg-white text-[10px] text-[#B29235] border border-amber-250/30 flex items-center justify-center font-bold font-mono shadow-sm" style={{ transform: `rotate(-${angle}deg)` }}>
                                  {g.name.substring(0,2).toUpperCase()}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* List of Seated guests details */}
                        <div className="p-5 space-y-3.5 grow">
                          {table.guests.map((guest) => (
                            <div key={guest.id} className="text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-rose-50/50 pb-2.5 last:border-0 last:pb-0">
                              <div className="flex items-center gap-2">
                                <div className="text-[#B29235] font-medium text-sm">🍽️</div>
                                <div>
                                  <span className="font-semibold text-slate-800">{guest.name}</span>
                                  {guest.attributes.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                      {guest.attributes.map((attr, aIdx) => (
                                        <span key={aIdx} className="text-[9px] bg-[#FCFAF7] text-slate-500 px-1 rounded-sm border border-amber-900/5 font-mono">
                                          {attr}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Diet Badge */}
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium shrink-0 self-start sm:self-center font-mono ${
                                guest.diet?.includes('Vegano') || guest.diet?.includes('Vegetar') || guest.diet?.toLowerCase().includes('vegan') || guest.diet?.toLowerCase().includes('veg')
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                                  : guest.diet?.includes('Sin restricciones') || guest.diet?.toLowerCase().includes('no rest') || guest.diet?.toLowerCase().includes('none') || guest.diet?.toLowerCase().includes('sans') || guest.diet?.toLowerCase().includes('senza')
                                  ? 'bg-slate-50 text-slate-400 border border-slate-200'
                                  : 'bg-amber-50 text-[#B29235] border border-amber-250/20'
                              }`}>
                                {guest.diet}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Footer details (Affinities created / Separated) */}
                        <div className="px-5 py-3.5 bg-slate-50/50 border-t border-rose-50/50 text-[11px] text-slate-500 space-y-1">
                          {table.achievedAffinities.length > 0 && (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                              <Heart className="w-3 h-3 fill-emerald-500/10 text-emerald-500 shrink-0" />
                              <span>{translations[lang].achievedAffinities}: {table.achievedAffinities.join(', ')}</span>
                            </div>
                          )}
                          {table.resolvedConflicts.length > 0 ? (
                            <div className="flex items-center gap-1.5 text-[#B29235] font-mono">
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              <span>{translations[lang].resolvedConflicts}: {table.resolvedConflicts.join(', ')}</span>
                            </div>
                          ) : (
                            <div className="text-slate-400 text-[10px]">{translations[lang].noEgoClashes}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Secure checkout promo banner bottom */}
                {!isUnlocked && (
                  <div className="bg-gradient-to-br from-amber-50 via-white to-white border border-[#C5A852]/20 rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-[#B29235] shrink-0 border border-amber-250/20">
                        <MessageSquare className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <div>
                        <h4 className="font-serif font-semibold text-slate-800 text-base">{translations[lang].promoCtaTitle}</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans">
                          {translations[lang].promoCtaText}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowPaywallModal(true)}
                      className="bg-[#B29235] hover:bg-[#A3812C] text-white font-extrabold whitespace-nowrap text-xs py-3 px-6 rounded-xl transition active:scale-[0.98] flex items-center gap-2 shrink-0 shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <LockKeyhole className="w-3.5 h-3.5" />
                      {translations[lang].promoCtaBtn}
                    </button>
                  </div>
                )}
                  </div>
                )}
              </div>

            ) : (
              // Empty initial state
              <div className="bg-white rounded-3xl border border-amber-900/10 p-8 shadow-md flex flex-col items-center justify-center text-center min-h-[500px]">
                <div className="h-16 w-16 bg-[#FCFAF8] rounded-2xl flex items-center justify-center text-slate-450 mb-4 border border-amber-950/5">
                  <UtensilsCrossed className="w-8 h-8 stroke-[1.2]" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-slate-800 mb-1">{translations[lang].emptyTitle}</h3>
                <p className="text-slate-500 text-xs max-w-sm mb-6 leading-relaxed">
                  {translations[lang].emptyText}
                </p>

                <button
                  onClick={() => triggerSolve()}
                  className="bg-amber-50 hover:bg-amber-100/50 border border-amber-250/30 text-[#B29235] font-semibold py-2.5 px-6 rounded-xl text-xs tracking-wider transition active:scale-[0.98] cursor-pointer"
                >
                  {translations[lang].emptyExampleBtn}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Feature Highlights Grid / Anti Ai Slop Humility */}
        <div className="mt-16 pt-12 border-t border-[#C5A852]/20 grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-500">
          <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-xs">
            <h5 className="font-serif font-semibold text-[#B29235] text-sm mb-1.5">{translations[lang].feat1Title}</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {translations[lang].feat1Text}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-xs">
            <h5 className="font-serif font-semibold text-[#B29235] text-sm mb-1.5">{translations[lang].feat2Title}</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {translations[lang].feat2Text}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-xs">
            <h5 className="font-serif font-semibold text-[#B29235] text-sm mb-1.5">{translations[lang].feat3Title}</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {translations[lang].feat3Text}
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#C5A852]/10 bg-slate-50/50 mt-20 py-8 px-4 text-center">
        <p className="text-xs text-slate-400 font-mono">
          {translations[lang].footerSecured}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          {translations[lang].footerSandbox}
        </p>
      </footer>

      {/* HIGH FIDELITY PREMIUM PAYWALL MODAL */}
      {showPaywallModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          
          {/* Card Modal */}
          <div className="bg-white rounded-3xl shadow-2xl border border-amber-900/20 max-w-md w-full overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header with gradient */}
            <div className="bg-[#FCFAF7] text-slate-800 p-6 relative border-b border-rose-50/50">
              <button 
                onClick={() => {
                  setShowPaywallModal(false);
                  setPaymentProcessing(false);
                  setPaymentSuccess(false);
                  setCheckoutError('');
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-[#B29235] mb-2">
                <Sparkles className="w-4 h-4 animate-spin text-[#B29235]" />
                <span className="text-xs font-mono font-bold tracking-widest uppercase">ACOMODAAI PREMIUM</span>
              </div>

              <h2 className="text-2xl font-serif italic text-[#B29235] tracking-tight">{translations[lang].modalHeader}</h2>
              <p className="text-xs text-slate-500 mt-1">
                {translations[lang].modalSub}
              </p>
            </div>

            {/* Price tag */}
            <div className="bg-slate-50/50 px-6 py-4 border-b border-rose-50/50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">{translations[lang].modalPriceLabel}</span>
              <div className="flex items-center gap-1.5 font-serif">
                <span className="text-xs text-slate-350 line-through font-mono">$9.99</span>
                <span className="text-xl font-bold text-[#B29235]">$1.99 USD</span>
              </div>
            </div>

            {/* Check benefits list */}
            <div className="p-6 pb-2">
              <h4 className="text-xs uppercase tracking-widest text-[#B29235] font-bold mb-2.5 font-mono">{translations[lang].modalBenefitTitle}</h4>
              <ul className="space-y-3.5 text-xs text-slate-655 mb-4">
                <li className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold shrink-0 border border-emerald-200">✓</span>
                  <span dangerouslySetInnerHTML={{ __html: translations[lang].modalBenefit1 }} />
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold shrink-0 border border-emerald-200">✓</span>
                  <span dangerouslySetInnerHTML={{ __html: translations[lang].modalBenefit2 }} />
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold shrink-0 border border-emerald-200">✓</span>
                  <span dangerouslySetInnerHTML={{ __html: translations[lang].modalBenefit3 }} />
                </li>
              </ul>
            </div>

            {/* Forms section */}
            <div className="p-6 pt-0 border-t border-rose-50/50">
              {paymentSuccess ? (
                
                // Case success
                <div className="py-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-300 bg-emerald-50 rounded-2xl border border-emerald-200 p-6 mt-4">
                  <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200 mb-4 animate-bounce">
                    <PartyPopper className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-slate-800">{translations[lang].modalSuccessTitle}</h3>
                  <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                    {translations[lang].modalSuccessText}
                  </p>
                </div>

              ) : paymentProcessing ? (

                // Case processing
                <div className="py-8 flex flex-col items-center justify-center text-center mt-4">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-[#B29235] animate-spin mb-4" />
                  <h3 className="text-sm font-semibold text-slate-800">{translations[lang].modalProcessingTitle}</h3>
                  <p className="text-[11px] text-slate-450 mt-1">{translations[lang].modalProcessingText}</p>
                </div>

              ) : (

                // General Form
                <form onSubmit={handleProcessPayment} className="space-y-4 pt-4">
                  
                  {checkoutError && (
                    <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200 flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{checkoutError}</span>
                    </div>
                  )}

                  {/* Sandbox Notification Banner */}
                  <div className="bg-amber-50/60 border border-amber-250/20 rounded-xl p-3 text-[11px] text-[#B29235] leading-relaxed font-sans font-semibold">
                    🔑 <strong>{translations[lang].modalSandboxLabel}</strong> {translations[lang].modalSandboxText}
                  </div>

                  {/* Fast Sandboxed Emulation Bypass Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setCardName("Alexis Acuña");
                      setCardNumber("4000 1234 5678 9010");
                      setCardExpiry("12/28");
                      setCardCVC("123");
                      setCheckoutError('');
                      setPaymentProcessing(true);
                      
                      setTimeout(() => {
                        setPaymentProcessing(false);
                        setPaymentSuccess(true);
                        setIsUnlocked(true);
                        
                        // Automatically generate and extract formatting to user's native clipboard
                        let whatsappText = '';
                        if (activeWaTab === 'hosts') {
                          whatsappText = buildWhatsAppHostsCopy(solvedTables, lang, shareUrl, whatsappTone);
                        } else if (activeWaTab === 'organizers') {
                          whatsappText = buildWhatsAppOrgsCopy(solvedTables, lang, shareUrl, whatsappTone);
                        } else {
                          whatsappText = buildWhatsAppHostsCopy(solvedTables, lang, shareUrl, whatsappTone);
                        }
                        navigator.clipboard.writeText(whatsappText).catch(() => {});
                        setCopied(true);
                        setTimeout(() => setCopied(false), 3000);
                        
                        // Fast, satisfying exit callback
                        setTimeout(() => {
                          setShowPaywallModal(false);
                        }, 1800);
                      }, 1200);
                    }}
                    className="w-full bg-[#F5F0E1] hover:bg-[#EBE2CB] text-[#B29235] border border-[#C5A852]/30 font-sans text-xs font-bold py-2.5 px-4 rounded-xl transition active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{translations[lang].modalAutoFillBtn}</span>
                  </button>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1 font-mono">{translations[lang].modalPayholder}</label>
                    <input 
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder={translations[lang].modalPayholderPlaceholder}
                      className="w-full text-xs font-mono p-2.5 bg-[#FCFAF8] border border-amber-900/10 text-slate-705 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C5A852]/50 focus:border-[#C5A852] transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1 font-mono">{translations[lang].modalCardnum}</label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4000 1234 5678 9010"
                        maxLength={19}
                        className="w-full text-xs font-mono p-2.5 bg-[#FCFAF8] border border-amber-900/10 text-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C5A852]/50 focus:border-[#C5A852] transition-all pl-9"
                        required
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1 font-mono">{translations[lang].modalExpiry}</label>
                      <input 
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                        placeholder="12/28"
                        className="w-full text-xs font-mono p-2.5 bg-[#FCFAF8] border border-amber-900/10 text-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C5A852]/50 focus:border-[#C5A852] transition-all text-center"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1 font-mono">{translations[lang].modalCVC}</label>
                      <input 
                        type="password"
                        value={cardCVC}
                        onChange={handleCvcChange}
                        maxLength={4}
                        placeholder="•••"
                        className="w-full text-xs font-mono p-2.5 bg-[#FCFAF8] border border-amber-900/10 text-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C5A852]/50 focus:border-[#C5A852] transition-all text-center"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-rose-50/50 flex items-center justify-between gap-3">
                    <span className="hidden sm:flex text-[10px] text-slate-400 items-center gap-1 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      SSL
                    </span>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPaywallModal(false);
                          setPaymentProcessing(false);
                          setPaymentSuccess(false);
                          setCheckoutError('');
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2.5 px-4 rounded-lg transition active:scale-[0.98] cursor-pointer shrink-0"
                      >
                        {lang === 'es' ? 'Cancelar' : 'Cancel'}
                      </button>
                      
                      <button
                        type="submit"
                        className="bg-[#B29235] hover:bg-[#A3812C] text-white font-extrabold text-xs py-2.5 px-5 rounded-lg transition active:scale-[0.98] cursor-pointer shrink-0"
                      >
                        {translations[lang].modalPayBtn}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
