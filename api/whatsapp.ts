// api/whatsapp.ts - Meta WhatsApp Business Cloud API Webhook Handler
declare const process: any;

export default async function handler(req: any, res: any) {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'vt_buildos_verify_token_2026';

  // 1. Meta Webhook Verification (GET)
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
    try {
      const entry = req.body?.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (!message) {
        return res.status(200).json({ status: 'no_message' });
      }

      const fromNumber = message.from;
      const textBody = message.text?.body || '';

      // Log inbound message for site operations
      console.log(`[WhatsApp Inbound from ${fromNumber}]: ${textBody}`);

      // Optional: Send auto-acknowledgement reply via WhatsApp Cloud API
      const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN;
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

      if (whatsappToken && phoneNumberId) {
        await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${whatsappToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: fromNumber,
            type: 'text',
            text: {
              body: `👷‍♂️ *VT BuildOS Received:* "${textBody}"\nProcessing your site update and synchronizing with database...`
            }
          })
        });
      }

      return res.status(200).json({ status: 'success' });
    } catch (err: any) {
      console.error('Error handling WhatsApp message:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
