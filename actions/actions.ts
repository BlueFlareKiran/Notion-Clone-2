"use server";
import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
    await auth.protect();
    const { sessionClaims }= await auth();

    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add({
        title: "New Doc",
    });
    await adminDb
        .collection("users")
        .doc(sessionClaims?.email!)
        .collection("rooms")
        .doc(docRef.id)
        .set({
            userId: sessionClaims?.email!,
            role: "owner",
            createdAt: new Date(),
            roomId: docRef.id,
        });
    // Return the document ID
    return { docId: docRef.id };
}
export async function deleteDocument(roomId: string) {
    auth.protect();
    console.log("deleteDocument", roomId);
    try {
        // deletetibg the document refernce
        await adminDb.collection("documents").doc(roomId).delete();
        const query = await adminDb
            .collectionGroup("rooms")
            .where("roomId", "==", roomId)
            .get();
        const batch = adminDb.batch();
        // deleting the room reference
        query.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        await liveblocks.deleteRoom(roomId);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}
export async function inviteUserToDocument(roomId: string, email: string) {
    auth.protect();
    console.log("inviteUserToDocument", roomId, email);
    try {
        await adminDb
            .collection("users")
            .doc(email)
            .collection("rooms")
            .doc(roomId)
            .set({
                userId: email,
                role: "editor",
                createdAt: new Date().toISOString(),
                roomId,
            });
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}
export async function removeUserFromDocument(roomId:string,email:string) {
    auth.protect();
    console.log("removeduserfromdocument",roomId,email);
    try {
        await adminDb.collection("users").doc(email).collection("rooms").doc(roomId).delete();
    } catch (error) {
        console.error(error);
        return{success:false}
    }

}