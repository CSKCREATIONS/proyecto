const nodemailer = require('nodemailer');

module.exports = async function enviarCorreo(destinatario, pdfPath) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tucorreo@gmail.com',
      pass: 'tu_contraseña',
    }
  });

  await transporter.sendMail({
    from: 'Cotizaciones <tucorreo@gmail.com>',
    to: destinatario,
    subject: 'Cotización Enviada',
    text: 'Adjunto encontrará su cotización.',
    attachments: [{ path: pdfPath }]
  });
};
