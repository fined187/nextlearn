// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import add from '../../../controller/member.ctrl';
import handleError from '../../../controller/error/handle_error';
import CustomServerError from '../../../controller/error/custom_server_error';
import checkSupportMethod from '../../../controller/error/check_support_method';
import MemberCtrl from '../../../controller/member.ctrl';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const supportMethod = ['POST'];
  try {
    checkSupportMethod(supportMethod, method);
    MemberCtrl.add(req, res);
  } catch (error) {
    console.error(error);
    handleError(error, res);
  }
}
