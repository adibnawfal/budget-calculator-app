import React, { useState } from "react";
import firebase from "../../config/Fire";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
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
import SignInImage from "../../assets/images/signin.svg";

export default function SignInScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    if (email != "") {
      if (password != "") {
        setLoading(true);

        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            setError(null);
            setEmail("");
            setPassword("");
            setLoading(false);
            Keyboard.dismiss();
          })
          .catch((error) => {
            setError(error.message);
            setLoading(false);
            Keyboard.dismiss();
          });
      } else {
        setError("Please enter your password");
      }
    } else {
      setError("Please enter your email address");
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
          <Text style={styles.titleTxt}>Sign In</Text>
          <Text style={styles.subtitleTxt}>Sign in to continue.</Text>
        </View>
        <View
          style={[styles.image, { marginVertical: error ? hp(24) : hp(43) }]}
        >
          <SignInImage />
        </View>
        {error && <Text style={styles.errorTxt}>{error}</Text>}
        <View style={{ width: "100%" }}>
          <View style={[styles.inputWrap, { marginBottom: hp(15) }]}>
            <TextInput
              placeholder="Email Address"
              placeholderTextColor={colors.darkGrey}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.inputTxt}
              onChangeText={(email) => setEmail(email)}
              value={email}
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.darkGrey}
              secureTextEntry={secure}
              style={styles.inputTxt}
              onChangeText={(password) => setPassword(password)}
              value={password}
            />
            {password ? (
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
          <TouchableOpacity
            style={{ alignItems: "flex-end", marginVertical: hp(20) }}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotpassTxt}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signinBtn}
            onPress={() => handleSignIn()}
          >
            <Text style={[styles.forgotpassTxt, { color: colors.white }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            marginTop: hp(43),
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signupTxt}>
              Don’t have an account?
              <Text style={styles.forgotpassTxt}> Sign Up</Text>
            </Text>
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
    marginHorizontal: wp(27),
    marginVertical: hp(25),
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
    color: colors.primary,
    textAlign: "center",
    marginBottom: hp(5),
  },
  subtitleTxt: {
    fontFamily: "SemiBold",
    fontSize: hp(12),
    textAlign: "center",
    color: colors.darkGrey,
  },
  image: {
    width: wp(200),
    height: hp(165.68),
  },
  errorTxt: {
    width: "80%",
    textAlign: "center",
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: "red",
    marginBottom: hp(24),
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
  forgotpassTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.primary,
  },
  signinBtn: {
    height: hp(43),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
  },
  signupTxt: {
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: colors.black,
  },
});
