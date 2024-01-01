
import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth, onAuthStateChanged , createUserWithEmailAndPassword , signInWithEmailAndPassword , signInWithPopup, GoogleAuthProvider     } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore , collection, addDoc , updateDoc   } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyDnL1QO4hHQbdr_-iqjVRbNgGOUQb8lSjw",
  authDomain: "e-commerece-d1da6.firebaseapp.com",
  projectId: "e-commerece-d1da6",
  storageBucket: "e-commerece-d1da6.appspot.com",
  messagingSenderId: "441885728322",
  appId: "1:441885728322:web:a8c5cd02a60335fc0697db"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage();
const provider = new GoogleAuthProvider();


// SIGN UP FUNCTION: 
let signUpBtn  = document.querySelector("#signUpBtn");
if(signUpBtn){
  const signUp = (event) => {
    event.preventDefault();

    let signUpUserName  = document.querySelector("#exampleInputName1").value;
    let signUpEmail  = document.querySelector("#exampleInputEmail1").value;
    let signUpPassword  = document.querySelector("#exampleInputPassword1").value;
    let inputGroupFile02  = document.querySelector("#inputGroupFile02").value;
    const file = document.querySelector("#inputGroupFile02");
    if(!signUpUserName){
      alert("PLEASE FILL NAME FIELD!..")
      return;
    }

    if(file.files.length === 0){
      alert("Plz Choose a File!..");
      return;
    }

    else{
      createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
      .then( async (userCredential) => {
        const image = localStorage.getItem("Image");
        let docRef;
        const user = userCredential.user;
          docRef = await addDoc(collection(db, "usersInfo"), {
          signUpUserName,
          signUpEmail,
          signUpPassword,
          image
        });

        await updateDoc(docRef, { docId: docRef.id });
        window.location.href = 'signIn.html'
      })
  
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        console.log(errorCode)
      });
    }

    
  }
  signUpBtn.addEventListener("click" , signUp)
}

// SIGN IN WITH GOOGLE
// const GoogleBtn = document.querySelector("#GoogleBtn");
// GoogleBtn.addEventListener("click" , () => {
//   signInWithPopup(auth, provider)
//   .then((result) => {
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential.accessToken;
//     const user = result.user;
//     console.log("user => " , user);
//     window.location.href = 'index.html'
//   }).catch((error) => {

//     const errorCode = error.code;
//     const errorMessage = error.message;
//     const email = error.customData.email;
//     console.log(errorCode)
//     console.log(errorMessage)
//     const credential = GoogleAuthProvider.credentialFromError(error);
//   });
// })


// SIGN IN FUNCTION: 
let loginBtn = document.querySelector("#loginBtn");
if(loginBtn){
  const login = () => {
    let loginEmailUser  = document.querySelector("#loginEmail").value;
    let loginPasswordUser  = document.querySelector("#loginPassword").value;
    console.log("loginEmail" , loginEmailUser)
    signInWithEmailAndPassword(auth, loginEmailUser, loginPasswordUser)
    .then((userCredential) => {
      const user = userCredential.user.uid;
      console.log("current User UID -> " , user);
      alert("Successfully Login!.");
      window.location.href = 'index.html'
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode)
      console.log(errorMessage)
    });

  }

  loginBtn.addEventListener("click" , login) 
}


////////////////////////////////////////////////////////////////////
const uploadToStorage = async (file) => {
// const file = document.querySelector("#inputGroupFile02") 
// const user = await getAuth().currentUser;
// const uid = user.uid;
// console.log(uid)

return new Promise((resolve , reject) => {
  const fileName = file.name;
  const storageRef = ref(storage, `users/12kj45iu76yt`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');

      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    }, 
      
    (error) => {
      console.log(error.message)
      console.log(error.code)
      reject(error);
    },

    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        // console.log('File available at', downloadURL);
        resolve(downloadURL)
      });
    }
  );
});
}

const uploadFile = async () => {
  const file = document.querySelector("#inputGroupFile02");
  const showImage = document.querySelector("#img");
  const signUpForm = document.querySelector("#signUpForm");
  let url = await uploadToStorage(file.files[0]);
  console.log("url: " + url);
  console.log(typeof(url));

  localStorage.setItem("Image" ,(url));
  

//   const imageSnapShot = await addDoc(collection(db, "SelectedItems"), {
//     total,
//     productID,
//     price,
//     quantity,
//     isChecked: true
// });

  showImage.classList.add("showImg")
  signUpForm.classList.add("wid")
} 

const uploadBtn = document.querySelector("#uploadBtn");
if (uploadBtn) {
  uploadBtn.addEventListener("click",uploadFile)
} 

 const file = document.querySelector("#inputGroupFile02");
 if(file){
  file.addEventListener("change" , e => {
    const imageTarget = document.querySelector("#img");
 
    if(imageTarget){
      imageTarget.src = URL.createObjectURL(e.target.files[0])
    }
  })
 }
 ////////////////////////////////////////////////////////////////////


   


// redirectTo Login Form 
const loginLink = document.querySelector("#loginLink");
if(loginLink){
  loginLink.addEventListener("click" , () => {
    window.location.href = 'signIn.html'
  })
}

// redirectTo sign Up Form
const signUpLink = document.querySelector(".signUpLink");
if(signUpLink){
  signUpLink.addEventListener("click" , () => {
    window.location.href = 'signUp.html'
  })
}


