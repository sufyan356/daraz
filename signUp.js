import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth, onAuthStateChanged , createUserWithEmailAndPassword , signInWithEmailAndPassword     } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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

// SIGN UP FUNCTION: 
let signUpBtn  = document.querySelector("#signUpBtn");
if(signUpBtn){
  const signUp = (event) => {
    event.preventDefault();

    let signUpUserName  = document.querySelector("#exampleInputName1").value;
    let signUpEmail  = document.querySelector("#exampleInputEmail1").value;
    let signUpPassword  = document.querySelector("#exampleInputPassword1").value;
    if(!signUpUserName){
      alert("PLEASE FILL NAME FIELD!..")
      return;
    }
    else{
      createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
      .then( async (userCredential) => {
        let docRef;
        const user = userCredential.user;
          docRef = await addDoc(collection(db, "usersInfo"), {
          signUpUserName,
          signUpEmail,
          signUpPassword
        });

        await updateDoc(docRef, { docId: docRef.id });
        console.log("AFTER UPDATE FUNCTION RUN!..")
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
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          console.log("current User UID -> " , uid);
        } 
        
        else {
          console.log("Nikal!..")
        }
      });
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







let inputGroupFile02  = document.querySelector("#inputGroupFile02");
if(inputGroupFile02){
  inputGroupFile02.addEventListener("change" , (e) => {
   
    console.log(e.target.files[0])
});
}