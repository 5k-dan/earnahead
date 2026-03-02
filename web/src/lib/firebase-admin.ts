import * as admin from "firebase-admin";
import serviceAccount from "../../earnahead-firebase-adminsdk-fbsvc-787bf43502.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const adminDb = admin.firestore();