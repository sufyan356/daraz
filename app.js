import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore , doc  ,collection, addDoc , getDocs , updateDoc   } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 3000); // Change image every 2 seconds
}

const apiData = async () => {
  try{
    // let ProductData = await fetch(" https://dummyjson.com/products")
    let ProductData = await fetch(" https://fakestoreapi.com/products")
    let productResponse = await ProductData.json();
    const querySnapshot = await getDocs(collection(db, "Products"));
    if(!querySnapshot.empty){
      console.log("data hai" , querySnapshot.size)
    }
    else{
      console.log("data nh hai")
      productResponse.forEach(async (productData) => {
        const docRef = await addDoc(collection(db, "Products"), {
          productData
        });
      })
      
    }

    productCards(productResponse)
 
    // let categoryData = await fetch(" https://dummyjson.com/products/categories")
    let categoryData = await fetch(" https://fakestoreapi.com/products/categories")
    let categoryResponse = await categoryData.json();

    tab(categoryResponse)
    // categoryResponse.forEach(category => {
    //   tab(category)
    // });

    
  }

  catch(error){
    console.log("error: " , error.message)
    console.log("data Not Found")
  }
}
window.addEventListener("DOMContentLoaded" , apiData)

let tabs = document.querySelector(".tab");
const tab = (category) => {
  category.forEach((data) => {
    
    tabs.innerHTML += `
    <button class="tablinks" data-category="${JSON.stringify(category).replace(/"/g, '&quot;')}" onmouseover="openCity(event)" id="categorieTitle">${data}</button>
`;
  })
  
};


// HOVER LIST 
function openCity(evt) {
  console.log("openCity triggered!..");
  let categoryName = evt.target.getAttribute('data-category');
  console.log(JSON.parse(categoryName) );
}

// show products


const productCards = async (products) => {
  let row = document.querySelector("#cardsContainer");

  for (const data of products) {
    // console.log(data)
      
      row.innerHTML += `
      
        <div class="col-sm-4 " >
          <div class="card" style="width: 12rem; max-height: 15rem; margin-bottom:5rem;">
            <div class="card-body p-5">
            <img src="${data.image}" class="card-img-top" alt="ProductImage" id = "customImage">
              <h5 class="card-title" id = "customHeading">${data.title}</h5>
              <p class="card-text">RS: ${data.price}</p>
              <div id = "quantityContainer"> 
                <span> Quantity: </span> 
                <div id = "Quantity">
                  <i class="fa-solid fa-plus" id = ${data.id} onclick = "increment(${data.id})"></i>
                  <span> 0 </span>
                  <i class="fa-solid fa-minus" id = ${data.id} onclick = "decrement( ${data.id})"></i>
                </div>
              </ div>
              

              <div id = "cartContainer">
                <a href="#" class="btn btn-primary" id = "addToCartBtn" onclick = "addToCart()">Add To Cart</a>
              </ div>
            
            </div>
          </div>
        </div>
      
      

      `;

      // Introduce a delay between requests (e.g., 1 second)
      // await new Promise(resolve => setTimeout(resolve, 1000));
    
  }
};

let basket = [];
let search;
let items = 1;
let basketArray

window.increment = async (id) => {
  let docID;
  console.log("Increment Function")
  const querySnapshot = await getDocs(collection(db, "Calculations"));
  if(!querySnapshot.empty){
    
    querySnapshot.forEach((doc) => {
      basketArray = doc.data().basket;
      docID = doc.id;
     if (Array.isArray(basketArray)) {
       basketArray.forEach((basketItem) => {
         search = basketItem.id == id
         
       });
     }
   })
  }
 

  console.log(search)
  if(search != true){
    let items = 1
    console.log("product id has not Exist!")
    basket.push({
      id : id,
      items
    })
    const docRef = await addDoc(collection(db, "Calculations"), {
      basket
    });
    // const querySnapshot = await getDocs(collection(db, "Calculations"));
    // querySnapshot.forEach((doc) => {
    //    docID = doc.id
    // })
    // console.log(docID)
  }
  else {
    console.log("product id has already Exist!")
    
    if (true) {
      items++;
      basket.push({
        id : id,
        items
      })
      
      // Update the existing document in Firestore
      const docRef = doc(db, "Calculations", `${docID}`);
      await updateDoc(docRef, {
        basket
      });
      console.log(basketArray)
      console.log(docID)
    }
  console.log(items)

  }

  // else {
  //   // Increment the items for the existing product ID
  //   console.log("Incrementing items for existing product ID!");

  //   // Find the index of the existing product in the basket array
  //   const index = basket.findIndex((item) => item.id === id);
  //   console.log(basket)

  //   if (index !== -1) {
  //     // Increment the items
  //     basket[index].items += 1;

  //     // Update the existing document in Firestore
  //     const docRef = doc(db, "Calculations", docID);
  //     await updateDoc(docRef, {
  //       basket: basket,
  //     });

  //     console.log("Document updated with ID: ", docRef.id);
  //   }
  // }
}

/////////////////////////////////////////////////////
// let basket = [];
// let search;
// let items = 1;
// let basketArray
// let docID
// window.increment = async (id) => {
//   console.log("Increment Function");

  
//   const querySnapshot = await getDocs(collection(db, "Calculations"));
//   querySnapshot.forEach((doc) => {
//     const basketArray = doc.data().basket;
//     basketArray.forEach((data) => {
//       search = data.id == id
//       console.log(search)
//       console.log(items)
//     })

//     if (Array.isArray(basketArray)) {
     

//       if (search) {
//         console.log("Product ID already exists!");
//         // Increment the items for the existing product ID
//         basketArray[items].items += 1;
//         docID = doc.id;

//         // Update the existing document in Firestore
//         const docRef = doc(db, "Calculations/" + docID); // Corrected reference
//         updateDoc(docRef, {
//           basket: basketArray,
//         });

//         console.log("Document updated with ID: ", docRef.id);
//       } else {
//         console.log("Product ID does not exist!");
//         // Add a new item to the basket array
//         basketArray.push({
//           id: id,
//           items: 1,
//         });
//         docID = doc.id;

//         // Update the existing document in Firestore
//         const docRef = doc(db, "Calculations/" + docID); // Corrected reference
//         updateDoc(docRef, {
//           basket: basketArray,
//         });

//         console.log("Document updated with ID: ", docRef.id);
//       }
//     }
//   });

//   if (!docID) {
//     console.log("No document found, creating a new one!");
//     basket.push({
//       id : id,
//       items
//     })
//     const docRef = await addDoc(collection(db, "Calculations"), {
//       basket
//     });
//     docID = docRef.id;
//     console.log("New document created with ID: ", docID);
//   }
// };
/////////////////////////////////////////////////////

window.decrement = (e) => {
  console.log("decrement Function")
  console.log(e)
}






// {/* <p class="card-text">${data.description}</p> */}
  //  const productCards = (products) => {
  //   let cardsContainer = document.querySelector("#cardsContainer");
  
  //   products.forEach((data) => {
  //     data.images.forEach((image) => {
  //       let imagesHtml = `<img src="${image}" class="card-img-top" alt="ProductImage">`;
  //       cardsContainer.innerHTML += `
  //         <div class="card" style="width: 18rem;">
  //           <div class="card-body">
  //             ${imagesHtml}
  //             <h5 class="card-title">${data.title}</h5>
  //             <p class="card-text">${data.description}</p>
  //             <p class="card-text">${data.price}</p>
  //             <a href="#" class="btn btn-primary">Go somewhere</a>
  //           </div>
  //         </div>
  //       `;
  //     });
  //   });
  // }
  
  
  
  //  
   

  //  product.forEach((a) => {
  //   a.images.forEach((data) => {
  //     <img src = "${data}" class="card-img-top" alt="ProductImage"></img>
  //   })
  // })

  
  

  
// }














  // products.forEach((data) => {
  //   let imageHtml = `<img src="${data.images[0]}" class="card-img-top" alt="ProductImage">`;

  //   cardsContainer.innerHTML += `
  //     <div class="card" style="width: 18rem;">
  //       ${imageHtml}
  //       <div class="card-body">
  //         <h5 class="card-title">${data.title}</h5>
  //         <p class="card-text">${data.description}</p>
  //         <p class="card-text">${data.price}</p>
  //         <a href="#" class="btn btn-primary">Go somewhere</a>
  //       </div>
  //     </div>
  //   `;
  // });



// function openCity(evt, categoryName) {
//   console.log("openCity trigered!..")
  // let obj = JSON.parse(categoryName) 
  // console.log(categoryName)
  // categoryName.forEach((data) => {
  //   console.log(data)
  //   if(data.name == "Clothes"){
  //     console.log(" present")
  //   }
  //   else{
  //     console.log("Not present")
  //   }
    
  // })
  
    // var i, tabcontent, tablinks;
    // tabcontent = document.getElementsByClassName("tabcontent");
    // for (i = 0; i < tabcontent.length; i++) {
    //   tabcontent[i].style.display = "none";
    // }
    // tablinks = document.getElementsByClassName("tablinks");
    // for (i = 0; i < tablinks.length; i++) {
    //   tablinks[i].className = tablinks[i].className.replace(" slider-active", "");
    // }
    // document.getElementById(categoryName).style.display = "block";
    // evt.currentTarget.className += " slider-active";
// }

  // let tabs = document.querySelector(".tab");
  // const tab = (element) => {
  //   console.log(element.name)
  //   tabs.innerHTML +=
  //   `
  //   <button class="tablinks" onmouseover="openCity(event, ${JSON.stringify(element)})" id="categorieTitle">${element.name}</button>
  //   `
  // }
