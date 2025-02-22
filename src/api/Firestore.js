import { setDoc, doc } from "firebase/firestore"
import { db } from "./firebase"

export const createUserDb = async (userId, userData) => {
    return setDoc(doc(db, "users", userId), userData)
}