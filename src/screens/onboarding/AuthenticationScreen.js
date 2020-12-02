import React, { useEffect } from "react";
import firebase from "../../config/Fire";

import { Loading } from "../../components";

export default function AuthenticationScreen({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      firebase.auth().onAuthStateChanged((user) => {
        navigation.replace(user ? "HomeApp" : "Welcome");
      });
    });

    return unsubscribe;
  }, []);

  return <Loading />;
}
