import React, { useState, useEffect } from 'react';
import { 
  X, 
  Ticket, 
  QrCode, 
  Banknote, 
  Smartphone, 
  CheckCircle2, 
  Share2, 
  Printer, 
  ShieldCheck, 
  History, 
  Settings, 
  TrendingUp, 
  Users, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { tournamentInfo, openingMatch } from '../data/tournamentData';

const TICKET_TIERS = [
  { id: 'gallery', name: 'Gallery Stand (ഗ്യാലറി)', price: 50, desc: 'Open stadium gallery with electric 360° match view', badge: 'Popular' },
  { id: 'chair', name: 'Special Chair (ചെയർ)', price: 100, desc: 'Reserved front-row seated chair with close-up sideline view', badge: 'Seated' },
  { id: 'vip', name: 'VIP Pavilion (വി.ഐ.പി)', price: 250, desc: 'Covered VIP box with complimentary refreshments', badge: 'VIP' }
];

export default function TicketCounterModal({ isOpen, onClose, lang, isDarkMode }) {
  const [activeTab, setActiveTab] = useState('pos'); // 'pos' | 'admin' | 'settings'
  
  // Ticket booking states
  const [ticketTier, setTicketTier] = useState('gallery');
  const [quantity, setQuantity] = useState(1);
  const [paymentMode, setPaymentMode] = useState('gpay'); // 'gpay' | 'cash'
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [issuedTicket, setIssuedTicket] = useState(null);

  // Settings: Committee UPI details (Persisted in localStorage)
  const [upiId, setUpiId] = useState(() => {
    return localStorage.getItem('kasc_committee_upi_id') || 'kascsevens@upi';
  });
  const [payeeName, setPayeeName] = useState(() => {
    return localStorage.getItem('kasc_committee_payee_name') || 'KASC Sevens Football';
  });

  // Sales Ledger (Persisted in localStorage)
  const [salesLedger, setSalesLedger] = useState(() => {
    const saved = localStorage.getItem('kasc_sales_ledger');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Default initial mock transactions for counter display
    return [
      { id: 'KASC-7-GPY-1082', time: '07:15 PM', tier: 'Gallery Stand (ഗ്യാലറി)', qty: 2, amount: 100, mode: 'gpay', buyer: 'Faslu Tirur' },
      { id: 'KASC-7-CSH-1083', time: '07:22 PM', tier: 'Special Chair (ചെയർ)', qty: 4, amount: 400, mode: 'cash', buyer: 'Muneer P.' },
      { id: 'KASC-7-GPY-1084', time: '07:30 PM', tier: 'Gallery Stand (ഗ്യാലറി)', qty: 3, amount: 150, mode: 'gpay', buyer: 'Suhail K.' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('kasc_sales_ledger', JSON.stringify(salesLedger));
  }, [salesLedger]);

  useEffect(() => {
    localStorage.setItem('kasc_committee_upi_id', upiId);
    localStorage.setItem('kasc_committee_payee_name', payeeName);
  }, [upiId, payeeName]);

  if (!isOpen) return null;

  const currentTierObj = TICKET_TIERS.find((t) => t.id === ticketTier) || TICKET_TIERS[0];
  const totalAmount = currentTierObj.price * quantity;

  // Generate UPI URI
  const upiTransactionNote = `Ticket-${currentTierObj.id.toUpperCase()}-${quantity}x`;
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(upiTransactionNote)}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiUrl)}`;

  // Revenue Totals
  const totalTicketsSold = salesLedger.reduce((acc, curr) => acc + curr.qty, 0);
  const totalCashAmount = salesLedger
    .filter((item) => item.mode === 'cash')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalGpayAmount = salesLedger
    .filter((item) => item.mode === 'gpay')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalCombinedRevenue = totalCashAmount + totalGpayAmount;

  const handleIssueTicket = () => {
    const ticketId = `KASC-7-${paymentMode === 'gpay' ? 'GPY' : 'CSH'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTicket = {
      id: ticketId,
      time: timeStr,
      tier: currentTierObj.name,
      tierId: currentTierObj.id,
      qty: quantity,
      pricePerUnit: currentTierObj.price,
      amount: totalAmount,
      mode: paymentMode,
      buyer: buyerName || (paymentMode === 'gpay' ? 'GPay Spectator' : 'Cash Counter Buyer'),
      phone: buyerPhone || '',
      match: `${openingMatch.teamHome.shortName} vs ${openingMatch.teamAway.shortName}`,
      date: '06 Nov 2026 • 8:00 PM',
      venue: 'Peruvallur Panjayath Stadium'
    };

    setIssuedTicket(newTicket);
    setSalesLedger((prev) => [newTicket, ...prev]);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleShareTicketWhatsApp = (ticket) => {
    const text = encodeURIComponent(
      `🎫 *അഖിലേന്ത്യാ സെവൻസ് ടൂർണ്ണമെന്റ് സീസൺ 7 - മാച്ച് ടിക്കറ്റ്* ⚽\n\n` +
      `🎟️ *ടിക്കറ്റ് നമ്പർ:* ${ticket.id}\n` +
      `⚔️ *മത്സരം:* ${ticket.match}\n` +
      `📅 *തീയതി & സമയം:* ${ticket.date}\n` +
      `📍 *വേദി:* ${ticket.venue}\n` +
      `💺 *വിഭാഗം:* ${ticket.tier}\n` +
      `👥 *എണ്ണം:* ${ticket.qty} ടിക്കറ്റ് (₹${ticket.amount})\n` +
      `✅ *പേയ്‌മെന്റ്:* ${ticket.mode.toUpperCase()} വഴിയുള്ള പണം വിജയകരമായി ലഭിച്ചു\n\n` +
      `ഗേറ്റിൽ ഈ ഡിജിറ്റൽ ടിക്കറ്റ് മെസ്സേജ് കാണിച്ച് സ്റ്റേഡിയത്തിലേക്ക് പ്രവേശിക്കാം!`
    );

    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className={`relative w-full max-w-2xl rounded-3xl border overflow-hidden shadow-2xl flex flex-col max-h-[92vh] ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
              <Ticket className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider">
                  {lang === 'ml' ? 'സ്മാർട്ട് ടിക്കറ്റ് കൗണ്ടർ & ജിപേ (POS)' : 'SMART TICKET COUNTER & GPAY POS'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase">
                  Live Counter
                </span>
              </div>
              <p className="text-[11px] text-blue-100 font-medium">
                {lang === 'ml' ? 'കൗണ്ടർ കാഷ് പേയ്‌മെന്റും തത്സമയ GPay QR കോഡ് സ്കാനിംഗും' : 'Instant UPI QR Code generation & cash ledger tracking'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (POS / Admin Summary / Settings) */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('pos'); setIssuedTicket(null); }}
            className={`px-4 py-2 rounded-t-xl transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'pos'
                ? 'bg-white border-blue-600 text-blue-700 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{lang === 'ml' ? 'ടിക്കറ്റ് കൗണ്ടർ (Issue Ticket)' : 'Issue Ticket (POS)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-t-xl transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-white border-blue-600 text-blue-700 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'ml' ? 'കൗണ്ടർ കണക്കുകൾ (Daily Audit)' : 'Revenue Audit'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
              ₹{totalCombinedRevenue}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-t-xl transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-white border-blue-600 text-blue-700 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'ml' ? 'ജിപേ സെറ്റിംഗ്സ്' : 'UPI Setup'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* TAB 1: TICKET COUNTER POS */}
          {activeTab === 'pos' && !issuedTicket && (
            <div className="space-y-5 animate-fadeIn">
              {/* Match Header Badge */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-700 text-white font-bold text-[10px]">
                    DAY 1
                  </span>
                  <span className="font-black text-slate-900 font-sports">
                    UDAYA PERUVALLUR vs SABAN FC KOTTAKKAL
                  </span>
                </div>
                <span className="font-bold text-blue-700">06 Nov • 8:00 PM</span>
              </div>

              {/* 1. Select Ticket Tier */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  {lang === 'ml' ? '1. ടിക്കറ്റ് വിഭാഗം തിരഞ്ഞെടുക്കുക' : '1. Select Seat Category'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {TICKET_TIERS.map((tier) => {
                    const isSelected = ticketTier === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setTicketTier(tier.id)}
                        className={`p-3 rounded-2xl border transition cursor-pointer relative active:scale-98 ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {tier.badge}
                          </span>
                          <span className="text-base font-black font-sports text-blue-700">
                            ₹{tier.price}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                          {tier.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                          {tier.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Select Ticket Quantity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {lang === 'ml' ? '2. ടിക്കറ്റുകളുടെ എണ്ണം' : '2. Number of Tickets'}
                  </label>
                  <span className="text-xs font-bold text-slate-500">
                    ₹{currentTierObj.price} x {quantity} = <strong className="text-blue-700 text-sm">₹{totalAmount}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Preset Quick Quantity Pills */}
                  <div className="grid grid-cols-5 gap-1.5 flex-1">
                    {[1, 2, 3, 5, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setQuantity(num)}
                        className={`py-2 rounded-xl text-xs font-black transition active:scale-95 ${
                          quantity === num
                            ? 'bg-blue-700 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        {num} {num === 1 ? 'Tk' : 'Tks'}
                      </button>
                    ))}
                  </div>

                  {/* Manual Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-slate-700 flex items-center justify-center active:scale-95 transition"
                    >
                      -
                    </button>
                    <span className="w-9 text-center font-black font-sports text-base text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.min(50, prev + 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-slate-700 flex items-center justify-center active:scale-95 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Payment Mode Selection (GPay vs Cash) */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  {lang === 'ml' ? '3. പേയ്‌മെന്റ് രീതി' : '3. Payment Mode'}
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Option A: GPay / UPI QR */}
                  <button
                    type="button"
                    onClick={() => setPaymentMode('gpay')}
                    className={`p-3.5 rounded-2xl border text-left transition active:scale-98 flex items-center gap-3 ${
                      paymentMode === 'gpay'
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                      <QrCode className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs sm:text-sm text-slate-950 font-sports">
                          GPAY / PHONEPE UPI
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[9px] font-bold">
                          QR
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {lang === 'ml' ? 'സ്ക്രീനിൽ ക്യുആർ കോഡ് കാണിച്ച് സ്കാൻ ചെയ്യിക്കാം' : 'Instant dynamic UPI QR scan'}
                      </p>
                    </div>
                  </button>

                  {/* Option B: Cash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMode('cash')}
                    className={`p-3.5 rounded-2xl border text-left transition active:scale-98 flex items-center gap-3 ${
                      paymentMode === 'cash'
                        ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                      <Banknote className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs sm:text-sm text-slate-950 font-sports">
                          CASH PAYMENT
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                          Cash
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {lang === 'ml' ? 'കൗണ്ടറിൽ നേരിട്ട് പണം സ്വീകരിച്ച് ടിക്കറ്റ് നൽകുക' : 'Direct physical cash payment'}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic QR Code Display for GPay */}
              {paymentMode === 'gpay' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-5 animate-fadeIn">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 flex flex-col items-center">
                    <img
                      src={qrCodeImageUrl}
                      alt="UPI QR Code"
                      className="w-44 h-44 sm:w-48 sm:h-48 rounded-xl object-contain"
                    />
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-slate-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Scan with GPay, PhonePe, Paytm</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 flex-1 text-center sm:text-left">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Total Amount Payable
                      </span>
                      <span className="text-3xl sm:text-4xl font-black font-sports text-blue-700">
                        ₹{totalAmount}
                      </span>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {quantity} x {currentTierObj.name}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Committee Payee UPI ID</div>
                      <div className="font-mono font-bold text-slate-900 select-all">{upiId}</div>
                      <div className="text-[10px] text-slate-500">{payeeName}</div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <a
                        href={upiUrl}
                        className="py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Directly in GPay / UPI App</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Cash Collection Box */}
              {paymentMode === 'cash' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-fadeIn">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase block">
                      Collect Cash from Buyer
                    </span>
                    <span className="text-3xl font-black font-sports text-emerald-950">
                      ₹{totalAmount}
                    </span>
                    <p className="text-xs text-emerald-700 font-medium">
                      ({quantity} {quantity === 1 ? 'Ticket' : 'Tickets'} • {currentTierObj.name})
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Banknote className="w-6 h-6" />
                  </div>
                </div>
              )}

              {/* Action Button: Confirm & Issue Ticket */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleIssueTicket}
                  className="w-full py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>
                    {paymentMode === 'gpay'
                      ? `Confirm GPay Payment Received (₹${totalAmount}) • Issue Ticket`
                      : `Confirm Cash Received (₹${totalAmount}) • Issue Ticket`}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS: DIGITAL E-TICKET VIEW */}
          {activeTab === 'pos' && issuedTicket && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-xs sm:text-sm">
                    {lang === 'ml' ? 'ടിക്കറ്റ് വിജയകരമായി ഇഷ്യൂ ചെയ്തു!' : 'Ticket Issued Successfully!'}
                  </span>
                </div>
                <button
                  onClick={() => setIssuedTicket(null)}
                  className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition active:scale-95"
                >
                  Issue Next Ticket
                </button>
              </div>

              {/* The Official Stadium Ticket Slip */}
              <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-5 shadow-sm text-slate-900 relative overflow-hidden">
                {/* Decorative cutouts */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900/10 border border-slate-300"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900/10 border border-slate-300"></div>

                {/* Ticket Top Ribbon */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">
                      ALL INDIA SEVENS TOURNAMENT SEASON 7
                    </span>
                    <h3 className="text-base font-black font-sports text-slate-950">
                      UDAYA FC & KASC PERUVALLUR
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {issuedTicket.id}
                    </span>
                    <span className={`block text-[9px] font-bold mt-0.5 uppercase ${
                      issuedTicket.mode === 'gpay' ? 'text-blue-600' : 'text-emerald-600'
                    }`}>
                      PAID VIA {issuedTicket.mode.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Ticket Middle Info */}
                <div className="py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Match</span>
                    <span className="font-black text-slate-900 font-sports">{issuedTicket.match}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Date & Time</span>
                    <span className="font-bold text-slate-800">{issuedTicket.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Category</span>
                    <span className="font-bold text-blue-700">{issuedTicket.tier}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Quantity & Total</span>
                    <span className="font-black font-sports text-slate-950 text-sm">
                      {issuedTicket.qty} Tks (₹{issuedTicket.amount})
                    </span>
                  </div>
                </div>

                {/* Ticket Bottom Verification QR & Barcode */}
                <div className="pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl p-1 flex items-center justify-center">
                      <QrCode className="w-10 h-10 text-slate-800" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Gate Verification Barcode</span>
                      <span className="font-mono text-xs font-bold text-slate-900">VERIFIED • SFA GATE 1</span>
                    </div>
                  </div>

                  {/* Share on WhatsApp */}
                  <button
                    onClick={() => handleShareTicketWhatsApp(issuedTicket)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Send to Buyer WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIT & SALES LEDGER */}
          {activeTab === 'admin' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                  <span className="text-[10px] font-bold text-blue-700 uppercase">Total Tickets Sold</span>
                  <div className="text-2xl font-black font-sports text-blue-950 mt-1">
                    {totalTicketsSold}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Cash Collected</span>
                  <div className="text-2xl font-black font-sports text-emerald-950 mt-1">
                    ₹{totalCashAmount}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase">GPay / UPI Collected</span>
                  <div className="text-2xl font-black font-sports text-indigo-950 mt-1">
                    ₹{totalGpayAmount}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">Total Revenue</span>
                  <div className="text-2xl font-black font-sports text-amber-950 mt-1">
                    ₹{totalCombinedRevenue}
                  </div>
                </div>
              </div>

              {/* Transactions Ledger Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Counter Sales Ledger ({salesLedger.length} Transactions)
                </h4>
                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="py-2.5 px-3">Ticket ID</th>
                          <th className="py-2.5 px-3">Time</th>
                          <th className="py-2.5 px-3">Qty</th>
                          <th className="py-2.5 px-3">Amount</th>
                          <th className="py-2.5 px-3">Mode</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {salesLedger.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{row.id}</td>
                            <td className="py-2.5 px-3 text-slate-500">{row.time}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-800">{row.qty}</td>
                            <td className="py-2.5 px-3 font-bold text-blue-700">₹{row.amount}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                row.mode === 'gpay'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {row.mode}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => handleShareTicketWhatsApp(row)}
                                className="text-emerald-700 hover:text-emerald-800 font-bold text-[11px] p-1 rounded-md hover:bg-emerald-50 transition"
                                title="Share on WhatsApp"
                              >
                                <Share2 className="w-3.5 h-3.5 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS (COMMITTEE UPI ID) */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-lg mx-auto py-2 animate-fadeIn">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="font-black text-base font-sports text-slate-900 uppercase">
                  Committee GPay / UPI Configuration
                </h3>
                <p className="text-xs text-slate-500">
                  Update the UPI ID where spectators' GPay payments will be directly credited.
                </p>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Committee UPI ID (e.g. phone@okaxis or club@upi):
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    placeholder="kascsevens@upi"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Payee Name (displayed on Google Pay screen):
                  </label>
                  <input
                    type="text"
                    value={payeeName}
                    onChange={(e) => setPayeeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    placeholder="KASC Sevens Football"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  The dynamic QR code generated at the counter will automatically embed this UPI ID and the exact ticket amount, allowing error-free instant 1-scan payments.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
