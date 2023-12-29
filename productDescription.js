import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore , doc  ,collection, addDoc , getDocs , getDoc , updateDoc , onSnapshot   } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

let loader = document.querySelector(".loader")
let producrDetails = document.querySelector(".producrDetails")
function getData(){
  loader.classList.add("loaderShow");
  producrDetails.classList.add("hide");

  setTimeout( async() => {
      showProducts();
  },3000)
}

const basketData_2 = document.querySelector("#basketData_2");
if(basketData_2){
 
  const productCarts = () => {
    location.href = "productCarts.html"
  }
  basketData_2.addEventListener("click" , productCarts);
}

async function basket_2() {
  // console.log("Basket Function Run!..");
 
  const querySnapshot = await getDocs(collection(db, "Quantity"));

  const totalQuantity = querySnapshot.docs
    .map((doc) => doc.data().quantity)
    .reduce((accumulator, currentQuantity) => accumulator + currentQuantity, 0);

    basketData_2.innerHTML = totalQuantity;
}
window.addEventListener("DOMContentLoaded", basket_2);



const showProducts = async () => {
  let productID;
  let productDes = document.querySelector("#productDes")
  let productTitle = document.querySelector("#productTitle")

  let imagePhoto = document.querySelector("#imagePhoto")
  let quantityBox = document.querySelector(".quantityBox")
  let buttonGrp = document.querySelector(".buttonGrp")
  let updateQuantity = document.querySelector(".updateQuantity")
  let containerWrapper = document.querySelector(".container-wrapper")



  const docRef = await getDocs(collection(db, "productDetails"));
  docRef.docs.forEach(element => {
    productID = element.data().productID
  });

  try{
    const querySnapshot = await getDocs(collection(db, "Products"));
    loader.classList.add("hide");
    producrDetails.classList.remove("hide");

    querySnapshot.docs.filter((data) => {
      
      if(data.id == productID){
        imagePhoto.classList.add("show")
        quantityBox.classList.add("show_1")
        buttonGrp.classList.add("show_2")
        // console.log("data.data().productData.title")
        imagePhoto.src = data.data().productData.image
        productTitle.innerHTML = `${data.data().productData.title}`
        productDes.innerHTML = `${data.data().productData.description}`
      }
      
      
       
    })
  }
  catch(error){
    console.log(error.code)
    console.log(error.message)
  }
}
window.addEventListener("DOMContentLoaded" , getData);

// let quantity = 0
// let productID;
// let docRef;
// const numberIncremet = (productData , quantityData) => {


//   // data.docs.forEach((ele) => {
//   //   productID = ele.data().productData.id
//   //   console.log(productID)
//   // })
// }


// let increment = document.querySelector("#increment");
// if(increment){
//   increment.addEventListener("click" , incrementFun);
//   const incrementFun = async () => {
//     console.log("Increment Function!..");
   
//     quantity++;
   
//     docRef = await addDoc(collection(db, "updatedProduct"), {
//       quantity
//     });
  
//     numberIncremet(docRef)
    
    
//     console.log(productID)
//     quantity++
//     console.log(quantity)
//     // const docRef = await addDoc(collection(db, "Products"), {
//     //   productData
//     // });
  
//   }
// }

