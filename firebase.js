
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "dibbz-5dc9d.appspot.com"
  });
}

const db = admin.firestore();

module.exports = { admin, db };
