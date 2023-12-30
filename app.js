import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore , doc  ,collection, addDoc , getDocs , getDoc , updateDoc , onSnapshot   } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth, onAuthStateChanged , createUserWithEmailAndPassword , signInWithEmailAndPassword     } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyDnL1QO4hHQbdr_-iqjVRbNgGOUQb8lSjw",
  authDomain: "e-commerece-d1da6.firebaseapp.com",
  projectId: "e-commerece-d1da6",
  storageBucket: "e-commerece-d1da6.appspot.com",
  messagingSenderId: "441885728322",
  appId: "1:441885728322:web:a8c5cd02a60335fc0697db"
};
// const firebaseConfig = {
//   apiKey: "AIzaSyDnL1QO4hHQbdr_-iqjVRbNgGOUQb8lSjw",
//   authDomain: "e-commerece-d1da6.firebaseapp.com",
//   projectId: "e-commerece-d1da6",
//   storageBucket: "e-commerece-d1da6.appspot.com",
//   messagingSenderId: "441885728322",
//   appId: "1:441885728322:web:a8c5cd02a60335fc0697db"
// };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let containerWrapper = document.querySelector(".container-wrapper")
let leftPart = document.querySelector("#leftPart")
let rightPart = document.querySelector("#rightPart")
let cardsContainer = document.querySelector("#cardsContainer")
let blurID = document.querySelectorAll("#blurID")
let loader = document.querySelector(".loader")

// slider 
let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" slider-active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " slider-active";
  setTimeout(showSlides, 3000); // Change image every 2 seconds
}

let tabs = document.querySelector(".tab");
const tab = (category) => {
  category.forEach((data) => {
    
    tabs.innerHTML += `
    <button class="tablinks " data-category="${JSON.stringify(category).replace(/"/g, '&quot;')}" onmouseover="openCity(event)" id="categorieTitle">${data}</button>
`;
  })
};
// HOVER LIST 
function openCity(evt) {
  console.log("openCity triggered!..");
  let categoryName = evt.target.getAttribute('data-category');
  console.log(JSON.parse(categoryName) );
}

async function basket() {

  // if(firebase.auth().currentUser.photoURL){
  //   console.log("HAN KIA HAI BHAI!.")
  //   const imgges = document.querySelector("#imgges");
  //   imgges.src = firebase.auth().currentUser.photoURL;
  // }

  console.log("Basket Function Run!..");
  const basketData = document.querySelector("#basketData");
  const querySnapshot = await getDocs(collection(db, "Quantity"));
  const totalQuantity = querySnapshot.docs
    .map((doc) => doc.data().quantity)
    .reduce((accumulator, currentQuantity) => accumulator + currentQuantity, 0);

  basketData.innerHTML = totalQuantity;
}
window.addEventListener("DOMContentLoaded", basket);
let basketData = document.querySelector("#basketData");


const productCarts = () => {
  location.href = "productCarts.html"
}
basketData.addEventListener("click" , productCarts);



const apiData = async () => {
  try {
  loader.classList.add("loaderShow");
  let productData = await fetch("https://fakestoreapi.com/products");
  let productResponse = await productData.json();
  let categoryData = await fetch("https://fakestoreapi.com/products/categories");
  let categoryResponse = await categoryData.json();
  let updatedDoc;
  tab(categoryResponse);

  const querySnapshot = await getDocs(collection(db, "Products"));

  if (querySnapshot.empty) {
    console.log("Data not found in Firestore");
    productResponse.forEach(async (productData) => {
      const docRef = await addDoc(collection(db, "Products"), {
        productData
      });
    });
  }
  const updatedDocs = [];
  querySnapshot.forEach(async (doc) => {
    const docRef = doc.ref;
    // Update the document and then fetch the updated document
    await updateDoc(docRef, { productData: { ...doc.data().productData, documentID: doc.id } });
    updatedDoc = await getDoc(docRef);

    if (updatedDoc.exists()) {
      updatedDocs.push(updatedDoc.data());
      
    } 
    productCards(updatedDoc.data());
    loader.classList.add("hide");
    const elements = [containerWrapper, leftPart, rightPart];
    elements.forEach(element => {
      element.classList.add("show");
    });
  
  });
} 
catch (error) {
  console.log("Error:", error.message);
  console.log("Error:", error.code);
}

}
window.addEventListener("DOMContentLoaded" , apiData)

window.updateFun = async (productId , count , event , img , price) => {
  // console.log(img)
  let success = document.querySelector("#success");
  setTimeout(() => {
    try{
      success.classList.remove("show");
      let quantity = count;
      const query = collection(db, "Quantity");
      let executed = false;
    
      let unsubscribe = onSnapshot(query, (snapshot) => {
        let productExists = false;
    
        snapshot.docs.some((doc) => {
          // console.log(doc.id)
          if (doc.data().productId == productId) {
            productExists = true;
            updateDoc(doc.ref, {
              quantity: quantity
            });
            basket();
            return true;
          } 
          else {
            return false;
          }
        });
    
        // Detach the listener temporarily to avoid immediate re-triggering
        unsubscribe();
    
        if (!productExists && !executed) {
          // console.log("Product ID NOT Found.");
          executed = true;
          // Create a new document for a product not found
          addDoc(collection(db, "Quantity"), {
            productId,
            quantity,
            img,
            price
          });
          basket();
        }
    
        // Reattach the listener
        const newUnsubscribe = onSnapshot(query, () => {});
        unsubscribe = newUnsubscribe;
      });
      
    }
    catch(error){
      console.log(error.code)
      console.log(error.message)
    }
  
    
  },2500)
  success.classList.add("show");
};

const productCards = async (products) => {
 

  let row = document.querySelector("#cardsContainer");
    row.innerHTML += `
      
    <div class="col-sm-4 " >
      <div class="card " style="width: 12rem; max-height: 15rem; margin-bottom:5rem; cursor:pointer;" id = "loadCard">
        <div class="card-body p-5 " id = "blurID">
          <img src="${products.productData.image}" class="card-img-top" alt="ProductImage" id = "customImage">
            <h5 class="card-title" id = "customHeading">${products.productData.title}</h5>
            <p class="card-text">RS: ${products.productData.price}</p>
            <div id = "quantityContainer"> 
              <div id = "Quantity">
              <span id="increment" onclick="incrementFun(event, '${products.productData.id}', '${products.productData.image}', ${products.productData.price})"><i class="fa-solid fa-plus updateIcons"></i></span>
                <span id="productNumbers"> 0 </span>
                <span id="decrement" onclick = 'decrementFun(event , ${products.productData.id})'><i class="fa-solid fa-minus updateIcons" ></i></span>
              </div>
            </ div>
            <div id = "addtoCartAndArrowIcon"> 
                <div id="cartContainer">
                  <a href="#" class="btn btn-primary" id="addToCartBtn" onclick='addToCart(event , ${products.productData.id})'>Add To Cart</a>
                </div>
                <div id = "productDetails"> 
                <i class="fa-solid fa-arrow-right" onclick="productDescriptionFunction('${products.productData.documentID}')"></i>
                </ div>

            </div>
            
        </div>
      </div>
    </div>
  `; 

         
};



let count = 0;
window.incrementFun = async (event , productId , img , price) => {
  let productNumbers = event.currentTarget.parentElement.querySelector("#productNumbers");
  let success = document.querySelector("#success").innerHTML = "Items Added Successfully!..";
  console.log("productId!.." + productId);
  const querySnapshot = await getDocs(collection(db, "Quantity"));
  const matchingDoc = querySnapshot.docs.find(ele => ele.data().productId == productId);

  if (matchingDoc) {
    console.log(matchingDoc.data().productId + ": Matched");
    count = matchingDoc.data().quantity;
    count++;
    updateFun(productId, count, productNumbers , img , price);
    productNumbers.innerHTML = `${count}`;

    return;
  } 
  else {
    count = 1;
    console.log(productId + ": Not Matched");
    updateFun(productId, count, productNumbers , img , price);
    productNumbers.innerHTML = `${count}`;
    return;
  }
  
};


window.decrementFun = async (event , productId) => {
  let success = document.querySelector("#success").innerHTML = "Items Remove Successfully!..";
  let productNumbers = event.currentTarget.parentElement.querySelector("#productNumbers");
  let decrementVar = document.querySelector("#decrement")
  const querySnapshot = await getDocs(collection(db, "Quantity"));
  const matchingDoc = querySnapshot.docs.find(ele => ele.data().productId == productId);

  if (matchingDoc) {
    console.log(matchingDoc.data().productId + ": Matched");
    count = matchingDoc.data().quantity;
    console.log(typeof(count))
    if(count > 0){
      count--;
      productNumbers.innerHTML = `${count}`;
      updateFun(productId, count);
      return;
    }
  } 
  else {
    console.log("there is no product Collection: ")
    decrementVar.disabled = true
    return;
  }
}

window.addToCart = async (event , productId) => {
  const querySnapshot = await getDocs(collection(db, "Quantity"));
  const matchingDoc = querySnapshot.docs.find(ele => ele.data().productId == productId);

  if (matchingDoc) {
    console.log(matchingDoc.data().productId + ": Matched");
    count = matchingDoc.data().quantity;
    // ++count;
    updateFun(productId, count, productNumbers);
    // productNumbers.innerHTML = `${count}`;
    return;
  } 
  else {
    count = 1;
    console.log(productId + ": Not Matched");
    updateFun(productId, count, productNumbers);
    productNumbers.innerHTML = `${count}`;
    return;

  }
}

{/* <label for = "productQuantity">Quantity : </label>
<select id=" productQuantity" class="btn btn-primary productQuantitySelector"  onchange = "itemsSale(event , ${products.productData.id})">
  ${generateQuantityOptions(100)}
</select> */}

window.productDescriptionFunction = async (productID ) => {
console.log("product ID => " , productID)
  let docRef ;
  const querySnapshot = await getDocs(collection(db, "productDetails"));
  
  if (querySnapshot.empty) {
    console.log("DATABASE KHALI HAI");
    docRef = await addDoc(collection(db, "productDetails"), {
      productID: productID
    });
      location.href = "productDetails.html"

  } 
  else {
    console.log("DATABASE KHALI NHI HAI");
    const firstDoc = querySnapshot.docs[0];

    const washingtonRef = doc(db, "productDetails", firstDoc.id);

    await updateDoc(washingtonRef, {
      productID: productID,
    });
      location.href = "productDetails.html"

  }
};











