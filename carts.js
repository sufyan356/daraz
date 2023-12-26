import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore , doc  ,collection, addDoc , getDocs , getDoc , updateDoc , onSnapshot , deleteDoc   } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

window.DeleteFunction = async (productId) => {    // window.DeleteFunction  ( function run successfully )
    console.log("delete function run")
    try {
        await deleteDoc(doc(db, "Quantity", productId));
        console.log("Document successfully deleted!");
        window.location.reload()
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
};

let total = 0;
let docRef; // Declare docRef outside the function

window.ItemsSelected = async (event, price, quantity) => {
    let subTotalID = document.querySelector("#subTotalID");
    let totalID = document.querySelector("#totalID");
    const querySnapshot = await getDocs(collection(db, "SelectedItems"));
    querySnapshot.forEach((doc) => {
        console.log(doc.data());
    });

    if (event.target.checked) {
        total += +price * quantity;
        docRef = await addDoc(collection(db, "SelectedItems"), {
            total
        });
        console.log("Document written with ID: ", docRef.id);
    } else {
        if (docRef) { // Check if docRef is defined
            total -= +price * quantity;
            const washingtonRef = doc(db, "SelectedItems", docRef.id);
            await updateDoc(washingtonRef, {
                total
            });
        } else {
            console.warn("docRef is not defined. Unable to update total.");
        }
    }

    subTotalID.innerHTML = total.toFixed(3);
    totalID.innerHTML = total.toFixed(3);
    console.log("totalPrice: " + total.toFixed(3));
};



const cardsData = async () => {
   
    let cardMinis = document.querySelector("#cardMini");
    const productsQuerySnapshot = await getDocs(collection(db, "Quantity"));
        for (const productDoc of productsQuerySnapshot.docs) {
            // console.log(productDoc.data())
            cardMinis.innerHTML +=`
            <div class="card "id = "shopCards">
                <input type="checkbox" id="selectCart" onclick = "ItemsSelected(event , ' ${productDoc.data().price}' , ' ${productDoc.data().quantity}')" >
                <img src="${productDoc.data().img}" class="card-img-top" alt="..." id = "cartsImage">
                <div class="card-body cardsBody ">
                <h5 class="card-title price">Price: ${productDoc.data().price}</h5>
                <p class="card-text">Quantity: ${productDoc.data().quantity}</p>
                <i class="fa-solid fa-trash trash" onclick="DeleteFunction('${productDoc.id}')"></i>
                </div>
            </div>
            `
        }
  };
  const loader = () => {
    setTimeout(() => {
        cardsData()
    },3000)
  }

window.addEventListener("DOMContentLoaded", loader);

///////////////////////////////////////////////////////////
// let total = 0;
// let docRef; // Declare docRef outside the function

// window.ItemsSelected = async (event, price, quantity) => {
//     let subTotalID = document.querySelector("#subTotalID");
//     let totalID = document.querySelector("#totalID");

//     if (event.target.checked) {
//         total += +price * quantity;
//         docRef = await addDoc(collection(db, "SelectedItems"), {
//             total,
//             isChecked: true
//         });
//         console.log("Document written with ID: ", docRef.id);
//     } else {
//         if (docRef) {
//             total -= +price * quantity;
//             const washingtonRef = doc(db, "SelectedItems", docRef.id);
//             await updateDoc(washingtonRef, {
//                 total,
//                 isChecked: false
//             });
//         } else {
//             console.warn("docRef is not defined. Unable to update total.");
//         }
//     }

//     updateTotalUI();
// };

// const updateTotalUI = () => {
//     let subTotalID = document.querySelector("#subTotalID");
//     let totalID = document.querySelector("#totalID");
//     subTotalID.innerHTML = total.toFixed(3);
//     totalID.innerHTML = total.toFixed(3);
//     console.log("totalPrice: " + total.toFixed(3));
// };

// const getCheckedState = async (productId) => {
//     const itemDoc = await getDoc(doc(db, "SelectedItems", productId));
//     return itemDoc.exists() && itemDoc.data().isChecked;
// };

// const cardsData = async () => {
//     let cardMinis = document.querySelector("#cardMini");
//     const productsQuerySnapshot = await getDocs(collection(db, "Quantity"));

//     for (const productDoc of productsQuerySnapshot.docs) {
//         const isChecked = await getCheckedState(productDoc.id);
//         cardMinis.innerHTML += `
//             <div class="card "id="shopCards">
//                 <input type="checkbox" id="${productDoc.id}" onclick="ItemsSelected(event, ${productDoc.data().price}, ${productDoc.data().quantity})" ${isChecked ? 'checked' : ''}>
//                 <img src="${productDoc.data().img}" class="card-img-top" alt="..." id="cartsImage">
//                 <div class="card-body cardsBody ">
//                     <h5 class="card-title price">Price: ${productDoc.data().price}</h5>
//                     <p class="card-text">Quantity: ${productDoc.data().quantity}</p>
//                     <i class="fa-solid fa-trash trash" onclick="DeleteFunction('${productDoc.id}')"></i>
//                 </div>
//             </div>
//         `;
//     }
// };

// const loader = () => {
//     setTimeout(async () => {
//         await cardsData();
//         const selectedItemsCollection = collection(db, "SelectedItems");
//         const selectedItemsQuerySnapshot = await getDocs(selectedItemsCollection);

//         selectedItemsQuerySnapshot.forEach((itemDoc) => {
//             total += itemDoc.data().total;
//             const checkbox = document.getElementById(itemDoc.id);
//             if (checkbox) {
//                 checkbox.checked = true;
//             }
//         });

//         updateTotalUI();
//     }, 3000);
// };

// window.addEventListener("DOMContentLoaded", loader);



///////////////////////////////////////////////////////////
  
