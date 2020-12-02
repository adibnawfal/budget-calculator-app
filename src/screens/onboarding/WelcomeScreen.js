import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { wp, hp } from "../../config/Dimensions";
import { colors } from "../../res/colors";
import WelcomeImage from "../../assets/images/welcome.svg";

export default function WelcomeScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={{ alignItems: "center" }}>
        <Text style={styles.titleTxt}>Welcome</Text>
        <Text style={styles.subtitleTxt}>
          Thank you for using our app. This app will
        </Text>
        <Text style={styles.subtitleTxt}>
          help you to calculate your needs.
        </Text>
      </View>
      <View style={styles.image}>
        <WelcomeImage />
      </View>
      <View style={{ width: "100%" }}>
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.signupTxt}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signinBtn}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.signinTxt}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() => navigation.navigate("ExpressHome")}
      >
        <Text style={styles.expressTxt}>Try express calculator now</Text>
        <Ionicons name="ios-arrow-forward" size={20} color={colors.black} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: wp(27),
    paddingVertical: hp(54),
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleTxt: {
    fontFamily: "Bold",
    fontSize: hp(16),
    color: colors.primary,
    marginBottom: hp(5),
  },
  subtitleTxt: {
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: colors.darkGrey,
  },
  image: {
    width: wp(240),
    height: hp(184.54),
  },
  signupBtn: {
    height: hp(43),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
    marginBottom: hp(15),
  },
  signupTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.white,
  },
  signinBtn: {
    height: hp(43),
    borderWidth: wp(2),
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
  },
  signinTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.primary,
  },
  expressTxt: {
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: colors.black,
    marginRight: wp(15),
  },
});
