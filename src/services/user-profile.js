import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * @param {string} id 
 * @param {{email: string}} data 
 * @returns {Promise<void>}
 */
export async function createUserProfile(id, data) {
    const userRef = doc(db, `users/${id}`);
    try {
        await setDoc(userRef, data);
        console.log('Perfil de usuario creado/actualizado:', data);
    } catch (error) {
        console.error('[user-profile.js createUserProfile] Error al crear/actualizar el perfil del usuario', error);
        throw error;
    }
}

/**
 * @param {string} id 
 * @returns {Promise<{id: string, email: string, role: string|null}>}
 */
 export async function getUserProfileById(uid) {
    try {
      const docRef = doc(db, "users", uid);  // Asegúrate de que la colección y el documento sean correctos
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        console.log("Perfil encontrado:", docSnap.data()); // Revisa qué datos contiene
        return docSnap.data();
      } else {
        console.warn(`No se encontró el perfil para el usuario con UID: ${uid}`);
        return null; // Si no se encuentra el perfil, devolvemos null
      }
    } catch (error) {
      console.error("[user-profile.js getUserProfileById] Error al traer el perfil del usuario", error);
      return null;
    }
  }
/**
 * @param {string} id 
 * @returns {Promise<string|null>}
 */
export async function getUserRole(id) {
    try {
        const userProfile = await getUserProfileById(id); // Llamamos a la función que ya tienes para obtener el perfil
        if (userProfile) {
            return userProfile.role; // Devolvemos el rol del usuario, si existe
        }
        console.error('[user-profile.js getUserRole] Usuario no encontrado o rol no disponible');
        return null; // Si el usuario no se encuentra, devolvemos null
    } catch (error) {
        console.error('[user-profile.js getUserRole] Error al obtener el rol del usuario', error);
        return null; // Si ocurre algún error, devolvemos null
    }
}