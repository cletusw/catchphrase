const firebaseConfig = {
  apiKey: "AIzaSyD0M-ojBdK5CqlNW_ev6Ap5N8SqrZFbqBg",
  authDomain: "catchprase-419d8.firebaseapp.com",
  databaseURL: "https://catchprase-419d8.firebaseio.com",
  projectId: "catchprase-419d8",
  storageBucket: "catchprase-419d8.appspot.com",
  messagingSenderId: "413575608766",
  appId: "1:413575608766:web:e943324269352a1992a1ef"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.database();
