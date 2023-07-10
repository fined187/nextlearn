// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import handleError from "../../../controller/error/handle_error";
import checkSupportMethod from "../../../controller/error/check_support_method";
import MessageCtrl from "../../../controller/message.ctrl";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const supportMethod = ["POST"];
  try {
    checkSupportMethod(supportMethod, method);
    await MessageCtrl.postReply(req, res);
  } catch (error) {
    console.error(error);
    handleError(error, res);
  }
}
