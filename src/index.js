import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions } from 'firebase/functions';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoGBRxDrT2BZakbb2Qh0ulAtOhCJVerxQ",
  authDomain: "music-listening-times-2.firebaseapp.com",
  projectId: "music-listening-times-2",
  storageBucket: "music-listening-times-2.appspot.com",
  messagingSenderId: "705822670193",
  appId: "1:705822670193:web:bcb0c33cd9354d7daf8ad0",
  measurementId: "G-GBMDV09M6T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
