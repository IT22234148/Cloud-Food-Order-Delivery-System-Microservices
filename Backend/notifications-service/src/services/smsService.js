export async function sendWhatsApp(to, body) {
  try {
    console.log(`📱 [MOCK WhatsApp] To: ${to} | Message: ${body}`);
  } catch (error) {
    console.error('❌ WhatsApp mock error:', error);
  }
}