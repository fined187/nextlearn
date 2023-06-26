import FirebaseAdmin from "../firebase_admin";
import { InAuthUser } from "../in_auth_user";

const MEMBER_COL = "members";
const SCR_NAME_COL = "screen_names";

type addResult =
  | { result: true; id: string }
  | { result: false; message: string };

async function add({
  uid,
  displayName,
  photoURL,
  email,
}: InAuthUser): Promise<addResult> {
  try {
    const screenName = (email as string).replace("@gmail.com", "");
    // await FirebaseAdmin.getInstance().Firebase.doc('screen_names').set({uid, email, displayName: displayName ?? '', photoURL: photoURL ?? ''});
    const addResult =
      await FirebaseAdmin.getInstance().Firestore.runTransaction(
        async (transaction) => {
          const memberRef = FirebaseAdmin.getInstance()
            .Firestore.collection("members")
            .doc("uid");
          const screenNameRef = FirebaseAdmin.getInstance()
            .Firestore.collection("screen_name")
            .doc(screenName);
          const memberDoc = await transaction.get(memberRef);
          if (memberDoc.exists) {
            //  이미 추가된 상태
            return false;
          }
          const addData = {
            uid,
            email,
            displayName: displayName ?? "",
            photoURL: photoURL ?? "",
          };

          await transaction.set(memberRef, addData);
          await transaction.set(screenNameRef, addData);
          return true;
        }
      );

    if (addResult === false) {
      return { result: true, id: uid };
    }
    return { result: true, id: uid };
  } catch (error) {
    console.log(error);
    return { result: false, message: "서버에러" };
  }
}

async function findByScreenName(
  ScreenName: string
): Promise<InAuthUser | null> {
  const memberRef = FirebaseAdmin.getInstance()
    .Firestore.collection(SCR_NAME_COL)
    .doc(ScreenName);

  const memberDoc = await memberRef.get();
  if (memberDoc.exists === false) {
    return null;
  }
  const data = memberDoc.data() as InAuthUser;
  return data;
}

const MemberModel = {
  add,
  findByScreenName,
};

export default MemberModel;
