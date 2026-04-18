import { useState } from 'react';
import {
  Settings, BadgeCheck, QrCode, Bell, Shield, HelpCircle, LogOut,
  ChevronRight, ArrowUpRight, ArrowDownLeft, RefreshCw, Plus,
  TrendingUp, TrendingDown, Eye, EyeOff, X, Check, Phone, Mail,
  Copy, CreditCard, Building2, Wallet, ChevronDown, Search, Star,
  Edit3, Camera, Lock, Fingerprint, Globe, Moon, CheckCircle2,
  AlertCircle, ArrowRight, Gift, Download
} from 'lucide-react';
import type { WalletBalance } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import { toast } from 'sonner';

import { CURRENT_USER, WALLET_BALANCES, TRANSACTIONS, EXCHANGE_RATES, USERS } from '@/constants';




type ProfileTab = 'wallet' | 'exchange' | 'activity';

// ─── Modal States ──────────────────────────────────────────────────────────────
type ModalType = 'send' | 'receive' | 'topup' | 'qr' | 'edit' | 'cardDetail' | null;


export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('wallet');
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [editName, setEditName] = useState(CURRENT_USER.name);
  const [editBio, setEditBio] = useState(CURRENT_USER.bio);

  const totalUSD = WALLET_BALANCES.reduce((sum, b) => sum + b.usdValue, 0);

  return (
    <AppLayout>
      <div className="flex flex-col h-full overflow-y-auto scrollbar-hide bg-gray-50">

        {/* ── Profile Header ─────────────────────────────────── */}
        <div className="bg-white px-4 pt-12 pb-4">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpenModal('qr')}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-brand-100 transition-colors"
              >
                <QrCode size={17} className="text-gray-600" />
              </button>
              <button
                onClick={() => setOpenModal('edit')}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-brand-100 transition-colors"
              >
                <Edit3 size={17} className="text-gray-600" />
              </button>
              <button
                onClick={() => toast.success('Settings coming soon!')}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-brand-100 transition-colors"
              >
                <Settings size={17} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Avatar + Info */}
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={CURRENT_USER.avatar}
                alt={CURRENT_USER.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-brand-100"
              />
              <button
                onClick={() => toast.success('Photo upload coming soon!')}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center border-2 border-white"
              >
                <Camera size={11} className="text-white" />
              </button>
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-500 border-2 border-white rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl font-bold text-gray-900">{editName}</h2>
                {CURRENT_USER.verified && <BadgeCheck size={17} className="text-brand-500 flex-shrink-0" />}
              </div>
              <p className="text-sm text-brand-600 font-medium">{CURRENT_USER.username}</p>
              <p className="text-sm text-gray-500 mt-1 leading-snug">{editBio}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Phone size={11} /> {CURRENT_USER.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: 'Contacts', value: '6', color: 'text-brand-600' },
              { label: 'Transactions', value: '47', color: 'text-blue-600' },
              { label: 'Member Since', value: "Jan '24", color: 'text-gold-600' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-2xl px-3 py-2.5 text-center border border-gray-100">
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 px-4 sticky top-0 z-10">
          <div className="flex">
            {(['wallet', 'exchange', 'activity'] as ProfileTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-semibold capitalize transition-all border-b-2 ${activeTab === tab
                  ? 'text-brand-600 border-brand-600'
                  : 'text-gray-400 border-transparent hover:text-gray-600'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ────────────────────────────────────── */}
        <div className="flex-1 px-4 py-4 space-y-3">
          {activeTab === 'wallet' && (
            <WalletTab
              balanceVisible={balanceVisible}
              toggleBalance={() => setBalanceVisible(v => !v)}
              totalUSD={totalUSD}
              onSend={() => setOpenModal('send')}
              onReceive={() => setOpenModal('receive')}
              onTopUp={() => setOpenModal('topup')}
              onCardDetail={() => setOpenModal('cardDetail')}
            />
          )}
          {activeTab === 'exchange' && <ExchangeTab />}
          {activeTab === 'activity' && <ActivityTab />}
        </div>

        {/* ── Settings Section ───────────────────────────────── */}
        <SettingsSection />
      </div>

      {/* ── Modals ─────────────────────────────────────────────── */}
      {openModal === 'send' && <SendModal onClose={() => setOpenModal(null)} />}
      {openModal === 'receive' && <ReceiveModal onClose={() => setOpenModal(null)} totalUSD={totalUSD} />}
      {openModal === 'topup' && <TopUpModal onClose={() => setOpenModal(null)} />}
      {openModal === 'qr' && <QRModal onClose={() => setOpenModal(null)} />}
      {openModal === 'edit' && (
        <EditProfileModal
          name={editName}
          bio={editBio}
          onSave={(n, b) => { setEditName(n); setEditBio(b); setOpenModal(null); toast.success('Profile updated!'); }}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === 'cardDetail' && <CardDetailModal onClose={() => setOpenModal(null)} />}
    </AppLayout>
  );
}

// ─── Wallet Tab ────────────────────────────────────────────────────────────────
function WalletTab({
  balanceVisible, toggleBalance, totalUSD,
  onSend, onReceive, onTopUp, onCardDetail
}: {
  balanceVisible: boolean;
  toggleBalance: () => void;
  totalUSD: number;
  onSend: () => void;
  onReceive: () => void;
  onTopUp: () => void;
  onCardDetail: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* ── Main Wallet Card ── */}
      <div className="wallet-gradient rounded-3xl p-5 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="relative">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <img
                src="https://cdn-ai.onspace.ai/onspace/project/uploads/DXk8TpjggrxdpLjNeymRWG/IMG_5852.JPG"
                alt="ConnectPay"
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="text-xs font-semibold text-green-200 tracking-wide uppercase">ConnectPay Wallet</span>
            </div>
            <button
              onClick={toggleBalance}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors"
            >
              {balanceVisible ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>

          {/* Balance */}
          <div className="mb-1">
            <p className="text-xs text-green-200 font-medium mb-1">Total Balance</p>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold tracking-tight">
                {balanceVisible
                  ? `$${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                  : '••••••'}
              </p>
              <span className="text-xs text-green-300 mb-1.5 flex items-center gap-0.5">
                <TrendingUp size={11} /> +2.4% today
              </span>
            </div>
          </div>

          {/* Card Number Row */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs text-green-300 font-mono tracking-widest">•••• •••• •••• 4821</span>
            <button
              onClick={() => toast.success('Card number copied!')}
              className="w-5 h-5 flex items-center justify-center rounded bg-white/20 hover:bg-white/30"
            >
              <Copy size={10} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: ArrowUpRight, label: 'Send', action: onSend },
              { icon: ArrowDownLeft, label: 'Receive', action: onReceive },
              { icon: Plus, label: 'Top Up', action: onTopUp },
              { icon: CreditCard, label: 'Card', action: onCardDetail },
            ].map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                className="flex flex-col items-center gap-1.5 bg-white/15 hover:bg-white/25 active:scale-95 transition-all rounded-2xl py-3"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon size={16} />
                </div>
                <span className="text-[10px] font-semibold">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Send Row ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-800">Quick Send</p>
          <button className="text-xs text-brand-600 font-medium">See All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {USERS.slice(0, 5).map(u => (
            <button
              key={u.id}
              onClick={() => toast.success(`Opening payment to ${u.name}...`)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 active:scale-95 transition-transform"
              title={`Send money to ${u.name}`}
            >
              <div className="relative">
                <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" />
                {(u as User).isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-brand-500 border-2 border-white rounded-full" />}
              </div>
              <span className="text-[10px] text-gray-600 font-medium max-w-[48px] truncate">{u.name.split(' ')[0]}</span>
            </button>
          ))}
          <button
            onClick={() => toast.success('Add new payee coming soon!')}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
            title="Add new payee"
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-brand-300 flex items-center justify-center">
              <Plus size={16} className="text-brand-400" />
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Add</span>
          </button>
        </div>
      </div>

      {/* ── Currency Balances ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
          <span className="text-sm font-semibold text-gray-800">My Currencies</span>
          <button
            onClick={() => toast.success('Add currency coming soon!')}
            className="flex items-center gap-1 text-xs text-brand-600 font-medium bg-brand-50 px-2.5 py-1 rounded-full hover:bg-brand-100 transition-colors"
            title="Add currency"
          >
            <Plus size={11} /> Add
          </button>
        </div>
        {WALLET_BALANCES.map((balance, idx) => (
          <CurrencyRow key={balance.currency} balance={balance} isLast={idx === WALLET_BALANCES.length - 1} />
        ))}
      </div>

      {/* ── Offers Banner ── */}
      <div className="bg-gradient-to-r from-gold-500 to-gold-400 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
          <Gift size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">Refer & Earn $10</p>
          <p className="text-xs text-yellow-100">Invite friends and get rewarded</p>
        </div>
        <button
          onClick={() => toast.success('Referral link copied!')}
          className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-xl active:scale-95 transition-all"
        >
          Invite
        </button>
      </div>
    </div>
  );
}

function CurrencyRow({ balance, isLast }: { balance: WalletBalance; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`${!isLast ? 'border-b border-gray-50' : ''}`}>
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 border"
          style={{ backgroundColor: `${balance.color}15`, color: balance.color, borderColor: `${balance.color}30` }}
        >
          {balance.flag}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900 text-sm">{balance.currency}</span>
            <span className="font-bold text-gray-900 text-sm">
              {balance.symbol}{balance.amount.toLocaleString('en-US', { minimumFractionDigits: balance.currency === 'BTC' || balance.currency === 'ETH' ? 4 : 2 })}
            </span>
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-xs text-gray-400">≈ ${balance.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <div className={`flex items-center gap-0.5 text-xs font-semibold ${balance.change24h > 0 ? 'text-brand-600' : balance.change24h < 0 ? 'text-red-500' : 'text-gray-400'}`}>
              {balance.change24h > 0 ? <TrendingUp size={10} /> : balance.change24h < 0 ? <TrendingDown size={10} /> : null}
              {balance.change24h === 0 ? 'Stable' : `${balance.change24h > 0 ? '+' : ''}${balance.change24h}%`}
            </div>
          </div>
        </div>
        <ChevronDown size={14} className={`text-gray-300 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-4 pb-3 flex gap-2 animate-fade-in">
          {['Send', 'Receive', 'Exchange'].map(a => (
            <button
              key={a}
              onClick={() => toast.success(`${a} ${balance.currency} coming soon!`)}
              className="flex-1 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
            >
              {a}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Exchange Tab ──────────────────────────────────────────────────────────────
function ExchangeTab() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('100');
  const [confirmed, setConfirmed] = useState(false);

  const currencies = WALLET_BALANCES.map(b => b.currency);
  const getRate = () => EXCHANGE_RATES.find(r => r.from === fromCurrency && r.to === toCurrency)?.rate ?? 1;
  const convertedAmount = parseFloat(amount || '0') * getRate();
  const fee = parseFloat(amount || '0') * 0.005;

  const swap = () => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); };

  const handleExchange = () => {
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      toast.success(`Exchanged ${amount} ${fromCurrency} → ${convertedAmount.toFixed(4)} ${toCurrency}!`);
    }, 1800);
  };

  return (
    <div className="space-y-4">
      {/* Exchange Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 pt-4 pb-2 border-b border-gray-50">
          <h3 className="text-sm font-bold text-gray-800">Currency Exchange</h3>
          <p className="text-xs text-gray-400 mt-0.5">Real-time rates · Low fees</p>
        </div>

        <div className="p-4 space-y-2">
          {/* From */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <label className="text-xs text-gray-400 font-semibold mb-2 block uppercase tracking-wider">You Send</label>
            <div className="flex items-center gap-3">
              <select
                value={fromCurrency}
                onChange={e => setFromCurrency(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-300 min-w-[80px]"
              >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="flex-1 bg-transparent text-2xl font-bold text-gray-900 focus:outline-none text-right"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">
              Available: {WALLET_BALANCES.find(b => b.currency === fromCurrency)?.symbol}
              {WALLET_BALANCES.find(b => b.currency === fromCurrency)?.amount.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? '0.00'}
            </p>
          </div>

          {/* Swap */}
          <div className="flex justify-center">
            <button
              onClick={swap}
              className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center hover:bg-brand-700 active:scale-95 transition-all shadow-md"
            >
              <RefreshCw size={15} className="text-white" />
            </button>
          </div>

          {/* To */}
          <div className="bg-brand-50 rounded-2xl p-4 border border-brand-100">
            <label className="text-xs text-brand-500 font-semibold mb-2 block uppercase tracking-wider">You Receive</label>
            <div className="flex items-center gap-3">
              <select
                value={toCurrency}
                onChange={e => setToCurrency(e.target.value)}
                className="bg-white border border-brand-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-300 min-w-[80px]"
              >
                {currencies.filter(c => c !== fromCurrency).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <p className="flex-1 text-2xl font-bold text-brand-700 text-right">
                {convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}
              </p>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
            {[
              { label: 'Exchange Rate', value: `1 ${fromCurrency} = ${getRate().toLocaleString('en-US', { maximumFractionDigits: 6 })} ${toCurrency}` },
              { label: 'Service Fee (0.5%)', value: `$${fee.toFixed(2)}` },
              { label: 'Processing Time', value: 'Instant' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{item.label}</span>
                <span className="text-xs font-semibold text-gray-700">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Exchange Button */}
          <button
            onClick={handleExchange}
            disabled={confirmed || !amount || parseFloat(amount) <= 0}
            className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 disabled:opacity-60 active:scale-98 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {confirmed ? (
              <>
                <CheckCircle2 size={18} className="animate-bounce" />
                Processing…
              </>
            ) : (
              <>
                Exchange Now
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Rates Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-800">Live Rates</span>
          <span className="text-xs text-brand-500 font-medium flex items-center gap-1">
            <Globe size={11} /> USD Base
          </span>
        </div>
        {[
          { to: 'EUR', flag: '🇪🇺', rate: 0.9256, change: '+0.31%', up: true },
          { to: 'GBP', flag: '🇬🇧', rate: 0.7912, change: '+0.12%', up: true },
          { to: 'BDT', flag: '🇧🇩', rate: 110.25, change: '+0.05%', up: true },
          { to: 'BTC', flag: '₿', rate: 0.0000156, change: '+2.41%', up: true },
          { to: 'ETH', flag: 'Ξ', rate: 0.000352, change: '-1.18%', up: false },
          { to: 'JPY', flag: '🇯🇵', rate: 149.82, change: '-0.05%', up: false },
        ].map(rate => (
          <div key={rate.to} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-base flex-shrink-0">
              {rate.flag}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">USD / {rate.to}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${rate.up ? 'bg-brand-400' : 'bg-red-400'}`}
                    style={{ width: `${Math.min(100, Math.abs(parseFloat(rate.change)) * 30 + 40)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{rate.rate.toLocaleString('en-US', { maximumFractionDigits: 6 })}</p>
              <p className={`text-xs font-semibold ${rate.up ? 'text-brand-600' : 'text-red-500'}`}>{rate.change}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Activity Tab ──────────────────────────────────────────────────────────────
function ActivityTab() {
  const [filter, setFilter] = useState<'all' | 'send' | 'receive' | 'exchange'>('all');

  const typeConfig = {
    send: { icon: ArrowUpRight, label: 'Sent', bg: 'bg-red-50', color: 'text-red-500', prefix: '-', amountColor: 'text-red-500' },
    receive: { icon: ArrowDownLeft, label: 'Received', bg: 'bg-brand-50', color: 'text-brand-600', prefix: '+', amountColor: 'text-brand-600' },
    exchange: { icon: RefreshCw, label: 'Exchange', bg: 'bg-blue-50', color: 'text-blue-600', prefix: '~', amountColor: 'text-blue-600' },
    topup: { icon: Download, label: 'Top Up', bg: 'bg-gold-50', color: 'text-gold-600', prefix: '+', amountColor: 'text-gold-600' },
  } as const;

  const filtered = TRANSACTIONS.filter(tx => filter === 'all' || tx.type === filter || (filter === 'receive' && tx.type === 'topup'));

  const totalReceived = TRANSACTIONS.filter(t => t.type === 'receive').reduce((s, t) => s + t.amount, 0);
  const totalSent = TRANSACTIONS.filter(t => t.type === 'send').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="wallet-gradient rounded-2xl p-4 text-white">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-2">
            <ArrowDownLeft size={18} />
          </div>
          <p className="text-xs text-green-200 font-medium">Total Received</p>
          <p className="text-2xl font-bold mt-0.5">${totalReceived.toFixed(2)}</p>
          <p className="text-xs text-green-300 mt-1">This month</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center mb-2">
            <ArrowUpRight size={18} className="text-red-400" />
          </div>
          <p className="text-xs text-gray-400 font-medium">Total Sent</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">${totalSent.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">This month</p>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {(['all', 'send', 'receive', 'exchange'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filter === f
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            {f === 'all' ? 'All Activity' : f === 'send' ? 'Sent' : f === 'receive' ? 'Received' : 'Exchanges'}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
          <span className="text-sm font-bold text-gray-800">Transactions</span>
          <button className="text-xs text-brand-600 font-medium">Export</button>
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-gray-400">
            <AlertCircle size={28} className="text-gray-200" />
            <p className="text-sm">No transactions found</p>
          </div>
        ) : (
          filtered.map((tx, idx) => {
            const cfg = typeConfig[tx.type];
            const TxIcon = cfg.icon;
            return (
              <div key={tx.id} className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${idx < filtered.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${cfg.bg}`}>
                  {tx.toFromAvatar ? (
                    <img src={tx.toFromAvatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                  ) : (
                    <TxIcon size={18} className={cfg.color} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-900 truncate">{tx.toFrom}</span>
                    <span className={`text-sm font-bold flex-shrink-0 ${cfg.amountColor}`}>
                      {cfg.prefix}${tx.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5 gap-2">
                    <span className="text-xs text-gray-400 truncate">{tx.note || cfg.label} · {tx.currency}</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-[10px] text-gray-400">{tx.timestamp}</span>
                      <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${tx.status === 'completed' ? 'bg-brand-100 text-brand-700' :
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {tx.status === 'completed' ? <CheckCircle2 size={9} /> : tx.status === 'pending' ? <AlertCircle size={9} /> : <X size={9} />}
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <p className="text-xs text-center text-gray-400 pb-2">{filtered.length} of {TRANSACTIONS.length} transactions</p>
    </div>
  );
}

// ─── Settings Section ──────────────────────────────────────────────────────────
function SettingsSection() {
  const [notifs, setNotifs] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggles = [
    { icon: Bell, label: 'Push Notifications', desc: 'Payments, messages, alerts', state: notifs, set: setNotifs, color: 'bg-orange-100 text-orange-500' },
    { icon: Fingerprint, label: 'Biometric Auth', desc: 'Fingerprint / Face ID login', state: biometrics, set: setBiometrics, color: 'bg-purple-100 text-purple-500' },
    { icon: Moon, label: 'Dark Mode', desc: 'Switch app appearance', state: darkMode, set: setDarkMode, color: 'bg-indigo-100 text-indigo-500' },
  ];

  return (
    <div className="px-4 pb-8 mt-1 space-y-3">
      {/* Toggle Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50">
          <p className="text-sm font-bold text-gray-800">Preferences</p>
        </div>
        {toggles.map(({ icon: Icon, label, desc, state, set, color }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <button
              onClick={() => { set(!state); toast.success(`${label} ${!state ? 'enabled' : 'disabled'}`); }}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${state ? 'bg-brand-500' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${state ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Nav Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50">
          <p className="text-sm font-bold text-gray-800">Account</p>
        </div>
        {[
          { icon: Lock, label: 'Change PIN / Password', desc: 'Update your security credentials', color: 'bg-red-100 text-red-500' },
          { icon: Shield, label: 'Privacy & Security', desc: 'Two-factor auth, login history', color: 'bg-green-100 text-green-600' },
          { icon: HelpCircle, label: 'Help & Support', desc: 'FAQ, live chat, contact us', color: 'bg-blue-100 text-blue-500' },
          { icon: Star, label: 'Rate ConnectPay', desc: 'Tell us what you think', color: 'bg-yellow-100 text-yellow-500' },
        ].map(({ icon: Icon, label, desc, color }) => (
          <button
            key={label}
            onClick={() => toast.success(`${label} coming soon!`)}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <ChevronRight size={15} className="text-gray-300 flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* Sign Out */}
      <button
        onClick={() => toast.error('Signed out successfully')}
        className="w-full flex items-center gap-3 px-4 py-4 bg-white rounded-2xl shadow-sm border border-red-100 hover:bg-red-50 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <LogOut size={16} className="text-red-500" />
        </div>
        <span className="flex-1 text-sm font-semibold text-red-500">Sign Out</span>
        <ChevronRight size={15} className="text-red-300" />
      </button>

      <p className="text-center text-xs text-gray-300 pt-1">ConnectPay v2.0 · Terms · Privacy</p>
    </div>
  );
}

// ─── Send Modal ────────────────────────────────────────────────────────────────
function SendModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'select' | 'amount' | 'confirm' | 'done'>('select');
  const [selectedUser, setSelectedUser] = useState<typeof USERS[0] | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const send = () => {
    setStep('done');
    setTimeout(() => { onClose(); toast.success(`$${amount} sent to ${selectedUser?.name}!`); }, 1500);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">
          {step === 'select' ? 'Send Money' : step === 'amount' ? `Send to ${selectedUser?.name.split(' ')[0]}` : step === 'confirm' ? 'Confirm Payment' : 'Sent!'}
        </h2>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} /></button>
      </div>

      {step === 'select' && (
        <div className="space-y-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none" placeholder="Search name or @username" />
          </div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contacts</p>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {USERS.map(u => (
              <button
                key={u.id}
                onClick={() => { setSelectedUser(u); setStep('amount'); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.username}</p>
                </div>
                {u.isOnline && <span className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'amount' && selectedUser && (
        <div className="space-y-4">
          <div className="flex flex-col items-center py-4">
            <img src={selectedUser.avatar} alt="" className="w-16 h-16 rounded-full object-cover mb-2" />
            <p className="font-bold text-gray-900">{selectedUser.name}</p>
            <p className="text-sm text-gray-400">{selectedUser.username}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <span className="text-3xl font-bold text-gray-400">$</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="text-5xl font-bold text-gray-900 bg-transparent focus:outline-none text-center w-40"
                placeholder="0"
                autoFocus
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Available: $12,450.80</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['10', '25', '50', '100'].map(q => (
              <button
                key={q}
                onClick={() => setAmount(q)}
                className="py-2 bg-gray-100 rounded-xl text-sm font-semibold text-gray-700 hover:bg-brand-100 hover:text-brand-700 transition-colors"
              >
                ${q}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add a note (optional)"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          <button
            onClick={() => parseFloat(amount) > 0 && setStep('confirm')}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full py-3.5 bg-brand-600 text-white rounded-2xl font-bold disabled:opacity-40 hover:bg-brand-700 active:scale-95 transition-all"
          >
            Continue
          </button>
        </div>
      )}

      {step === 'confirm' && selectedUser && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <img src={selectedUser.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-bold text-gray-900">{selectedUser.name}</p>
                <p className="text-sm text-gray-400">{selectedUser.username}</p>
              </div>
            </div>
            <div className="h-px bg-gray-200" />
            {[
              { label: 'Amount', value: `$${parseFloat(amount).toFixed(2)}` },
              { label: 'Fee', value: '$0.00' },
              { label: 'Note', value: note || '—' },
              { label: 'Total', value: `$${parseFloat(amount).toFixed(2)}`, bold: true },
            ].map(row => (
              <div key={row.label} className="flex justify-between">
                <span className="text-sm text-gray-400">{row.label}</span>
                <span className={`text-sm ${row.bold ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{row.value}</span>
              </div>
            ))}
          </div>
          <button onClick={send} className="w-full py-3.5 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 active:scale-95 transition-all">
            Confirm & Send
          </button>
          <button onClick={() => setStep('amount')} className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700">
            Go Back
          </button>
        </div>
      )}

      {step === 'done' && (
        <div className="flex flex-col items-center py-6 gap-3">
          <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center">
            <CheckCircle2 size={40} className="text-brand-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">Payment Sent!</p>
          <p className="text-sm text-gray-400">${amount} sent to {selectedUser?.name}</p>
        </div>
      )}
    </ModalOverlay>
  );
}

// ─── Receive Modal ─────────────────────────────────────────────────────────────
function ReceiveModal({ onClose, totalUSD }: { onClose: () => void; totalUSD: number }) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Receive Money</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} /></button>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="bg-brand-50 rounded-2xl p-4 border border-brand-100 w-full text-center">
          <p className="text-xs text-brand-500 font-semibold mb-1">Your Wallet Address</p>
          <p className="font-mono text-sm text-gray-800 font-bold">@alexmorgan</p>
        </div>

        {/* QR Code */}
        <div className="bg-white border-2 border-brand-200 rounded-2xl p-4 shadow-md">
          <svg viewBox="0 0 100 100" className="w-48 h-48" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="25" height="25" rx="3" fill="#166534" />
            <rect x="9" y="9" width="17" height="17" rx="2" fill="white" />
            <rect x="13" y="13" width="9" height="9" rx="1" fill="#166534" />
            <rect x="70" y="5" width="25" height="25" rx="3" fill="#166534" />
            <rect x="74" y="9" width="17" height="17" rx="2" fill="white" />
            <rect x="78" y="13" width="9" height="9" rx="1" fill="#166534" />
            <rect x="5" y="70" width="25" height="25" rx="3" fill="#166534" />
            <rect x="9" y="74" width="17" height="17" rx="2" fill="white" />
            <rect x="13" y="78" width="9" height="9" rx="1" fill="#166534" />
            {[35, 39, 43, 47, 51, 55, 59, 63].map((x, i) =>
              [5, 9, 13, 17, 21, 25].map((y, j) =>
                (i + j) % 3 !== 0 ? <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" rx="0.5" fill="#166534" /> : null
              )
            )}
            {[5, 9, 13, 17, 21, 25, 29].map((x, i) =>
              [35, 39, 43, 47, 51, 55, 59, 63, 67, 71, 75, 79, 83, 87, 91].map((y, j) =>
                (i * 3 + j) % 5 !== 0 ? <rect key={`r${x}-${y}`} x={x} y={y} width="3" height="3" rx="0.5" fill="#166534" /> : null
              )
            )}
            {[35, 39, 43, 47, 51, 55, 59, 63, 67, 71, 75, 79, 83, 87, 91, 95].map((x, i) =>
              [35, 39, 43, 47, 51, 55, 59, 63, 67, 71, 75, 79, 83, 87, 91, 95].map((y, j) =>
                (i + j * 2) % 4 !== 0 ? <rect key={`d${x}-${y}`} x={x} y={y} width="3" height="3" rx="0.5" fill="#166534" /> : null
              )
            )}
            <rect x="43" y="43" width="14" height="14" rx="3" fill="white" />
            <circle cx="50" cy="50" r="5" fill="#16a34a" />
            <circle cx="50" cy="50" r="2.5" fill="white" />
          </svg>
        </div>

        <div className="w-full space-y-2">
          <button
            onClick={() => { navigator.clipboard.writeText('@alexmorgan'); toast.success('Username copied!'); }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <Copy size={15} /> Copy Username
          </button>
          <button
            onClick={() => toast.success('QR code saved!')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 rounded-2xl text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
          >
            <Download size={15} /> Save QR Code
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── Top Up Modal ──────────────────────────────────────────────────────────────
function TopUpModal({ onClose }: { onClose: () => void }) {
  const [method, setMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState('');

  const methods = [
    { id: 'bank', icon: Building2, label: 'Bank Transfer', desc: 'Instant · Free', color: 'bg-blue-100 text-blue-600' },
    { id: 'card', icon: CreditCard, label: 'Debit / Credit Card', desc: '1–3 min · 1.5% fee', color: 'bg-purple-100 text-purple-600' },
    { id: 'wallet', icon: Wallet, label: 'Digital Wallet', desc: 'Instant · Free', color: 'bg-brand-100 text-brand-600' },
  ];

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Top Up Wallet</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} /></button>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Method</p>
        {methods.map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${method === m.id ? 'border-brand-500 bg-brand-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${m.color}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{m.label}</p>
                <p className="text-xs text-gray-400">{m.desc}</p>
              </div>
              {method === m.id && <Check size={18} className="text-brand-600 flex-shrink-0" />}
            </button>
          );
        })}

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Amount</p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-300">$</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {['50', '100', '250', '500'].map(q => (
              <button
                key={q}
                onClick={() => setAmount(q)}
                className="py-2 bg-gray-100 rounded-xl text-sm font-semibold text-gray-600 hover:bg-brand-100 hover:text-brand-700 transition-colors"
              >
                ${q}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => { if (method && parseFloat(amount) > 0) { onClose(); toast.success(`$${amount} added to wallet!`); } else toast.error('Select method and enter amount'); }}
          className="w-full py-3.5 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 active:scale-95 transition-all"
        >
          Add Funds
        </button>
      </div>
    </ModalOverlay>
  );
}

// ─── Card Detail Modal ─────────────────────────────────────────────────────────
function CardDetailModal({ onClose }: { onClose: () => void }) {
  const [showNum, setShowNum] = useState(false);

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Virtual Card</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} /></button>
      </div>

      {/* Card Visual */}
      <div className="wallet-gradient rounded-2xl p-5 text-white mb-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
        <div className="flex items-center justify-between mb-8">
          <img
            src="https://cdn-ai.onspace.ai/onspace/project/uploads/DXk8TpjggrxdpLjNeymRWG/IMG_5852.JPG"
            alt="ConnectPay"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-xs font-bold tracking-widest text-green-200">VISA</span>
        </div>
        <p className="font-mono text-base tracking-widest mb-4">
          {showNum ? '4821 6473 9201 4821' : '•••• •••• •••• 4821'}
        </p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-green-300 uppercase tracking-widest mb-0.5">Card Holder</p>
            <p className="font-bold text-sm">ALEX MORGAN</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-green-300 uppercase tracking-widest mb-0.5">Expires</p>
            <p className="font-bold text-sm">01/29</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {[
          { label: 'Card Number', value: showNum ? '4821 6473 9201 4821' : '•••• •••• •••• 4821', action: () => setShowNum(v => !v), actionIcon: showNum ? EyeOff : Eye },
          { label: 'CVV', value: showNum ? '284' : '•••', action: () => setShowNum(v => !v), actionIcon: showNum ? EyeOff : Eye },
          { label: 'Expiry', value: '01/2029' },
          { label: 'Status', value: 'Active' },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
            <span className="text-xs text-gray-400">{row.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-semibold text-gray-800">{row.value}</span>
              {row.action && row.actionIcon && (
                <button onClick={row.action} className="text-gray-400 hover:text-gray-700">
                  <row.actionIcon size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          onClick={() => toast.success('Card frozen!')}
          className="py-3 bg-gray-100 text-gray-700 rounded-2xl text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Freeze Card
        </button>
        <button
          onClick={() => { navigator.clipboard.writeText('4821647392014821'); toast.success('Card number copied!'); }}
          className="py-3 bg-brand-600 text-white rounded-2xl text-sm font-semibold hover:bg-brand-700 transition-colors flex items-center justify-center gap-1.5"
        >
          <Copy size={14} /> Copy Number
        </button>
      </div>
    </ModalOverlay>
  );
}

// ─── QR Modal ─────────────────────────────────────────────────────────────────
function QRModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">My QR Code</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} /></button>
      </div>
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-gray-400 text-center">Let others scan to send you money or add you as a contact</p>
        <div className="bg-white border-2 border-brand-200 rounded-2xl p-4 shadow-md">
          <svg viewBox="0 0 100 100" className="w-52 h-52" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="25" height="25" rx="3" fill="#166534" />
            <rect x="9" y="9" width="17" height="17" rx="2" fill="white" />
            <rect x="13" y="13" width="9" height="9" rx="1" fill="#166534" />
            <rect x="70" y="5" width="25" height="25" rx="3" fill="#166534" />
            <rect x="74" y="9" width="17" height="17" rx="2" fill="white" />
            <rect x="78" y="13" width="9" height="9" rx="1" fill="#166534" />
            <rect x="5" y="70" width="25" height="25" rx="3" fill="#166534" />
            <rect x="9" y="74" width="17" height="17" rx="2" fill="white" />
            <rect x="13" y="78" width="9" height="9" rx="1" fill="#166534" />
            {[35, 39, 43, 47, 51, 55, 59, 63].map((x, i) =>
              [5, 9, 13, 17, 21, 25].map((y, j) =>
                (i + j) % 3 !== 0 ? <rect key={`a${x}-${y}`} x={x} y={y} width="3" height="3" rx="0.5" fill="#166534" /> : null
              )
            )}
            {[35, 39, 43, 47, 51, 55, 59, 63, 67, 71, 75, 79, 83, 87, 91, 95].map((x, i) =>
              [35, 39, 43, 47, 51, 55, 59, 63, 67, 71, 75, 79, 83, 87, 91, 95].map((y, j) =>
                (i + j * 2) % 4 !== 0 ? <rect key={`b${x}-${y}`} x={x} y={y} width="3" height="3" rx="0.5" fill="#166534" /> : null
              )
            )}
            <rect x="43" y="43" width="14" height="14" rx="3" fill="white" />
            <circle cx="50" cy="50" r="5" fill="#16a34a" />
            <circle cx="50" cy="50" r="2.5" fill="white" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-900">Alex Morgan</p>
          <p className="text-sm text-gray-400">@alexmorgan</p>
        </div>
        <div className="flex gap-2 w-full">
          <button
            onClick={() => toast.success('QR saved!')}
            className="flex-1 py-3 bg-gray-100 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => toast.success('QR link shared!')}
            className="flex-1 py-3 bg-brand-600 rounded-2xl text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
          >
            Share QR
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── Edit Profile Modal ────────────────────────────────────────────────────────
function EditProfileModal({ name, bio, onSave, onClose }: {
  name: string; bio: string;
  onSave: (n: string, b: string) => void;
  onClose: () => void;
}) {
  const [n, setN] = useState(name);
  const [b, setB] = useState(bio);
  const [email, setEmail] = useState(CURRENT_USER.email);
  const [phone, setPhone] = useState(CURRENT_USER.phone);

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} /></button>
      </div>
      <div className="flex flex-col items-center mb-5">
        <div className="relative">
          <img src={CURRENT_USER.avatar} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-brand-100" />
          <button
            onClick={() => toast.success('Photo upload coming soon!')}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center border-2 border-white"
          >
            <Camera size={12} className="text-white" />
          </button>
        </div>
        <button onClick={() => toast.success('Change photo coming soon!')} className="text-xs text-brand-600 font-medium mt-2">Change Photo</button>
      </div>

      <div className="space-y-3">
        {[
          { label: 'Full Name', value: n, set: setN, placeholder: 'Your full name', icon: Edit3 },
          { label: 'Bio', value: b, set: setB, placeholder: 'Write something about you', icon: Edit3 },
          { label: 'Email', value: email, set: setEmail, placeholder: 'Email address', icon: Mail },
          { label: 'Phone', value: phone, set: setPhone, placeholder: 'Phone number', icon: Phone },
        ].map(field => {
          const Icon = field.icon;
          return (
            <div key={field.label}>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{field.label}</label>
              <div className="relative">
                <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={field.value}
                  onChange={e => field.set(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-5">
        <button onClick={onClose} className="flex-1 py-3 bg-gray-100 rounded-2xl text-sm font-semibold text-gray-700">Cancel</button>
        <button
          onClick={() => onSave(n, b)}
          className="flex-1 py-3 bg-brand-600 rounded-2xl text-sm font-bold text-white hover:bg-brand-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </ModalOverlay>
  );
}

// ─── Modal Overlay Helper ──────────────────────────────────────────────────────
function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-t-3xl p-5 animate-slide-up max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        {children}
      </div>
    </div>
  );
}
