  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAa2KFjzxDbjvgtOfoNV9pHczDtRytV08k",
    authDomain: "noghokhashi.firebaseapp.com",
    projectId: "noghokhashi",
    storageBucket: "noghokhashi.firebasestorage.app",
    messagingSenderId: "376954968093",
    appId: "1:376954968093:web:94092dddcfc2843cbf8ef4",
    measurementId: "G-F40RS65ZDD"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);