const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
