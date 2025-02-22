import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { createUserDb } from "./Firestore";

export const registerUser = async (email, password, data) => {
    return createUserWithEmailAndPassword(auth, email, password)
        .then(creds => {
            console.log(creds);
            createUserDb(creds.user.uid, data);
        });
}

export const loginUser = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const logOutUser = async () => {
    return signOut(auth);
}