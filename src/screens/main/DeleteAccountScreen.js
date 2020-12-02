import React, { useState } from "react";
import firebase from "../../config/Fire";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Keyboard,
  StatusBar,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { wp, hp } from "../../config/Dimensions";
import { colors } from "../../res/colors";
import { icons } from "../../res/icons";
import { Loading } from "../../components";

export default function DeleteAccountScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const [confirmation, setConfirmation] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [secure, setSecure] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const reauthenticate = (currentPass) => {
    const user = firebase.auth().currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPass
    );

    return user.reauthenticateWithCredential(cred);
  };

  const handleDeleteAccount = () => {
    if (currentPass != "") {
      setLoading(true);

      reauthenticate(currentPass)
        .then(() => {
          firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .delete()
            .then(() => {
              firebase
                .auth()
                .currentUser.delete()
                .then(() => {
                  Alert.alert(
                    "Account Deleted",
                    "Your account has been deleted, thank you for using our apps",
                    [{ text: "OK" }],
                    { cancelable: true }
                  );

                  setError(null);
                  setLoading(false);
                  Keyboard.dismiss();
                })
                .catch((error) => {
                  setError(error.message);
                  setLoading(false);
                  Keyboard.dismiss();
                });
            })
            .catch((error) => {
              setError(error.message);
              setLoading(false);
              Keyboard.dismiss();
            });
        })
        .catch(() => {
          setError("Current password is invalid");
          setLoading(false);
          Keyboard.dismiss();
        });
    } else {
      setError("Please enter your password");
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll
      style={{ backgroundColor: colors.white }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="always"
    >
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <View style={{ width: "100%" }}>
          <TouchableOpacity
            style={{ width: wp(40) }}
            onPress={() => navigation.pop()}
          >
            <Image source={icons.back} style={styles.headerIcon} />
          </TouchableOpacity>
          <View style={{ marginVertical: hp(30) }}>
            <Text style={styles.titleTxt}>Delete this account?</Text>
            <Text style={styles.subtitleTxt}>
              Confirm you want to delete this account by
            </Text>
            <Text style={styles.subtitleTxt}>
              typing:{" "}
              <Text style={{ fontFamily: "Bold", color: colors.black }}>
                delete
              </Text>
            </Text>
          </View>
        </View>
        {error && <Text style={styles.errorTxt}>{error}</Text>}
        <View style={{ width: "100%" }}>
          <View style={[styles.inputWrap, { marginBottom: hp(15) }]}>
            <TextInput
              placeholder="delete"
              placeholderTextColor={colors.darkGrey}
              autoCapitalize="none"
              style={styles.inputTxt}
              onChangeText={(confirmation) => setConfirmation(confirmation)}
              value={confirmation}
            />
          </View>
          {confirmation == "delete" ? (
            <View style={[styles.inputWrap, { marginBottom: hp(15) }]}>
              <TextInput
                placeholder="Current Password"
                placeholderTextColor={colors.darkGrey}
                secureTextEntry={secure}
                style={styles.inputTxt}
                onChangeText={(currentPass) => setCurrentPass(currentPass)}
                value={currentPass}
              />
              {currentPass ? (
                <TouchableOpacity onPress={() => setSecure(!secure)}>
                  <Ionicons
                    name={secure ? "ios-eye" : "ios-eye-off"}
                    size={24}
                    color={colors.darkGrey}
                    style={{ marginHorizontal: wp(10) }}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
          <TouchableOpacity
            style={[
              styles.deleteaccBtn,
              {
                backgroundColor:
                  confirmation == "delete" ? "red" : colors.darkGrey,
              },
            ]}
            disabled={confirmation == "delete" ? false : true}
            onPress={() => handleDeleteAccount()}
          >
            <Text style={styles.deleteaccTxt}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: wp(27),
    paddingVertical: hp(25),
    alignItems: "center",
  },
  headerIcon: {
    resizeMode: "contain",
    width: wp(24),
    height: hp(24),
    tintColor: colors.black,
  },
  titleTxt: {
    fontFamily: "Bold",
    fontSize: hp(16),
    color: "red",
    marginBottom: hp(5),
  },
  subtitleTxt: {
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: colors.darkGrey,
  },
  errorTxt: {
    width: "80%",
    textAlign: "center",
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: "red",
    marginBottom: hp(30),
  },
  inputWrap: {
    flexDirection: "row",
    borderColor: colors.darkGrey,
    borderBottomWidth: hp(1),
  },
  inputTxt: {
    flex: 1,
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: colors.black,
    paddingBottom: hp(12),
  },
  deleteaccBtn: {
    height: hp(43),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
  },
  deleteaccTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.white,
  },
});
