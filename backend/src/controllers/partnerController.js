import Partner from '../models/Partner.js';
import { sendEmail } from '../utils/emailService.js';

export const registerPartner = async (req, res) => {
  try {
    const { organization, email, phone, website, message } = req.body;
    const existing = await Partner.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Already registered' });
    }
    const partner = await Partner.create({ organization, email, phone, website, message });
    // Send notification to admin
    await sendEmail({
      to: 'partners@crisissolver.com',
      subject: 'New partner registration',
      text: `${organization} (${email}) wants to partner.`,
    });
    res.status(201).json({ message: 'Registration successful, we will contact you soon.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort('-createdAt');
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};