import { setDoc, doc, addDoc, collection } from "firebase/firestore"
import { db } from "./firebase"

export const createUserDb = async (userId, userData) => {
    return setDoc(doc(db, "users", userId), userData)
}

export const createUserPin = async (userId, title, description, report, category) => {
    try {
        const docRef = await addDoc(collection(db, "pins"), {
            userId,  // Associate the post with the user
            title,
            description,
            report,
            category,
            timestamp: new Date() // Add a timestamp for sorting
        });
        console.log(docRef)
        return docRef.id; // Return the generated document ID
    } catch (error) {
        console.log(error)
        console.error("Error adding document: ", error);
        throw error; // Ensure error is handled in PostContainer.jsx
    }
};