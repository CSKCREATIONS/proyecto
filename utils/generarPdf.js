const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

module.exports = async function generarPDF(cotizacion) {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, `../pdfs/cotizacion-${cotizacion._id}.pdf`);
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text('COTIZACIÓN', { align: 'center' });
  doc.moveDown();
  doc.text(`Cliente: ${cotizacion.cliente.nombre}`);
  doc.text(`Ciudad: ${cotizacion.cliente.ciudad}`);
  doc.text(`Responsable: ${cotizacion.responsable}`);
  doc.text(`Fecha: ${new Date(cotizacion.fecha).toLocaleDateString()}`);
  doc.moveDown();
  doc.text('Descripción:');
  doc.text(cotizacion.descripcion);
  doc.moveDown();
  doc.text('Condiciones de pago:');
  doc.text(cotizacion.condicionesPago);

  doc.end();
  return filePath;
};
