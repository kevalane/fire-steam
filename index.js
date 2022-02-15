// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import admin from 'firebase-admin';
import serviceAccount from './fire-steam-key.js';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebaseConfig from './firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const steamid64 = 'u459020587248067240';
admin.auth().createCustomToken(steamid64).then(customToken => {
  console.log(customToken);
}).catch(err => {
  console.log(err);
});

const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY0NDkzNjM2MCwiZXhwIjoxNjQ0OTM5OTYwLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay04Yjc0OEB0ZXN0LXN0ZWFtLWMwYWExLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstOGI3NDhAdGVzdC1zdGVhbS1jMGFhMS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6InU0NTkwMjA1ODcyNDgwNjcyNDAifQ.NgR1QBsGzsTt1bGxjYg8jh-4GWwbnPlgwhpwz2qwqrI45lo-697zvpOGfrQyMzo7EsKPLqw658RCotC8bj2IcXBC6AVOs_ATsmRTybl_mcYGwl0Th6HKcFcG-t5X4TP2DN_nK1PC3v8IQ9KU55cbImXAVxwHzx0Rvvl5KsgwfjHFy6WcRGvD5g50c3dciKwT7WpWUNaY63AeWpYZY0E9E2WUcOsH40jHzLn4mSbcATFhhRkUqKDzIjp9Nlu08V6BKn4s4mUbOj0uUS7_u78eGkE7E-r_oJV5tmfuPFl83SAT4KXni4RPvOAeyZj5RxsVvMoKbowKcwyMaeEz7YbpIQ';
signInWithCustomToken(auth, token).then(userCredential => {
    console.log(userCredential);
}).catch(err => {
    console.log(err);
});
