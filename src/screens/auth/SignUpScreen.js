import React, { useState } from "react";
import firebase from "../../config/Fire";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Switch,
  Image,
  Keyboard,
  ScrollView,
  StatusBar,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Provider, Portal, Dialog, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { wp, hp } from "../../config/Dimensions";
import { colors } from "../../res/colors";
import { icons } from "../../res/icons";
import { Loading } from "../../components";
import SignUpImage from "../../assets/images/signup.svg";

export default function SignUpScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [error, setError] = useState(null);
  const [policy, setPolicy] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    if (name != "") {
      if (email != "") {
        if (password != "") {
          if (policy != false) {
            setLoading(true);

            firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                const userRef = firebase
                  .firestore()
                  .collection("users")
                  .doc(firebase.auth().currentUser.uid);

                userRef.set({ name: name, phone: null });

                userRef.collection("express").doc("expressDoc").set({
                  date: null,
                  time: null,
                });

                userRef.collection("budget").doc("incomeDoc").set({
                  no: 0,
                  title: "Income",
                  date: null,
                  time: null,
                  data: [],
                });

                userRef.collection("budget").doc("expenseDoc").set({
                  no: 1,
                  title: "Expense",
                  data: [],
                });

                userRef.collection("balance").doc("balanceDoc").set({
                  date: null,
                  time: null,
                });

                setError(null);
                setName("");
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
            setError(null);
            setVisible(true);
            Keyboard.dismiss();
          }
        } else {
          setError("Please enter your password");
        }
      } else {
        setError("Please enter your email address");
      }
    } else {
      setError("Please enter your name");
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Provider>
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
          <Portal>
            <Dialog
              visible={visible}
              onDismiss={() => setVisible(false)}
              style={{ backgroundColor: colors.white }}
            >
              <Dialog.Title style={styles.alerttitleTxt}>
                Terms and Conditions
              </Dialog.Title>
              <Dialog.ScrollArea style={{ height: hp(350) }}>
                <ScrollView>
                  <Text style={styles.alertparaTxt}>
                    Welcome to our application! Please read the terms and
                    policies before accepting so you are clear on what terms we
                    are imposing on you.
                  </Text>
                  <Text style={styles.alertparaTxt}>
                    By using this application you are agreeing to be bound by
                    our term and conditions. If you disagree with any part of
                    the terms then you are not granted access to this
                    application.
                  </Text>
                  <Text style={styles.alertheadTxt}>Plagiarism</Text>
                  <Text style={styles.alertparaTxt}>
                    The application and it's features are the product of hard
                    work of PUO's students. Therefore any intentions of or acts
                    of blatant plagiarism are strictly not allowed.
                  </Text>
                  <Text style={styles.alertheadTxt}>Privacy Policy</Text>
                  <Text style={styles.alertparaTxt}>
                    This policy explains what information we collect when you
                    use the application and its' services.
                  </Text>
                  <Text style={styles.alertparaTxt}>
                    Information we collect and how we use it:
                  </Text>
                  <Text style={styles.alertparaTxt}>
                    {"\t\t"}1. Email address.{"\n\t\t"}2. Name.{"\n\t\t"}3. Item
                    data.
                  </Text>
                  <Text style={styles.alertparaTxt}>
                    We don't make money from collecting these kind of
                    information from you so rest assured. This policy only
                    exists to fulfill the requirements of our project.
                  </Text>
                  <Text style={[styles.alertparaTxt, { marginBottom: hp(15) }]}>
                    The email address is used so you can reset your password in
                    case you forget it and the name is only to fill up data in
                    our database.
                  </Text>
                </ScrollView>
              </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button
                  color={colors.primary}
                  labelStyle={styles.alertbtnTxt}
                  onPress={() => {
                    setPolicy(false);
                    setVisible(false);
                  }}
                >
                  DECLINE
                </Button>
                <Button
                  color={colors.primary}
                  labelStyle={styles.alertbtnTxt}
                  onPress={() => {
                    setPolicy(true);
                    setVisible(false);
                  }}
                >
                  ACCEPT
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <View style={{ width: "100%" }}>
            <TouchableOpacity
              style={{ width: wp(40) }}
              onPress={() => navigation.pop()}
            >
              <Image source={icons.back} style={styles.headerIcon} />
            </TouchableOpacity>
            <Text style={styles.titleTxt}>Sign Up</Text>
            <Text style={styles.subtitleTxt}>Sign up and get started.</Text>
          </View>
          <View style={styles.image}>
            <SignUpImage />
          </View>
          {error && <Text style={styles.errorTxt}>{error}</Text>}
          <View style={{ width: "100%" }}>
            <View style={styles.inputWrap}>
              <TextInput
                placeholder="Full Name"
                placeholderTextColor={colors.darkGrey}
                style={styles.inputTxt}
                onChangeText={(name) => setName(name)}
                value={name}
              />
            </View>
            <View style={[styles.inputWrap, { marginVertical: hp(15) }]}>
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
            <View style={styles.policyWrap}>
              <Switch
                value={policy ? true : false}
                onValueChange={() => setPolicy(!policy)}
                trackColor={{
                  true: colors.secondary,
                  false: colors.lightGrey,
                }}
                thumbColor={policy ? colors.primary : "#f4f3f4"}
              />
              <TouchableOpacity onPress={() => setVisible(true)}>
                <Text style={styles.policyTxt}>
                  I accept the Terms and Conditions
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.signupBtn}
              onPress={() => handleSignUp()}
            >
              <Text style={[styles.policyTxt, { color: colors.white }]}>
                Sign Up
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
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={[styles.signinTxt, { paddingBottom: hp(0) }]}>
                Already have an account?
                <Text style={styles.policyTxt}> Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </Provider>
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
    textAlign: "center",
    color: colors.primary,
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
    height: hp(144.97),
    marginVertical: hp(24),
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
  policyWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(20),
  },
  policyTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.primary,
  },
  signupBtn: {
    height: hp(43),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
  },
  signinTxt: {
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: colors.black,
  },
  alerttitleTxt: {
    fontFamily: "Bold",
    fontSize: hp(14),
    color: colors.primary,
    textAlign: "center",
  },
  alertheadTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.black,
    marginTop: hp(15),
  },
  alertparaTxt: {
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: colors.darkGrey,
    marginTop: hp(15),
  },
  alertbtnTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.primary,
  },
});
