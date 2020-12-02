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
import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { wp, hp } from "../../config/Dimensions";
import { colors } from "../../res/colors";
import { icons } from "../../res/icons";
import { Loading } from "../../components";
import ChangePasswordImage from "../../assets/images/changepassword.svg";

export default function ChangePasswordScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [secureCurrent, setSecureCurrent] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const reauthenticate = (currentPass) => {
    const user = firebase.auth().currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPass
    );

    return user.reauthenticateWithCredential(cred);
  };

  const handleChangePassword = () => {
    if (newPass == "") {
      setError("Password cannot be empty");
    } else {
      if (newPass == confirmPass) {
        setLoading(true);

        reauthenticate(currentPass)
          .then(() => {
            firebase
              .auth()
              .currentUser.updatePassword(confirmPass)
              .then(() => {
                setError(null);
                setVisible(true);
                setNewPass("");
                setConfirmPass("");
                setLoading(false);
                Keyboard.dismiss();
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
        setError("Passwords do not match");
      }
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
                Password Changed
              </Dialog.Title>
              <Dialog.Content>
                <Text style={styles.signoutTxt}>
                  You can now use your new password to sign in to your account.
                </Text>
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
            <Text style={styles.titleTxt}>Change Password</Text>
            <Text style={styles.subtitleTxt}>
              Enter a new password to continue.
            </Text>
          </View>
          <View
            style={[styles.image, { marginVertical: error ? hp(24) : hp(37) }]}
          >
            <ChangePasswordImage />
          </View>
          {error && <Text style={styles.errorTxt}>{error}</Text>}
          <View style={{ width: "100%" }}>
            <View style={[styles.inputWrap, { marginBottom: hp(15) }]}>
              <TextInput
                placeholder="Current Password"
                placeholderTextColor={colors.darkGrey}
                secureTextEntry={secureCurrent}
                style={styles.inputTxt}
                onChangeText={(currentPass) => setCurrentPass(currentPass)}
                value={currentPass}
              />
              {currentPass ? (
                <TouchableOpacity
                  onPress={() => setSecureCurrent(!secureCurrent)}
                >
                  <Ionicons
                    name={secureCurrent ? "ios-eye" : "ios-eye-off"}
                    size={24}
                    color={colors.darkGrey}
                    style={{ marginHorizontal: wp(10) }}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={[styles.inputWrap, { marginBottom: hp(15) }]}>
              <TextInput
                placeholder="New Password"
                placeholderTextColor={colors.darkGrey}
                secureTextEntry={secureNew}
                style={styles.inputTxt}
                onChangeText={(newPass) => setNewPass(newPass)}
                value={newPass}
              />
              {newPass ? (
                <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
                  <Ionicons
                    name={secureNew ? "ios-eye" : "ios-eye-off"}
                    size={24}
                    color={colors.darkGrey}
                    style={{ marginHorizontal: wp(10) }}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={[styles.inputWrap, { marginBottom: hp(20) }]}>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor={colors.darkGrey}
                secureTextEntry={secureConfirm}
                style={styles.inputTxt}
                onChangeText={(confirmPass) => setConfirmPass(confirmPass)}
                value={confirmPass}
              />
              {confirmPass ? (
                <TouchableOpacity
                  onPress={() => setSecureConfirm(!secureConfirm)}
                >
                  <Ionicons
                    name={secureConfirm ? "ios-eye" : "ios-eye-off"}
                    size={24}
                    color={colors.darkGrey}
                    style={{ marginHorizontal: wp(10) }}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity
              style={styles.changepassBtn}
              onPress={() => handleChangePassword()}
            >
              <Text style={styles.changepassTxt}>Change Password</Text>
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
    height: hp(168.91),
    marginVertical: hp(37),
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
  changepassBtn: {
    height: hp(43),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
  },
  changepassTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.white,
  },
});
