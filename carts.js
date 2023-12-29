import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore , doc  ,collection, addDoc , getDocs , getDoc , updateDoc , onSnapshot , deleteDoc   } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// const firebaseConfig = {
//   apiKey: "AIzaSyDnL1QO4hHQbdr_-iqjVRbNgGOUQb8lSjw",
//   authDomain: "e-commerece-d1da6.firebaseapp.com",
//   projectId: "e-commerece-d1da6",
//   storageBucket: "e-commerece-d1da6.appspot.com",
//   messagingSenderId: "441885728322",
//   appId: "1:441885728322:web:a8c5cd02a60335fc0697db"
// };

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
let loaderContainer = document.querySelector(".loader")
let cartsProduct = document.querySelector("#cartsProduct")
let cardMiniContainer = document.querySelector("#cardMiniContainer")

window.DeleteFunction = async (productId , price) => {    // window.DeleteFunction  ( function run successfully )
    console.log("delete function run");
    try {
        // loaderContainer.classList.add("loaderShow");
        cardMiniContainer.classList.add("opacityClass");
       
        let total;
        const totalAmountSnapshot = await getDocs(collection(db, "totalAmount"));
        totalAmountSnapshot.forEach((ele) => {
            total = (+total + (ele.data().total - price)).toFixed(3);
            console.log(total)
            
        })
        const totals = doc(db, "totalAmount", totalAmountSnapshot.docs[0].id);
        await updateDoc(totals, {
            total
        });
        console.log(total)

        await deleteDoc(doc(db, "Quantity", productId));
        console.log("Document successfully deleted!");

        
        window.location.reload()
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
};



let total = 0;
let docRef; // Declare docRef outside the function
let totalAmountRef; // Declare docRef outside the function
let isChecked;
window.ItemsSelected = async (event, price, quantity, productID) => {
    const querySnapshot = await getDocs(collection(db, "SelectedItems"));
    if (querySnapshot.empty) {
        if (event.target.checked) {
            total += +price * quantity;
            // console.log(total)
            totalAmountRef = await addDoc(collection(db, "totalAmount"), { total});
            docRef = await addDoc(collection(db, "SelectedItems"), {
                total,
                productID,
                price,
                quantity,
                isChecked: true
            });
        }
    } 


    else {
        const existingItem = querySnapshot.docs.find(doc => doc.data().productID === productID);
        const totalAmountSnapshot = await getDocs(collection(db, "totalAmount"));
        let a = 0;
       

        if (existingItem) {
            console.log("DB KHALI NHIHAI.")
            if (event.target.checked) {
                total += +price * quantity;
                // console.log(total)
                const totals = doc(db, "totalAmount", totalAmountSnapshot.docs[0].id);
                await updateDoc(totals, {
                    total
                });

                totalAmountSnapshot.forEach((ele) => {
                    a+=ele.data().total
                    console.log(a)
                })

                const washingtonRef = doc(db, "SelectedItems", existingItem.id);
                await updateDoc(washingtonRef, {
                    total,
                    productID,
                    price,
                    quantity,
                    isChecked: true
                });
            } else {
                total -= +price * quantity;
                // console.log(total)
                const totals = doc(db, "totalAmount", totalAmountSnapshot.docs[0].id);
                await updateDoc(totals, {
                    total
                });
                totalAmountSnapshot.forEach((ele) => {
                    a+=ele.data().total
                    console.log(a)
                })

                const washingtonRef = doc(db, "SelectedItems", existingItem.id);
                await updateDoc(washingtonRef, {
                    total,
                    productID,
                    price,
                    quantity,
                    isChecked: false
                });
            }
        } 
        else {
            console.log("DB KHALI HAI.")
            if (event.target.checked) {
                total += +price * quantity;
               
                const totals = doc(db, "totalAmount", totalAmountSnapshot.docs[0].id);
                await updateDoc(totals, {
                    total
                });
                totalAmountSnapshot.forEach((ele) => {
                    a+=ele.data().total
                    console.log(a)
                     console.log(total)
                })
                docRef = await addDoc(collection(db, "SelectedItems"), {
                    total,
                    productID,
                    price,
                    quantity,
                    isChecked: true
                });
            }
        }
    }

    updateTotalUI();
};

const updateTotalUI = async () => {
    let subTotalID = document.querySelector("#subTotalID");
    let totalID = document.querySelector("#totalID");
    let totalAmount = total;
    // console.log(typeof(total))
    subTotalID.innerHTML = totalAmount;
    totalID.innerHTML = totalAmount;
};

let setID;
const checkedFunction = async () => {
    const SelectedItemsQuerySnapshot = await getDocs(collection(db, "SelectedItems"));
    const checkboxes = document.querySelectorAll("#cardMini input[type='checkbox']");

    checkboxes.forEach((checkbox) => {
        const checkboxId = checkbox.id;
        const isChecked = SelectedItemsQuerySnapshot.docs.some((element) => element.data().productID == checkboxId && element.data().isChecked);
        console.log(isChecked)
        checkbox.checked = isChecked;
    });

    for(const element of SelectedItemsQuerySnapshot.docs){
        setID = element.id
        console.log(element.id + ": " + element.data().isChecked + "\n")
    }
};



let cardMinis = document.querySelector("#cardMini");
const cardsData = async () => {
    const productsQuerySnapshot = await getDocs(collection(db, "Quantity"));

    for (const productDoc of productsQuerySnapshot.docs) {
        cardMinis.innerHTML += `
            <div class="card "id="shopCards">
                <input type="checkbox" id="${productDoc.data().productId}" onclick="ItemsSelected(event, ${productDoc.data().price}, ${productDoc.data().quantity}, '${productDoc.data().productId}')">
                <img src="${productDoc.data().img}" class="card-img-top" alt="..." id="cartsImage">
                <div class="card-body cardsBody ">
                    <h5 class="card-title price">Price: ${productDoc.data().price}</h5>
                    <p class="card-text">Quantity: ${productDoc.data().quantity}</p>
                    <i class="fa-solid fa-trash trash" onclick=" DeleteFunction('${productDoc.id}' , ${productDoc.data().price})"></i>
                </div>
            </div>
        `;
    }
    
};

const loader = async () => {
   

    await cardsData();
        loaderContainer.classList.add("hide");
        cartsProduct.classList.add("show");
        const selectedItemsCollection = collection(db, "totalAmount");
        const selectedItemsQuerySnapshot = await getDocs(selectedItemsCollection);
    
        selectedItemsQuerySnapshot.forEach((itemDoc) => {
            total += itemDoc.data().total;
        });

        await checkedFunction();
        await updateTotalUI();
        
};

window.addEventListener("DOMContentLoaded", loader);
