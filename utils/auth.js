import React, { useState, useEffect, useContext, createContext } from "react";
import queryString from "query-string";
import * as firebase from "firebase/app";
import "firebase/auth";

if (!firebase.apps.length) {
  const firebaseConfig = {
    // apiKey: "AIzaSyCAZCDWo6V-j7j-l4U4PYksRGZQ6VOPmAI",
    // authDomain: "red-planes-66ada.firebaseapp.com",
    // databaseURL: "https://red-planes-66ada.firebaseio.com",
    // projectId: "red-planes-66ada",
    // storageBucket: "red-planes-66ada.appspot.com",
    // messagingSenderId: "492770377202",
    // appId: "1:492770377202:web:2cb73ea96877e356e7bf6b",
    // measurementId: "G-84M9G5E8QK",
    apiKey: "AIzaSyCsSKnOLZSWNxqobn_MejmIZgesOArnLzs",
    authDomain: "planesredproject.firebaseapp.com",
    databaseURL: "https://planesredproject-default-rtdb.firebaseio.com",
    projectId: "planesredproject",
    storageBucket: "planesredproject.appspot.com",
    messagingSenderId: "318219840684",
    appId: "1:318219840684:web:6eabbaaaf640d34b9e0309",
    measurementId: "G-K386MXSKHW",
  };

  firebase.initializeApp(firebaseConfig);
}

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signup = (email, password) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false);
      });
  };

  const sendPasswordResetEmail = email => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (password, code) => {
    const resetCode = code || getFromQueryString("oobCode");

    return firebase
      .auth()
      .confirmPasswordReset(resetCode, password)
      .then(() => {
        return true;
      });
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    userId: user && user.uid,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
}

const getFromQueryString = key => {
  return queryString.parse(window.location.search)[key];
};
