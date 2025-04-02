import { addDoc, collection, onSnapshot, serverTimestamp, query, orderBy, } from "firebase/firestore";
import { db } from "./firebase";


/** 
*@param {{email: stringifyQuery, content: string}} data
*@returns {Promise<{id: string}>}
*/
const refChat = collection (db,'chat');
export async function saveChatMessage(data){

    const doc = await addDoc (refChat, {
        ...data,

        created_at: serverTimestamp(),
    });
    return{
        id: doc.id,
    }
}

/**
 * 
 * @param {() => {}} callback 
 * @returns {Unsuscribe}
 */

export function subscribeToChatMessage(callback){

    const refChat = collection (db,'chat');

    const q = query(refChat, orderBy('created_at'));

    return onSnapshot(q, snapshot =>{

        console.log('Snapshot: ', snapshot);
        console.log('Snapshot documents: ', snapshot.docs);
        
        const messages = snapshot.docs.map(doc =>{
            const data = doc.data();
            console.log("DATAAA",data)
    
            return {
                id: doc.id,
                userId: data.UserId, 
                email: data.email,
                content: data.content,
                created_at: data.created_at.toDate(),
            };

        });
        callback(messages);
        console.log('Documents parsed: ', messages)
    });
}