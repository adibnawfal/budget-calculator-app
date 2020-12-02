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
import { Provider, Portal, Dialog, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { wp, hp } from "../../config/Dimensions";
import { colors } from "../../res/colors";
import { icons } from "../../res/icons";
import { Loading } from "../../components";
import ForgotPasswordImage from "../../assets/images/forgotpassword.svg";

export default function ForgotPasswordScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = () => {
    if (email != "") {
      setLoading(true);

      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          setError(null);
          setEmail("");
          setVisible(true);
          setLoading(false);
          Keyboard.dismiss();
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
          Keyboard.dismiss();
        });
    } else {
      setError("Please enter email address");
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
          <Portal>
            <Dialog
              visible={visible}
              onDismiss={() => setVisible(false)}
              style={{ backgroundColor: colors.white }}
            >
              <Dialog.Title style={styles.alerttitleTxt}>
                Email Sent
              </Dialog.Title>
              <Dialog.Content>
                <Text style={styles.signoutTxt}>Please check your email.</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  color={colors.primary}
                  labelStyle={styles.alertparaTxt}
                  onPress={() => navigation.pop()}
                >
                  OK
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
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
            <Text style={styles.titleTxt}>Forgot Password</Text>
            <Text style={styles.subtitleTxt}>
              Enter the email address associated
            </Text>
            <Text style={styles.subtitleTxt}>with this account.</Text>
          </View>
          <View
            style={[styles.image, { marginVertical: error ? hp(24) : hp(37) }]}
          >
            <ForgotPasswordImage />
          </View>
          {error && <Text style={styles.errorTxt}>{error}</Text>}
          <View style={{ width: "100%" }}>
            <View style={[styles.inputWrap, { marginBottom: hp(20) }]}>
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
            <TouchableOpacity
              style={styles.recoverBtn}
              onPress={() => handleForgotPassword()}
            >
              <Text style={styles.recoverTxt}>Reset Password</Text>
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
    height: hp(157.9),
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
    borderColor: colors.darkGrey,
    borderBottomWidth: hp(1),
  },
  inputTxt: {
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: colors.black,
    paddingBottom: hp(12),
  },
  recoverBtn: {
    height: hp(43),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
  },
  recoverTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.white,
  },
});
