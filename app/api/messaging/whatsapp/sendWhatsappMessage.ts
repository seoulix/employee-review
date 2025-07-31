const sendWhatsAppMessage = async (name: string, email: string, phone: string, message: string, feedback: object):Promise<boolean> => {
    try {
        const url = 'https://public.doubletick.io/whatsapp/message/template';
        const options = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: process.env.WHATSAPP_API_KEY
          },
          body: JSON.stringify({
             messages: [
              {
                content: {language: 'en', templateName: 'crcorporate'},
                from: '917428844854',
                to: '918980395256'
              }
            ]
          })
        };
        
       const response = await fetch(url, options)
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('❌ Failed to send message:', data);
        throw new Error(data.message || 'Unknown error');
      }
  
      console.log('✅ Message sent successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      throw error;
    }
  };
  export default sendWhatsAppMessage;