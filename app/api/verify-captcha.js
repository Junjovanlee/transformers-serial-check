import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { captcha } = req.body;
  const secretKey = '6Ld_rgArAAAAAMD1NGtDqigL6qcyKfaiArskGUU5'; // Secret key Anda

  const googleVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

  try {
    const response = await fetch(googleVerificationUrl, {
      method: 'POST',
    });

    const data = await response.json();

    if (data.success) {
      res.status(200).json({ message: 'CAPTCHA valid', status: 'success' });
    } else {
      res.status(400).json({ message: 'Invalid CAPTCHA', status: 'error' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', status: 'error' });
  }
}
