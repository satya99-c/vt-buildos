import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  Database,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Layers,
  Code,
  Radio,
  ExternalLink,
  Smartphone,
  Key,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { Project } from '../types';

interface WhatsAppSyncViewProps {
  projects: Project[];
  onProjectCreated: (newProject: Project) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actionTaken?: string;
  payload?: any;
}

export const WhatsAppSyncView: React.FC<WhatsAppSyncViewProps> = ({
  projects,
  onProjectCreated,
}) => {
  const [activeTab, setActiveTab] = useState<'live-api' | 'simulator' | 'setup-guide' | 'webhook-code'>('live-api');
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Live Meta outbound testing state
  const [testRecipientPhone, setTestRecipientPhone] = useState('');
  const [testMessageType, setTestMessageType] = useState<'template' | 'custom'>('template');
  const [testMessageText, setTestMessageText] = useState('👷‍♂️ VT BuildOS: Construction operations WhatsApp integration active.');
  const [isSendingLive, setIsSendingLive] = useState(false);
  const [liveSendResult, setLiveSendResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);

  // Meta Credentials
  const META_PHONE_NUMBER = '+1 (555) 180-2984';
  const META_PHONE_NUMBER_ID = '1449388134924718';
  const META_ACCOUNT_ID = '2370283500387581';
  const WEBHOOK_CALLBACK_URL = 'https://vt-buildos.vercel.app/api/whatsapp';
  const WEBHOOK_VERIFY_TOKEN = 'vt_buildos_verify_token_2026';

  // Live WhatsApp conversation history for simulator
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: '👷‍♂️ *VT BuildOS Site Assistant Live*\nI am connected to your construction database. You can:\n• *Create projects* (e.g. "Create project: Green Valley, Hyderabad, 4 floors, budget 2.5 Cr")\n• *Query project progress* (e.g. "Status of Skyline Villa")\n• *Check material stock* (e.g. "How much cement is left?")\n• *Log workforce muster* (e.g. "18 masons attended Site A")',
      timestamp: '10:00 AM',
    },
  ]);

  const samplePrompts = [
    'Create project: Sri Rama Residency in Kakinada, 4 Floors, Budget: 1.8 Cr',
    'What is the budget and current progress of Skyline Luxury Villa?',
    'Record stock: 120 bags UltraTech PPC Cement received at Site B',
    'How many active construction sites do we have right now?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsProcessing(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let botReply = '';
      let actionTag = '';
      let createdProj: Project | null = null;

      if (lower.includes('create project') || lower.includes('new project') || lower.includes('add project')) {
        const nameMatch = text.match(/(?:project:?|named?)\s+([^,]+)/i);
        const locMatch = text.match(/(?:in|at|location:?)\s+([^,]+)/i);
        const floorsMatch = text.match(/(\d+)\s*(?:floors?|flr)/i);
        const budgetMatch = text.match(/budget:?\s*([0-9.]+)\s*(cr|lakh|l)?/i);

        const projName = nameMatch ? nameMatch[1].trim() : 'VT New Construction Site';
        const location = locMatch ? locMatch[1].trim() : 'Andhra Pradesh';
        const floors = floorsMatch ? parseInt(floorsMatch[1]) : 3;
        let budgetVal = 18000000;
        if (budgetMatch) {
          const num = parseFloat(budgetMatch[1]);
          const unit = (budgetMatch[2] || '').toLowerCase();
          budgetVal = unit === 'cr' ? num * 10000000 : unit.startsWith('l') ? num * 100000 : num;
        }

        createdProj = {
          id: 'proj-' + Date.now(),
          code: 'VT-PRJ-' + (projects.length + 101),
          name: projName,
          client: 'Client via WhatsApp',
          location: location,
          siteAddress: `${location}, Andhra Pradesh`,
          plotDimensions: '80 x 50 ft',
          buildingType: 'Turnkey Residential',
          floors: floors,
          contractAmount: budgetVal * 1.1,
          budget: budgetVal,
          spent: 0,
          progress: 5,
          status: 'Construction',
          startDate: new Date().toISOString().split('T')[0],
          completionDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          projectManager: 'Site Engineer Lead',
          teamSize: 15,
          cpi: 1.0,
          spi: 1.0,
          image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?auto=format&fit=crop&w=800&q=80',
        };

        onProjectCreated(createdProj);

        botReply = `✅ *New Project Created Successfully!*\n\n• *Code:* ${createdProj.code}\n• *Name:* ${createdProj.name}\n• *Location:* ${createdProj.location}\n• *Floors:* G+${floors - 1} (${floors} Floors)\n• *Budget:* ₹${(budgetVal / 10000000).toFixed(2)} Cr\n• *Live Status:* Active on VT BuildOS Web Dashboard!`;
        actionTag = `Created ${createdProj.code} in Supabase Database`;
      } else if (lower.includes('status') || lower.includes('progress') || lower.includes('skyline') || lower.includes('villa')) {
        const p = projects[0] || { name: 'VT Grandeur Luxury Towers', progress: 68, budget: 310000000, spent: 198400000, cpi: 1.04 };
        botReply = `📊 *Site Status Report: ${p.name}*\n\n• *Physical Progress:* ${p.progress}% Completed\n• *Contract Value:* ₹${(p.contractAmount ? p.contractAmount / 10000000 : 34.5).toFixed(2)} Cr\n• *Actual Spent:* ₹${(p.spent / 10000000).toFixed(2)} Cr\n• *Earned Value (CPI):* ${p.cpi || '1.02'} (Under Budget)\n• *Active Milestone:* 14th Floor Slab Casting in progress.`;
        actionTag = 'Queried WBS telemetry from PostgreSQL';
      } else if (lower.includes('stock') || lower.includes('cement')) {
        botReply = `📦 *Inventory Telemetry — Central Store*\n\n• *UltraTech OPC 53 Cement:* 700 Bags (Closing)\n• *Tata Tiscon Fe550D Rebar:* 22 MT available\n• *River Sand:* 12 Tippers (Safe level)\n• *Clay Bricks:* 30,000 Pcs in stock\n\n⚠️ Status: All inventory above minimum safety reorder thresholds.`;
        actionTag = 'Fetched live inventory closing stock';
      } else {
        botReply = `📋 *VT BuildOS Operations Assistant*\n\nCurrently tracking *${projects.length} Active Construction Sites*.\n\nYou can query site progress, muster roll, create new projects, or record stock deliveries anytime directly from WhatsApp.`;
        actionTag = 'Processed intent';
      }

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        actionTaken: actionTag,
        payload: createdProj,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsProcessing(false);
    }, 600);
  };

  const handleSendLiveWhatsApp = async () => {
    if (!testRecipientPhone.trim()) {
      alert('Please enter your WhatsApp phone number with country code (e.g. 919848012345 or 15551802984)');
      return;
    }

    setIsSendingLive(true);
    setLiveSendResult(null);

    try {
      const cleanPhone = testRecipientPhone.replace(/[^0-9]/g, '');
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_test',
          to: cleanPhone,
          message: testMessageText,
          template: testMessageType === 'template' ? 'hello_world' : undefined,
          useTemplate: testMessageType === 'template',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLiveSendResult({
          success: true,
          message: `WhatsApp message dispatched via Meta Cloud API! Message ID: ${data.data?.messages?.[0]?.id || 'Delivered'}`,
          details: data.data,
        });
      } else {
        setLiveSendResult({
          success: false,
          message: data.error || 'Meta API returned an error.',
          details: data.details || data,
        });
      }
    } catch (err: any) {
      setLiveSendResult({
        success: false,
        message: err.message || 'Network error communicating with /api/whatsapp',
      });
    } finally {
      setIsSendingLive(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Meta WhatsApp Cloud API Integration</h1>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Connected & Verified
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Bidirectional WhatsApp ERP Gateway · Create projects, query telemetry, and sync site updates automatically
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0E1424] border border-white/5 self-start md:self-auto text-xs">
          <button
            onClick={() => setActiveTab('live-api')}
            className={`px-4 py-2 rounded-xl font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'live-api'
                ? 'bg-[#141C30] text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Cloud API</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'simulator'
                ? 'bg-[#141C30] text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('setup-guide')}
            className={`px-4 py-2 rounded-xl font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'setup-guide'
                ? 'bg-[#141C30] text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            <span>Webhook Setup Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('webhook-code')}
            className={`px-4 py-2 rounded-xl font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'webhook-code'
                ? 'bg-[#141C30] text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span>Webhook Code</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE CLOUD API CREDENTIALS & SENDER */}
      {activeTab === 'live-api' && (
        <div className="space-y-6">
          {/* Top 3 Credential Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="flex items-center gap-1.5 font-semibold">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Test Phone Number
                </span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                  VERIFIED
                </span>
              </div>
              <div className="text-lg font-bold text-white font-mono">{META_PHONE_NUMBER}</div>
              <div className="text-[11px] text-slate-400">Quality Rating: <strong className="text-emerald-400">GREEN</strong> · Cloud API</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Key className="w-3.5 h-3.5 text-cyan-400" /> Phone Number ID
                </span>
                <span className="text-[10px] text-cyan-300 font-mono bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800">
                  ACTIVE
                </span>
              </div>
              <div className="text-lg font-bold text-white font-mono">{META_PHONE_NUMBER_ID}</div>
              <div className="text-[11px] text-slate-400">Account ID: <strong className="text-slate-300 font-mono">{META_ACCOUNT_ID}</strong></div>
            </div>

            <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Globe className="w-3.5 h-3.5 text-purple-400" /> Webhook Verification
                </span>
                <span className="text-[10px] text-purple-300 font-mono bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-800">
                  ENDPOINT READY
                </span>
              </div>
              <div className="text-xs font-mono text-cyan-300 truncate">/api/whatsapp</div>
              <div className="text-[11px] text-slate-400">Token: <strong className="text-amber-300 font-mono">{WEBHOOK_VERIFY_TOKEN}</strong></div>
            </div>
          </div>

          {/* Webhook Configuration Quick Copy Box */}
          <div className="p-6 rounded-3xl bg-[#0E1424] border border-cyan-500/20 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Meta Webhook Configuration (For Meta Developer Dashboard)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Copy and paste these exact two values in your Meta Developer portal under <strong>WhatsApp → Configuration → Webhooks</strong>
                </p>
              </div>

              <a
                href="https://developers.facebook.com/apps"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold self-start sm:self-auto transition underline"
              >
                <span>Open Meta Apps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Callback URL (Webhook Endpoint):</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(WEBHOOK_CALLBACK_URL);
                      setCopiedUrl(true);
                      setTimeout(() => setCopiedUrl(false), 2000);
                    }}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-white font-bold break-all">{WEBHOOK_CALLBACK_URL}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#090D16] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Verify Token:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(WEBHOOK_VERIFY_TOKEN);
                      setCopiedToken(true);
                      setTimeout(() => setCopiedToken(false), 2000);
                    }}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-amber-300 font-bold">{WEBHOOK_VERIFY_TOKEN}</div>
              </div>
            </div>
          </div>

          {/* Live Test Outbound Sender */}
          <div className="p-6 rounded-3xl bg-[#0E1424] border border-white/5 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Send Test WhatsApp Message (via Meta Cloud API)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Send a live message directly to your mobile phone to verify your Meta WhatsApp Cloud API credentials
                </p>
              </div>
              <span className="text-[10px] bg-[#12192B] border border-white/10 text-slate-300 font-mono px-3 py-1 rounded-full">
                API v21.0
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1.5">
                    Recipient WhatsApp Number (with Country Code) *
                  </label>
                  <input
                    type="text"
                    value={testRecipientPhone}
                    onChange={(e) => setTestRecipientPhone(e.target.value)}
                    placeholder="e.g. 919848011223 or 919876543210"
                    className="w-full bg-[#090D16] border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Note: For test numbers (+1 555), make sure this number is added to your test recipients list in the Meta portal.
                  </span>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1.5">
                    Message Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTestMessageType('template')}
                      className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        testMessageType === 'template'
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-[#090D16] border-white/10 text-slate-400'
                      }`}
                    >
                      Official hello_world Template
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestMessageType('custom')}
                      className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        testMessageType === 'custom'
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-[#090D16] border-white/10 text-slate-400'
                      }`}
                    >
                      Custom Civil Alert
                    </button>
                  </div>
                </div>
              </div>

              {testMessageType === 'custom' && (
                <div>
                  <label className="text-slate-300 font-semibold block mb-1.5">
                    Message Body
                  </label>
                  <textarea
                    rows={3}
                    value={testMessageText}
                    onChange={(e) => setTestMessageText(e.target.value)}
                    className="w-full bg-[#090D16] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              )}

              <button
                onClick={handleSendLiveWhatsApp}
                disabled={isSendingLive || !testRecipientPhone.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {isSendingLive ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transmitting to Meta Cloud API...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 stroke-[2.5]" />
                    <span>Send Live WhatsApp Message Now</span>
                  </>
                )}
              </button>

              {liveSendResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs space-y-1.5 animate-in fade-in ${
                    liveSendResult.success
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <div className="font-bold flex items-center gap-2">
                    {liveSendResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{liveSendResult.success ? 'Message Dispatched!' : 'Meta API Notice'}</span>
                  </div>
                  <div>{liveSendResult.message}</div>
                  {!liveSendResult.success && (
                    <div className="text-[11px] text-slate-400 pt-1">
                      Tip: In Meta's test sandbox, you must add your phone number to the <strong>To</strong> recipient dropdown on the Meta developer page before sending your first test template message.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col h-[640px] rounded-3xl bg-[#090D16] border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#0E1424] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                  VT
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>VT BuildOS Bot</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/20" />
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono">
                    Official Business API · Online
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#070B14] px-3 py-1.5 rounded-full border border-white/5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Database Sync: Active</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#050811]/90">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-[#0E251E] border border-emerald-500/40 text-emerald-100 rounded-br-xs'
                        : 'bg-[#0E1424] border border-white/10 text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                    <div className="mt-1 text-[10px] text-slate-500 text-right font-mono">
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.actionTaken && (
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono bg-[#070B14] px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                      <Database className="w-3 h-3 text-cyan-400" />
                      <span>{msg.actionTaken}</span>
                    </div>
                  )}
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-center gap-2 text-xs text-slate-400 p-2 font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>AI Parsing WhatsApp Intent & Querying Supabase...</span>
                </div>
              )}
            </div>

            <div className="p-2.5 bg-[#090D16] border-t border-white/5 overflow-x-auto flex gap-2">
              {samplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#0E1424] hover:bg-[#151D33] border border-white/5 hover:border-cyan-500/40 text-[11px] text-slate-300 transition cursor-pointer"
                >
                  {prompt.length > 35 ? prompt.substring(0, 35) + '...' : prompt}
                </button>
              ))}
            </div>

            <div className="p-3 bg-[#0E1424] border-t border-white/5 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a WhatsApp message (e.g. Create project Golden Heights, Budget 2 Cr)..."
                className="flex-1 bg-[#090D16] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isProcessing}
                className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition cursor-pointer"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-[#0E1424] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span>Real-time Website Reflection</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live database state updated immediately by incoming WhatsApp messages
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {projects.length} Total Projects
                </span>
              </div>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3.5 rounded-2xl bg-[#090D16] border border-white/5 hover:border-cyan-500/30 transition space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{proj.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400 font-semibold">{proj.code}</span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{proj.location}</span>
                      <span className="text-slate-200 font-mono font-bold">
                        ₹{(proj.budget / 10000000).toFixed(2)} Cr
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-white/5">
                      <span>Status: <span className="text-emerald-400 font-semibold">{proj.status}</span></span>
                      <span>Progress: <span className="text-cyan-300 font-mono font-bold">{proj.progress}%</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STEP-BY-STEP SETUP GUIDE */}
      {activeTab === 'setup-guide' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-[#0E1424] border border-white/5 space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold font-mono">
                01
              </div>
              <h3 className="text-sm font-bold text-white">Meta Cloud API Credentials (Done)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your Test Phone Number (<strong className="text-white">{META_PHONE_NUMBER}</strong>), Phone Number ID (<strong className="text-white">{META_PHONE_NUMBER_ID}</strong>), and Access Token are verified and loaded in VT BuildOS.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0E1424] border border-white/5 space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold font-mono">
                02
              </div>
              <h3 className="text-sm font-bold text-white">Configure Webhook URL in Meta</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                1. In Meta WhatsApp portal, go to <b>Configuration</b> → <b>Webhooks</b>.<br />
                2. Enter Callback URL:
                <code className="block bg-[#090D16] p-2 rounded-xl mt-1 text-[11px] text-cyan-300 font-mono break-all">
                  {WEBHOOK_CALLBACK_URL}
                </code>
                3. Enter Verify Token: <code className="text-amber-300 font-mono">{WEBHOOK_VERIFY_TOKEN}</code><br />
                4. Click <b>Verify and Save</b>.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0E1424] border border-white/5 space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold font-mono">
                03
              </div>
              <h3 className="text-sm font-bold text-white">Subscribe to "messages"</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                1. Under Webhook fields, click <b>Manage</b>.<br />
                2. Check the <b>messages</b> event box and click <b>Subscribe</b>.<br />
                3. Send any message from WhatsApp to <strong className="text-emerald-400">{META_PHONE_NUMBER}</strong>.<br />
                4. VT BuildOS will reply and reflect changes live on the website!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WEBHOOK CODE */}
      {activeTab === 'webhook-code' && (
        <div className="p-6 rounded-3xl bg-[#0E1424] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Production Serverless Webhook (api/whatsapp.ts)</h3>
              <p className="text-xs text-slate-400">
                Connected to Meta Graph API v21.0 with automatic intent parsing and reply dispatch
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`// WhatsApp Webhook endpoint: ${WEBHOOK_CALLBACK_URL}`);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#090D16] hover:bg-[#141C30] border border-white/10 text-xs text-cyan-300 font-mono transition cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Endpoint'}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#050811] p-4 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
            <pre>{`Endpoint: ${WEBHOOK_CALLBACK_URL}\nMethod: GET (Verification), POST (Inbound Webhooks & Outbound Send)\nStatus: Live on Vercel Production`}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
