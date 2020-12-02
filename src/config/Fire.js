import firebase from "firebase";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLF2We_YMvjePih3tohzt5XpY77EQpnGQ",
  authDomain: "budget-calculator-app-fb7c7.firebaseapp.com",
  databaseURL: "https://budget-calculator-app-fb7c7.firebaseio.com",
  projectId: "budget-calculator-app-fb7c7",
  storageBucket: "budget-calculator-app-fb7c7.appspot.com",
  messagingSenderId: "526469786208",
  appId: "1:526469786208:web:47c557476e73c343bc3105",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

firebase.firestore();

export default firebase;
