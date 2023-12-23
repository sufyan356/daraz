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
function getData(){
  setTimeout( async() => {

    // const querySnapshot = await getDocs(collection(db, "Products"));
    // querySnapshot.docs.forEach((ele) => {
    //   productID = ele.data().productData.id
      showProducts();
    // })

   
  },3000)
}


const showProducts = async () => {
 console.log("prodID")
  
  let productID;
  let productDes = document.querySelector("#productDes")
  let productTitle = document.querySelector("#productTitle")

  let imagePhoto = document.querySelector("#imagePhoto")
  let quantityBox = document.querySelector(".quantityBox")
  let buttonGrp = document.querySelector(".buttonGrp")
  let updateQuantity = document.querySelector(".updateQuantity")
  updateQuantity.innerHTML = `
  <span id=""><i class="fa-solid fa-plus updateIcons" ></i></span>
  <span id="productNumbers">100</span>
  <span id=""><i class="fa-solid fa-minus updateIcons" ></i></span>
  
  `

  const docRef = await getDocs(collection(db, "productDetails"));
  docRef.docs.forEach(element => {
    productID = element.data().productID
  });
  
  try{
    const querySnapshot = await getDocs(collection(db, "Products"));
    querySnapshot.docs.filter((data) => {
      if(data.id == productID){

        imagePhoto.classList.add("show")
        quantityBox.classList.add("show_1")
        buttonGrp.classList.add("show_2")

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

