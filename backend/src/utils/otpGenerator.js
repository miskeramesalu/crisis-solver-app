import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const generateMFASecret = () => {
  return speakeasy.generateSecret({ length: 20, name: 'CrisisSolver' });
};

export const verifyMFA = (secret, token) => {
  return speakeasy.totp.verify({ secret, encoding: 'base32', token });
};

export const generateQRCode = async (secret, email) => {
  const otpauth = speakeasy.otpauthURL({
    secret: secret.base32,
    label: email,
    issuer: 'CrisisSolver',
  });
  return QRCode.toDataURL(otpauth);
};