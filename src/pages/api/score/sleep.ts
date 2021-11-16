import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  setTimeout(() => {
    if (req.method === 'POST') {
      if (Math.random() < 0.1) {
        res.status(500).json({
          error: 'Server Busy',
          errorMsg: 'Servers are busy. Please try after sometime!',
        });
      } else {
        res.status(200).json({ sleepScore: Math.floor(Math.random() * 100) });
      }
    } else {
      res
        .status(400)
        .json({ error: 'Invalid Route', errorMsg: 'Invalid request payload.' });
    }
  }, 2000);
}
