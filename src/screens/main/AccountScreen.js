import React, { useState, useEffect } from "react";
import firebase from "../../config/Fire";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  StatusBar,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Provider, Menu, Portal, Dialog, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { wp, hp } from "../../config/Dimensions";
import { colors } from "../../res/colors";
import { icons } from "../../res/icons";
import { Loading } from "../../components";
import AccountImage from "../../assets/images/account.svg";

export default function AccountScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const accountRef = firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [menu, setMenu] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = accountRef.onSnapshot((doc) => {
      if (doc.exists) {
        setName(doc.data().name);
        setPhone(doc.data().phone);
        setEmail(firebase.auth().currentUser.email);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const updateAccount = () => {
    if (name == "") {
      alert("Your name cannot be empty");
    } else {
      setLoading(true);

      firebase
        .auth()
        .currentUser.updateEmail(email)
        .then(() => {
          if (phone == null) {
            accountRef
              .update({ name: name })
              .then(() => {
                setEdit(false);
                setVisible(true);
                setLoading(false);
                Keyboard.dismiss();
              })
              .catch((error) => {
                alert(error.message);
                setLoading(false);
                Keyboard.dismiss();
              });
          } else {
            accountRef
              .update({ name: name, phone: phone })
              .then(() => {
                setEdit(false);
                setVisible(true);
                setLoading(false);
                Keyboard.dismiss();
              })
              .catch((error) => {
                alert(error.message);
                setLoading(false);
                Keyboard.dismiss();
              });
          }
        })
        .catch((error) => {
          alert(error.message);
          setLoading(false);
          Keyboard.dismiss();
        });
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
                Account Updated
              </Dialog.Title>
              <Dialog.Content>
                <Text style={styles.signoutTxt}>
                  Your account has been successfully updated
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  color={colors.primary}
                  labelStyle={styles.alertparaTxt}
                  onPress={() => setVisible(false)}
                >
                  OK
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <View style={{ width: "100%", alignItems: "center" }}>
            <View style={styles.headerWrap}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image source={icons.drawer} style={styles.headerIcon} />
              </TouchableOpacity>
              <Text style={styles.headerTxt}>Account</Text>
              <Menu
                visible={menu}
                onDismiss={() => setMenu(false)}
                contentStyle={{
                  backgroundColor: colors.white,
                }}
                anchor={
                  <TouchableOpacity onPress={() => setMenu(true)}>
                    <Image source={icons.menu} style={styles.headerIcon} />
                  </TouchableOpacity>
                }
              >
                <Menu.Item
                  title="Change password"
                  onPress={() => {
                    navigation.navigate("ChangePassword");
                    setMenu(false);
                  }}
                  titleStyle={{
                    fontFamily: "SemiBold",
                    fontSize: hp(12),
                    color: colors.black,
                  }}
                />
                <Menu.Item
                  title="Delete account"
                  onPress={() => {
                    navigation.navigate("DeleteAccount");
                    setMenu(false);
                  }}
                  titleStyle={{
                    fontFamily: "SemiBold",
                    fontSize: hp(12),
                    color: colors.black,
                  }}
                />
              </Menu>
            </View>
            <View style={styles.image}>
              <AccountImage />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputtitleTxt}>Full Name</Text>
              <TextInput
                numberOfLines={1}
                placeholder={edit ? null : name}
                placeholderTextColor={colors.darkGrey}
                editable={edit ? true : false}
                style={styles.inputTxt}
                onChangeText={(name) => setName(name)}
                value={edit ? name : null}
              />
            </View>
            <View style={[styles.inputWrap, { marginVertical: hp(20) }]}>
              <Text style={styles.inputtitleTxt}>Email Address</Text>
              <TextInput
                numberOfLines={1}
                placeholder={edit ? null : email}
                placeholderTextColor={colors.darkGrey}
                editable={edit ? true : false}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.inputTxt}
                onChangeText={(email) => setEmail(email)}
                value={edit ? email : null}
              />
            </View>
            <View style={[styles.inputWrap, { marginBottom: hp(20) }]}>
              <Text style={styles.inputtitleTxt}>Phone Number</Text>
              <TextInput
                numberOfLines={1}
                placeholder={edit ? null : phone}
                placeholderTextColor={colors.darkGrey}
                editable={edit ? true : false}
                keyboardType="phone-pad"
                style={styles.inputTxt}
                onChangeText={(phone) => setPhone(phone)}
                value={edit ? phone : null}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.editaccountBtn}
            onPress={() => (edit ? updateAccount() : setEdit(true))}
          >
            <Text style={styles.editaccountTxt}>
              {edit ? "Update Account" : "Edit Account"}
            </Text>
          </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  headerIcon: {
    resizeMode: "contain",
    width: wp(24),
    height: hp(24),
    tintColor: colors.black,
  },
  headerTxt: {
    fontFamily: "Bold",
    fontSize: hp(16),
    color: colors.black,
  },
  image: {
    width: wp(200),
    height: hp(169.13),
    marginVertical: hp(30),
  },
  inputWrap: {
    width: "100%",
    borderColor: colors.darkGrey,
    borderBottomWidth: hp(1),
  },
  inputtitleTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.black,
  },
  inputTxt: {
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: colors.black,
    paddingVertical: hp(12),
  },
  editaccountBtn: {
    width: "100%",
    height: hp(43),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
  },
  editaccountTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.white,
  },
  alerttitleTxt: {
    fontFamily: "Bold",
    fontSize: hp(16),
    color: colors.black,
  },
  alertparaTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.primary,
  },
});
