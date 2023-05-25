// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import FirebaseAdmin from '../../../mode/firebase_admin'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  FirebaseAdmin.getInstance().Firebase.collection('test');
  res.status(200).json({ name: 'John Doe' })
}
