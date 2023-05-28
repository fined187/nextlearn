import { useEffect, useState } from "react";
import { InAuthUser } from "../model/in_auth_user";
import { GoogleAuthProvider, User, signInWithPopup } from "firebase/auth";
import FirebaseClient from "../model/firebase_client";

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<InAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const signInResult = await signInWithPopup(FirebaseClient.getInstance().Auth, provider);
      if(signInResult.user) {
        console.info(signInResult.user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signOut = () => FirebaseClient.getInstance().Auth.signOut().then(clear);

  const onAuthStateChanged = async (authState: User | null) => {
    if(authState === null) {
      setAuthUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setAuthUser({
      uid: authState.uid,
      email: authState.email,
      photoURL: authState.photoURL,
      displayName: authState.displayName
    });
    setLoading(false);
  }

  useEffect(() => {
    const unsubbscribe = FirebaseClient.getInstance().Auth.onAuthStateChanged(onAuthStateChanged);
    return () => unsubbscribe();
  }, [])
  return {
    authUser,
    loading,
    signInWithGoogle,
    signOut,
  }
};