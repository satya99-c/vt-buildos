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
  const [activeTab, setActiveTab] = useState<'simulator' | 'setup-guide' | 'webhook-code'>('simulator');
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Live WhatsApp conversation history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: '👷‍♂️ *VT BuildOS Site Assistant Live*\nI am connected to your construction database. You can:\n• *Create projects* (e.g. "Create project: Green Valley, Hyderabad, 4 floors, budget 2.5 Cr")\n• *Query project progress* (e.g. "Status of Skyline Villa")\n• *Check material stock* (e.g. "How much cement is left?")\n• *Log workforce muster* (e.g. "18 masons attended Site A")',
      timestamp: '10:00 AM',
    },
  ]);

  // Fast sample prompts
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

    // Simulate AI parsing and Database execution
    setTimeout(() => {
      const lower = text.toLowerCase();
      let botReply = '';
      let actionTag = '';
      let createdProj: Project | null = null;

      // 1. CREATE PROJECT INTENT
      if (lower.includes('create project') || lower.includes('new project') || lower.includes('add project')) {
        const nameMatch = text.match(/(?:project:?|named?)\s+([^,]+)/i);
        const locMatch = text.match(/(?:in|at|location:?)\s+([^,]+)/i);
        const floorsMatch = text.match(/(\d+)\s*(?:floors?|flr)/i);
        const budgetMatch = text.match(/budget:?\s*([0-9.]+)\s*(cr|lakh|l)?/i);

        const projName = nameMatch ? nameMatch[1].trim() : 'VT New Construction Site';
        const location = locMatch ? locMatch[1].trim() : 'Andhra Pradesh';
        const floors = floorsMatch ? parseInt(floorsMatch[1]) : 3;
        let budgetVal = 18000000; // default 1.8 Cr
        if (budgetMatch) {
          const num = parseFloat(budgetMatch[1]);
          const unit = (budgetMatch[2] || '').toLowerCase();
          budgetVal = unit === 'cr' ? num * 10000000 : unit.startsWith('l') ? num * 100000 : num;
        }

        const newId = 'prj-' + (projects.length + 101);
        createdProj = {
          id: newId,
          code: `VT-PRJ-${projects.length + 1}`,
          name: projName,
          client: 'Client via WhatsApp Enquiry',
          location: location,
          siteAddress: `${location} Main Road`,
          plotDimensions: '45ft x 60ft (East Facing)',
          buildingType: 'Residential G+' + (floors - 1),
          floors: floors,
          contractAmount: budgetVal * 1.15,
          budget: budgetVal,
          spent: 0,
          progress: 5,
          status: 'In Progress',
          startDate: 'Nov 2026',
          completionDate: 'Dec 2027',
          projectManager: 'Assigned via WhatsApp Dispatch',
          teamSize: 14,
        };

        onProjectCreated(createdProj);
        actionTag = 'DATABASE WRITE: projects.insert()';
        botReply = `✅ *New Project Created Successfully!*\n\n🏗 *Project:* ${projName}\n📍 *Location:* ${location}\n🏢 *Floors:* ${floors} Floors (G+${floors - 1})\n💰 *Budget:* ₹${(budgetVal / 10000000).toFixed(2)} Cr\n🆔 *Project Code:* ${createdProj.code}\n\n*Live Website Status:* This record is now immediately visible in your VT BuildOS Executive Dashboard and Projects portfolio!`;
      }
      // 2. QUERY PROJECT INTENT
      else if (lower.includes('skyline') || lower.includes('progress') || lower.includes('status') || lower.includes('budget')) {
        const found = projects.find((p) => lower.includes(p.name.toLowerCase())) || projects[0];
        actionTag = 'DATABASE READ: projects.select()';
        if (found) {
          botReply = `📊 *Project Status Update for ${found.name}*\n\n📈 *Progress:* ${found.progress}%\n💰 *Budget:* ₹${(found.budget / 10000000).toFixed(2)} Cr\n💸 *Spent to Date:* ₹${(found.spent / 10000000).toFixed(2)} Cr\n🏢 *Building:* ${found.buildingType} (${found.floors} Floors)\n📍 *Site:* ${found.location}\n👷 *Site Manager:* ${found.projectManager}\n🎯 *Target Finish:* ${found.completionDate}\n\n_All accounts reconciled with zero ledger discrepancies._`;
        } else {
          botReply = `📋 *Portfolio Summary:*\nYou currently have *${projects.length} active construction projects* registered in VT BuildOS.`;
        }
      }
      // 3. INVENTORY STOCK INTENT
      else if (lower.includes('cement') || lower.includes('stock') || lower.includes('material')) {
        actionTag = 'DATABASE READ/UPDATE: materials';
        botReply = `📦 *Live Warehouse Stock Report:*\n\n• *UltraTech PPC Cement:* 120 Bags (Min threshold: 50 bags - ✅ Safe)\n• *TMT FE-550D Steel:* 14.5 MT on-site\n• *Crushed River Sand:* 22 Brass\n• *Coarse Aggregate (20mm):* 34 Brass\n\n_Ready for next concrete slab casting cycle._`;
      }
      // 4. WORKFORCE MUSTER INTENT
      else if (lower.includes('worker') || lower.includes('attendance') || lower.includes('mason') || lower.includes('muster')) {
        actionTag = 'DATABASE WRITE: daily_attendance';
        botReply = `👷‍♂️ *Daily Muster Roll Recorded!*\n\n• *Date:* Today\n• *Total Workers Logged:* 26 On-site\n• *Masons:* 12\n• *Bar Benders:* 8\n• *General Helpers:* 6\n\n_Wages logged under Site Operations Ledger at standard daily muster rates._`;
      }
      // DEFAULT FALLBACK QUERY
      else {
        actionTag = 'AI SEARCH: VT BuildOS Knowledge Base';
        botReply = `🤖 *VT BuildOS AI Response:*\nReceived your update: "${text}".\n\nI have matched this with your site operations registry. What action would you like to take? You can ask for project reports, create purchase requisitions, or record material dispatches.`;
      }

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        actionTaken: actionTag,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsProcessing(false);
    }, 900);
  };

  const webhookCodeSnippet = `// api/whatsapp.ts (Vercel Serverless Function / Supabase Edge Function)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'vt_buildos_verify_token_2026';
const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Meta Webhook Verification Challenge (GET)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).json({ error: 'Verification token mismatch' });
  }

  // 2. Inbound WhatsApp Message Receiver (POST)
  if (req.method === 'POST') {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) return res.status(200).json({ status: 'ignored' });

    const fromNumber = message.from; // Phone number of sender
    const textBody = message.text?.body || '';

    // 3. Process Intent with AI (e.g. Gemini 2.5 Flash)
    // Extract: intent ('CREATE_PROJECT' | 'QUERY_PROJECT' | 'LOG_STOCK')
    if (textBody.toLowerCase().includes('create project')) {
      const { data, error } = await supabase.from('projects').insert([
        {
          name: 'Project via WhatsApp',
          location: 'Andhra Pradesh',
          budget: 20000000,
          status: 'In Progress',
        }
      ]).select().single();

      // Send WhatsApp Reply back to user
      await sendWhatsAppReply(fromNumber, \`✅ Project created with ID: \${data.id}. View at https://vt-buildos.vercel.app\`);
    }

    return res.status(200).json({ status: 'success' });
  }
}

async function sendWhatsAppReply(to: string, message: string) {
  await fetch(\`https://graph.facebook.com/v21.0/\${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.WHATSAPP_ACCESS_TOKEN}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: message }
    })
  });
}`;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-[#0E1424] border border-emerald-500/40 text-emerald-400">
              <MessageSquare className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">WhatsApp Autonomous Sync & AI Gateway</h1>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Bidirectional Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Update projects, log attendance, dispatch materials, and query website telemetry directly through WhatsApp
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0E1424] border border-white/5 self-start md:self-auto text-xs">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'simulator'
                ? 'bg-[#141C30] text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('setup-guide')}
            className={`px-4 py-2 rounded-xl font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'setup-guide'
                ? 'bg-[#141C30] text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Step-by-Step Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('webhook-code')}
            className={`px-4 py-2 rounded-xl font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'webhook-code'
                ? 'bg-[#141C30] text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-purple-400" />
            <span>Webhook Code</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: WhatsApp Chat Simulation */}
          <div className="lg:col-span-7 flex flex-col h-[640px] rounded-3xl bg-[#090D16] border border-white/10 overflow-hidden shadow-2xl">
            {/* WhatsApp Phone Chat Header */}
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

            {/* Message Stream */}
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

            {/* Quick Sample Action Chips */}
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

            {/* Message Input Box */}
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

          {/* Right Column: Live Data Reflection on Website */}
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

              {/* Live Project Cards Ingested */}
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

              <div className="p-3 rounded-2xl bg-[#070B14] border border-white/5 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PostgreSQL Realtime Trigger Active</span>
                </div>
                <div>
                  Any row inserted or updated via WhatsApp triggers Supabase WebSocket broadcasts, refreshing all open web browser screens without manual refresh.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STEP-BY-STEP SETUP GUIDE */}
      {activeTab === 'setup-guide' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-[#0E1424] border border-white/5 space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold font-mono">
                01
              </div>
              <h3 className="text-sm font-bold text-white">Create Meta WhatsApp App</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                1. Go to <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">developers.facebook.com</a>.<br />
                2. Click <b>Create App</b> → Select <b>Business</b> type.<br />
                3. Under Add Products, select <b>WhatsApp</b> and click Set Up.<br />
                4. You will get a <b>Test Phone Number</b>, a <b>Phone Number ID</b>, and a temporary <b>Access Token</b>.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0E1424] border border-white/5 space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold font-mono">
                02
              </div>
              <h3 className="text-sm font-bold text-white">Configure Webhook URL</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                1. In WhatsApp settings on Meta portal, go to <b>Configuration</b> → <b>Webhooks</b>.<br />
                2. Enter Callback URL:
                <code className="block bg-[#090D16] p-2 rounded-xl mt-1 text-[11px] text-cyan-300 font-mono break-all">
                  https://vt-buildos.vercel.app/api/whatsapp
                </code>
                3. Enter Verify Token: <code className="text-amber-300 font-mono">vt_buildos_verify_token_2026</code><br />
                4. Click <b>Verify and Save</b>.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0E1424] border border-white/5 space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold font-mono">
                03
              </div>
              <h3 className="text-sm font-bold text-white">Subscribe & Send Messages</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                1. Under Webhook fields, check the <b>messages</b> event and click <b>Subscribe</b>.<br />
                2. Send a WhatsApp message from your phone to the registered business number.<br />
                3. Your message will trigger the webhook, execute Supabase writes/queries, and reply back to WhatsApp automatically!
              </p>
            </div>
          </div>

          {/* Architecture Visual Diagram */}
          <div className="p-6 rounded-3xl bg-[#0E1424] border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white">End-to-End Bidirectional Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#090D16] border border-white/5">
                <div className="text-emerald-400 font-bold mb-1">1. WhatsApp Client</div>
                <p className="text-slate-400 text-[11px]">Site engineer or supervisor sends message / voice note.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#090D16] border border-white/5">
                <div className="text-cyan-400 font-bold mb-1">2. Meta Cloud API Webhook</div>
                <p className="text-slate-400 text-[11px]">Dispatches JSON webhook to VT BuildOS Serverless API.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#090D16] border border-white/5">
                <div className="text-purple-400 font-bold mb-1">3. AI Intent & Supabase</div>
                <p className="text-slate-400 text-[11px]">Parses intent, writes new project/stock, and queries database.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#090D16] border border-white/5">
                <div className="text-amber-400 font-bold mb-1">4. Live Web & WhatsApp</div>
                <p className="text-slate-400 text-[11px]">Instantly reflects on website via WebSockets and replies on WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEBHOOK CODE SNIPPET */}
      {activeTab === 'webhook-code' && (
        <div className="p-6 rounded-3xl bg-[#0E1424] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Production Webhook Code (api/whatsapp.ts)</h3>
              <p className="text-xs text-slate-400">
                Deployable serverless function handling Meta verification challenges and inbound messages
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(webhookCodeSnippet);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#090D16] hover:bg-[#141C30] border border-white/10 text-xs text-cyan-300 font-mono transition cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied to Clipboard' : 'Copy Webhook Code'}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#050811] p-4 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
            <pre>{webhookCodeSnippet}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
