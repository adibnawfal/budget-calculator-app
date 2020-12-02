import React, { useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { wp, hp } from "../../config/Dimensions";
import { colors } from "../../res/colors";
import { icons } from "../../res/icons";

export default function AddListScreen({ navigation, route }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const [itemName, setItemName] = useState("");

  const listRef = firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("list");

  const addList = () => {
    const { data } = route.params;

    if (itemName != "") {
      listRef.add({
        no: data.length,
        itemName: itemName,
        completed: false,
      });

      setItemName("");
      Keyboard.dismiss();
      navigation.pop();
    } else {
      alert("Please enter item name");
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
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
          <Text style={styles.titleTxt}>Add list item</Text>
          <View style={{ marginBottom: hp(30) }}>
            <View style={styles.inputWrap}>
              <Text style={styles.inputtitleTxt}>Item Name</Text>
              <TextInput
                placeholder="e.g. Hand towel"
                placeholderTextColor={colors.darkGrey}
                style={styles.inputTxt}
                onChangeText={(itemName) => setItemName(itemName)}
                value={itemName}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.additemBtn} onPress={() => addList()}>
          <Text style={styles.additemTxt}>Add Item</Text>
        </TouchableOpacity>
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
    justifyContent: "space-between",
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
    color: colors.black,
    marginVertical: hp(30),
  },
  inputWrap: {
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
  additemBtn: {
    width: "100%",
    height: hp(43),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
  },
  additemTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.white,
  },
});
