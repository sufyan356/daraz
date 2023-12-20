import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore , doc  ,collection, addDoc , getDocs , getDoc , updateDoc , onSnapshot   } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyDnL1QO4hHQbdr_-iqjVRbNgGOUQb8lSjw",
  authDomain: "e-commerece-d1da6.firebaseapp.com",
  projectId: "e-commerece-d1da6",
  storageBucket: "e-commerece-d1da6.appspot.com",
  messagingSenderId: "441885728322",
  appId: "1:441885728322:web:a8c5cd02a60335fc0697db"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


async function abc () {
  const querySnapshot = await getDocs(collection(db, "productDetails"));
  querySnapshot.forEach((products) => {
   console.log(products.data().productID)

  })
}
abc()
