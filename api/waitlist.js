export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, waitlist_id } = req.body;

  if (!email || !waitlist_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://glassnotes-headquarters.vercel.app/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, waitlist_id }),
    });

    const data = await response.json();
    
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Waitlist proxy error:', error);
    return res.status(500).json({ error: 'Failed to connect to waitlist service' });
  }
}
