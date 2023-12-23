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

const apiData = async () => {
//   let a;
//   try{
//     let ProductData = await fetch(" https://fakestoreapi.com/products")
//     let productResponse = await ProductData.json();
//     const querySnapshot = await getDocs(collection(db, "Products"));
//     if(querySnapshot.empty){
//       console.log("data nh hai")
//       productResponse.forEach(async (productData) => {
//         const docRef = await addDoc(collection(db, "Products"), {
//           productData
//         });
//       })
//     }

//     const updatedDocs = [];
//     querySnapshot.forEach(async (doc) => {
//       const docRef = doc.ref;
//       console.log(docRef);
//       const updatedDocument = await updateDoc(docRef, { documentID: doc.id });
//         updatedDocs.push(updatedDocument);
//       });
//       // Wait for all updateDoc operations to complete
//       await Promise.all(updatedDocs);
//       const updatedDocumentData = await Promise.all(updatedDocs.map(doc => getDoc(doc)).map(doc => doc.data()));
//       console.log(updatedDocumentData)

//     productCards(productResponse);

//     let categoryData = await fetch(" https://fakestoreapi.com/products/categories")
//     let categoryResponse = await categoryData.json();
//     tab(categoryResponse)
//   }

//   catch(error){
//     console.log("error: " , error.message)
//     console.log("data Not Found")
//   }
// }

try {
  let productData = await fetch("https://fakestoreapi.com/products");
  let productResponse = await productData.json();
  let categoryData = await fetch("https://fakestoreapi.com/products/categories");
  let categoryResponse = await categoryData.json();
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
    const updatedDoc = await getDoc(docRef);

    if (updatedDoc.exists()) {
      updatedDocs.push(updatedDoc.data());
      
    } 
    // Call productCards with the updated data
    productCards(updatedDoc.data());
    // console.log(updatedDoc.data().productData.documentID);
  });

  

  
} 
catch (error) {
  console.log("Error:", error.message);
  console.log("Error:", error.code);
}


}

window.addEventListener("DOMContentLoaded" , apiData)

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

window.addToCart = (productID) => {
  console.log(productID)
}

function generateQuantityOptions(maxQuantity) {
  let options = "";
  for (let i = 0; i < maxQuantity; i++) {
    options += `<option value="${i}" >${i}</option>`;
  }
  return options;
}


window.addEventListener("DOMContentLoaded", basket);
async function basket() {
  console.log("Basket Function Run!..");
  const basketData = document.querySelector("#basketData");
  const querySnapshot = await getDocs(collection(db, "Quantity"));

  const totalQuantity = querySnapshot.docs
    .map((doc) => doc.data().quantity)
    .reduce((accumulator, currentQuantity) => accumulator + currentQuantity, 0);

  basketData.innerHTML = totalQuantity;
}


// window.itemsSale = async (event, productId) => {
//   let success = document.querySelector("#success");
//   setTimeout(() => {
//   success.classList.remove("show");
//   let quantity = +event.target.value;
//   const query = collection(db, "Quantity");
//   let executed = false;

//   let unsubscribe = onSnapshot(query, (snapshot) => {
//     let productExists = false;

//     snapshot.docs.some((doc) => {
//       console.log(doc.ref)
//       if (doc.data().productId == productId) {
//         productExists = true;
//         updateDoc(doc.ref, {
//           quantity: quantity
//         });
//         basket();
//         return true;
//       } 
//       else {
        
//         return false;
       
//       }
//     });

//     // Detach the listener temporarily to avoid immediate re-triggering
//     unsubscribe();

//     if (!productExists && !executed) {
//       console.log("Product ID NOT Found.");
//       executed = true;
//       // Create a new document for a product not found
//       addDoc(collection(db, "Quantity"), {
//         productId,
//         quantity,
//       });
//       basket();
//     }

//     // Reattach the listener
//     const newUnsubscribe = onSnapshot(query, () => {});
//     unsubscribe = newUnsubscribe;
//   });
    
//   },2500)
//   success.classList.add("show");

  

// };
const productCards = async (products) => {
  let row = document.querySelector("#cardsContainer");
    // console.log(products.productData.documentID)
      row.innerHTML += `
      
        <div class="col-sm-4 " >
          <div class="card " style="width: 12rem; max-height: 15rem; margin-bottom:5rem; cursor:pointer;" id = "loadCard">
            <div class="card-body p-5 ">
              <img src="${products.productData.image}" class="card-img-top" alt="ProductImage" id = "customImage">
                <h5 class="card-title" id = "customHeading">${products.productData.title}</h5>
                <p class="card-text">RS: ${products.productData.price}</p>
                <div id = "quantityContainer"> 
                  <div id = "Quantity">
                    <span id="increment" onclick = 'incrementFun(event , ${products.productData.id})'><i class="fa-solid fa-plus updateIcons" ></i></span>
                    <span id="productNumbers"> 0 </span>
                    <span id="decrement" onclick = 'decrementFun(event , ${products.productData.id})'><i class="fa-solid fa-minus updateIcons" ></i></span>
                  </div>
                </ div>
                <div id = "addtoCartAndArrowIcon"> 
                    <div id="cartContainer">
                      <a href="#" class="btn btn-primary" id="addToCartBtn" onclick="addToCart('${products.productData.id}')">Add To Cart</a>
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

window.updateFun = async (productId , count , event) => {
  let success = document.querySelector("#success");
  setTimeout(() => {
  success.classList.remove("show");
  let quantity = count;
  const query = collection(db, "Quantity");
  let executed = false;

  let unsubscribe = onSnapshot(query, (snapshot) => {
    let productExists = false;

    snapshot.docs.some((doc) => {
      // console.log(doc.ref)
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
      console.log("Product ID NOT Found.");
      executed = true;
      // Create a new document for a product not found
      addDoc(collection(db, "Quantity"), {
        productId,
        quantity,
      });
      basket();
    }

    // Reattach the listener
    const newUnsubscribe = onSnapshot(query, () => {});
    unsubscribe = newUnsubscribe;
  });
    
  },2500)
  success.classList.add("show");

  

};

let count = 1;
window.incrementFun = async (event , productId) => {
  let productNumbers = event.currentTarget.parentElement.querySelector("#productNumbers");
  // console.log(productNumbers)

  let success = document.querySelector("#success").innerHTML = "Items Added Successfully!..";
  console.log("increment Run!..");
  console.log("productId!.." + productId);
  const querySnapshot = await getDocs(collection(db, "Quantity"));

  // Check if the product is present in the collection
  const matchingDoc = querySnapshot.docs.find(ele => ele.data().productId == productId);

  if (matchingDoc) {
    console.log(matchingDoc.data().productId + ": Matched");
    count = matchingDoc.data().quantity;
    console.log(typeof(count));
    ++count;
    productNumbers.innerHTML = `${count}`;
    return;
  } 
  else {
    count = 1;
    console.log(productId + ": Not Matched");
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











