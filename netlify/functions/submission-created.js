const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const params = new URLSearchParams(event.body);
    const data = {
      firstName: params.get('firstName'),
      surname: params.get('surname'),
      email: params.get('email'),
      phone: params.get('phone'),
      totalPax: params.get('totalPax'),
      accommodation: params.get('accommodation'),
      customAccommodation: params.get('customAccommodation'),
      eveningShuttle: params.get('eveningShuttle'),
      additionalServices: params.get('additionalServices'),
      airportTransferType: params.get('airportTransferType'),
      timestamp: new Date().toLocaleString()
    };

    // 1. Send Email via SendGrid
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: 'Adam@overbergtransfers.com',
        from: 'info@overbergtransfers.com', // Must be verified in SendGrid
        subject: `New Wedding RSVP: ${data.firstName} ${data.surname}`,
        text: `
          New Wedding Transport RSVP Received:
          ----------------------------------
          Name: ${data.firstName} ${data.surname}
          Email: ${data.email}
          Phone: ${data.phone}
          Total Pax: ${data.totalPax}
          Accommodation: ${data.accommodation === 'Other Accommodation' ? data.customAccommodation : data.accommodation}
          Evening Shuttle: ${data.eveningShuttle}
          Services: ${data.additionalServices}
          ${data.airportTransferType ? `Airport Transfer: ${data.airportTransferType}` : ''}
          Timestamp: ${data.timestamp}
        `,
      };
      await sgMail.send(msg);
    }

    // 2. Send WhatsApp via Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'}`,
        to: `whatsapp:${process.env.BUSINESS_PHONE || '+27795036849'}`,
        body: `*New Wedding RSVP*\n*Name:* ${data.firstName} ${data.surname}\n*Pax:* ${data.totalPax}\n*Shuttle:* ${data.eveningShuttle}\n*Stay:* ${data.accommodation}`
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Submission processed successfully" })
    };
  } catch (error) {
    console.error("Error processing submission:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process submission" })
    };
  }
};