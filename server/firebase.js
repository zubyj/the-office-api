

const { getAnalytics } = require('@firebase/analytics');
const firebase = require('firebase/app');

require('firebase/analytics');

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "the-office-script-api.firebaseapp.com",
    projectId: "the-office-script-api",
    storageBucket: "the-office-script-api.appspot.com",
    messagingSenderId: "173776058994",
    appId: process.env.FIREBASE_APP_ID,
    measurementId: "G-20BJSRT974"
};

const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
module.exports = analytics;
