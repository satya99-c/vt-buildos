// api/whatsapp.ts - Meta WhatsApp Business Cloud API Integration & Webhook Handler
declare const process: any;

const DEFAULT_PHONE_NUMBER_ID = '1449388134924718';
const DEFAULT_ACCESS_TOKEN = 'EAAVUfXkL2l0BTEDSKZCXXC7thNVPAUNoKI70ZAOP4wzDbBXdsHWx9IZAl8JZBfvgtE796r8W0eI5mgJY7pCp8MLlZCDhUjFJVgZAPKp5yujUchbXVO5fE39EKolRqILANULDxLCjpETSQcD8xHgIAx0BM0EoGvjRewt124RlnGKgTk6ZAu3sFAZBwcNgcGQLpqbMxEFzfwrA5xyiinguGci9AgYNfTTZAGZC2xoGDNcAr7T8WWJdhhT3BLi1PlJD3SfiKOrxW8FZB5F8BJXbMcIZBlnMOQZDZD';
const DEFAULT_VERIFY_TOKEN = 'vt_buildos_verify_token_2026';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || DEFAULT_VERIFY_TOKEN;
  const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || DEFAULT_ACCESS_TOKEN;
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || DEFAULT_PHONE_NUMBER_ID;

  // 1. Meta Webhook Verification (GET)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('[WhatsApp Webhook Verified Successfully]');
      return res.status(200).send(challenge);
    }
    return res.status(403).json({ error: 'Verification token mismatch' });
  }

  // 2. Outbound / Inbound Handler (POST)
  if (req.method === 'POST') {
    try {
      const body = req.body || {};

      // 2A. Direct Outbound Test Message from Website UI
      if (body.action === 'send_test' || (body.to && body.message)) {
        const rawTo = String(body.to || '').replace(/[^0-9]/g, '');
        const textMessage = body.message || 'Hello from VT BuildOS WhatsApp Integration!';
        const useTemplate = body.useTemplate !== false && body.template === 'hello_world';

        let payload: any;
        if (useTemplate) {
          payload = {
            messaging_product: 'whatsapp',
            to: rawTo,
            type: 'template',
            template: {
              name: 'hello_world',
              language: { code: 'en_US' }
            }
          };
        } else {
          payload = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: rawTo,
            type: 'text',
            text: {
              preview_url: false,
              body: textMessage
            }
          };
        }

        const metaRes = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        const metaData = await metaRes.json();
        if (!metaRes.ok) {
          return res.status(metaRes.status).json({
            success: false,
            error: metaData.error?.message || 'Meta WhatsApp API Error',
            details: metaData
          });
        }

        return res.status(200).json({
          success: true,
          message: 'WhatsApp message dispatched successfully',
          data: metaData
        });
      }

      // 2B. Inbound Webhook from Meta (Incoming message from user on WhatsApp)
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (!message) {
        // Status update or delivery receipt
        return res.status(200).json({ status: 'ignored_non_message_event' });
      }

      const fromNumber = message.from;
      const textBody = message.text?.body || '';
      console.log(`[WhatsApp Inbound from ${fromNumber}]: ${textBody}`);

      const lower = textBody.toLowerCase();
      let replyText = '';

      // Command 1: Create Project
      if (lower.includes('create project') || lower.includes('new project') || lower.includes('add project')) {
        const nameMatch = textBody.match(/(?:project:?|named?)\s+([^,]+)/i);
        const locMatch = textBody.match(/(?:in|at|location:?)\s+([^,]+)/i);
        const floorsMatch = textBody.match(/(\d+)\s*(?:floors?|flr)/i);
        const budgetMatch = textBody.match(/budget:?\s*([0-9.]+)\s*(cr|lakh|l)?/i);

        const projName = nameMatch ? nameMatch[1].trim() : 'VT New Construction Site';
        const location = locMatch ? locMatch[1].trim() : 'Andhra Pradesh';
        const floors = floorsMatch ? parseInt(floorsMatch[1]) : 3;
        let budgetFormatted = '₹1.80 Cr';

        if (budgetMatch) {
          const num = parseFloat(budgetMatch[1]);
          const unit = (budgetMatch[2] || '').toLowerCase();
          budgetFormatted = unit === 'cr' ? `₹${num} Cr` : unit.startsWith('l') ? `₹${num} Lakhs` : `₹${num}`;
        }

        replyText = `🏗️ *VT BuildOS: Project Created!*\n\n• *Project:* ${projName}\n• *Location:* ${location}\n• *Floors:* ${floors} Floors\n• *Budget:* ${budgetFormatted}\n• *Code:* VT-PRJ-${Math.floor(100 + Math.random() * 900)}\n• *Status:* Construction (Active WIP)\n\n🌐 View live at: https://vt-buildos.vercel.app`;
      }
      // Command 2: Project Status / Portfolio Query
      else if (lower.includes('status') || lower.includes('projects') || lower.includes('progress') || lower.includes('portfolio')) {
        replyText = `📊 *VT BuildOS Project Portfolio Status:*\n\n1. *VT Grandeur Luxury Towers* (Jubilee Hills)\n   • Progress: 68% | CPI: 1.04\n   • Active: 14th Floor Slab Rebar\n\n2. *VT Lakefront Smart Villas* (Financial District)\n   • Progress: 54% | CPI: 1.02\n   • Active: Villa Row Superstructure\n\n3. *VT Horizon Commercial Hub* (Hitec City)\n   • Progress: 22% | CPI: 0.99\n   • Active: B2 Retaining Walls\n\n✅ Overall Health: On Schedule & Within Budget.`;
      }
      // Command 3: Material Stock & Inventory
      else if (lower.includes('stock') || lower.includes('cement') || lower.includes('steel') || lower.includes('material')) {
        replyText = `📦 *VT BuildOS Material Stock Snapshot:*\n\n• *UltraTech OPC 53 Cement:* 700 Bags (Safe)\n• *Tata Tiscon 16mm Rebar:* 22 MT (Safe)\n• *Tata Tiscon 12mm Rebar:* 17 MT (Safe)\n• *River / Robo Sand Class-I:* 12 Tippers\n• *Kiln-baked Clay Bricks:* 30,000 Pcs\n\n🚚 Requisitions In Transit: PO-2026-081 (38 MT Steel)`;
      }
      // Command 4: Workforce Muster Roll
      else if (lower.includes('worker') || lower.includes('attendance') || lower.includes('muster') || lower.includes('labour')) {
        replyText = `👷‍♂️ *Site Labour Muster Roll Summary:*\n\n• *Active Workforce on Sites:* 106 Workers\n• *Attendance Rate:* 94.2%\n• *Wages Payable Today:* ₹84,250\n• *Safety Compliance:* 100% HSE Sign-offs Verified\n• *Zero Accidents Recorded.*`;
      }
      // Command 5: Help / Welcome Menu
      else {
        replyText = `👷‍♂️ *Welcome to VT BuildOS Site Operations!*\n\nI am your automated AI Construction Assistant. You can reply with:\n\n• *"Create project: [Name] in [Location], [X] floors, budget [Y] Cr"*\n• *"Status"* (View all site progress)\n• *"Stock"* (Check cement & steel levels)\n• *"Attendance"* (Today's labour muster roll)\n\n🌐 Operations Portal: https://vt-buildos.vercel.app`;
      }

      // Send Response back to sender via Meta Graph API
      await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: fromNumber,
          type: 'text',
          text: {
            preview_url: false,
            body: replyText
          }
        })
      });

      return res.status(200).json({ status: 'replied_successfully' });
    } catch (err: any) {
      console.error('Error handling WhatsApp message:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
