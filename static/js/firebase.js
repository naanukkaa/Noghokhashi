import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAa2KFjzxDbjvgtOfoNV9pHczDtRytV08k",
  authDomain: "noghokhashi.firebaseapp.com",
  databaseURL: "https://news-123af.europe-west1.firebasedatabase.app/",
  projectId: "noghokhashi",
  storageBucket: "noghokhashi.firebasestorage.app",
  messagingSenderId: "376954968093",
  appId: "1:376954968093:web:94092dddcfc2843cbf8ef4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);