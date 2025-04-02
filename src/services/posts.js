import { db } from "./firebase";
import { collection, addDoc, getDoc, doc,} from "firebase/firestore";

/**
 * @param {{ title: string, description: string, imageUrl: string, userEmail: string }} postData
 * @returns {Promise<void>}
 */
export async function createPost(postData) {
  const postsRef = collection(db, "posts");
  await addDoc(postsRef, postData);
}

/**
 * @param {string} id
 * @returns {Promise<{ id: string, title: string, description: string, imageUrl: string, userEmail: string }>}
 */
export async function getPostById(id) {
  const postRef = doc(db, "posts", id);
  const postDoc = await getDoc(postRef);
  if (postDoc.exists()) {
    return { id: postDoc.id, ...postDoc.data() };
  } else {
    throw new Error("Post not found");
  }
}
