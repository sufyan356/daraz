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

const cardsData = async () => {
    let cardMini = document.querySelector("#cardMini");
    const productsQuerySnapshot = await getDocs(collection(db, "Quantity"));
        for (const productDoc of productsQuerySnapshot.docs) {
            // console.log(productDoc.data().img)
            cardMini.innerHTML +=`
            <div class="card" style="width: 18rem;" id = "shopCards">
                <img src="${productDoc.data().img}" class="card-img-top" alt="..." id = "cartsImage">
                <div class="card-body">
                <h5 class="card-title">Price: ${productDoc.data().price}</h5>
                <p class="card-text">Quantity: ${productDoc.data().quantity}</p>
                </div>
            </div>
            `
        }
  };
  
  window.addEventListener("DOMContentLoaded", cardsData);
  
  
