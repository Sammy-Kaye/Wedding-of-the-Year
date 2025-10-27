import QRCode from 'qrcode';

export const generateQRCode = async (uniqueCode) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(uniqueCode, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 300,
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};
