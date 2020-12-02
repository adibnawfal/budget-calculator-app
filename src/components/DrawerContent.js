import React from "react";
import firebase from "../config/Fire";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Provider, Portal, Dialog, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerItemList } from "@react-navigation/drawer";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { wp, hp } from "../config/Dimensions";
import { colors } from "../res/colors";
import { icons } from "../res/icons";
import { images } from "../res/images";

export default function DrawerContent(props) {
  const [visible, setVisible] = React.useState(false);

  let [fontsLoaded] = useFonts({
    Regular: require("../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../assets/fonts/OpenSans-Bold.ttf"),
  });

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then()
      .catch((error) => {
        alert(error);
      });
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <Portal>
          <Dialog
            visible={visible}
            onDismiss={() => setVisible(false)}
            style={{ width: "100%", backgroundColor: colors.white }}
          >
            <Dialog.Title style={styles.alerttitleTxt}>Sign Out</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.signoutTxt}>
                Are you sure you want to sign out?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                color={colors.primary}
                labelStyle={styles.alertparaTxt}
                onPress={() => setVisible(false)}
              >
                CANCEL
              </Button>
              <Button
                color={colors.primary}
                labelStyle={styles.alertparaTxt}
                onPress={() => handleSignOut()}
              >
                SIGN OUT
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <View>
          <View style={styles.headerWrap}>
            <Image source={images.logo} style={styles.image} />
            <View>
              <Text style={styles.titleTxt}>Budget</Text>
              <Text style={styles.subtitleTxt}>Calculator</Text>
            </View>
          </View>
          <DrawerItemList {...props} />
        </View>
        <View style={styles.signoutWrap}>
          <Text style={[styles.signoutTxt, { marginLeft: wp(30) }]}>
            Sign Out
          </Text>
          <TouchableOpacity
            style={styles.signoutBox}
            onPress={() => setVisible(true)}
          >
            <Image source={icons.signout} style={styles.signoutIcon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: wp(22),
    paddingVertical: hp(25),
    justifyContent: "space-between",
  },
  headerWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(5),
    marginBottom: hp(30),
  },
  image: {
    resizeMode: "contain",
    width: wp(55),
    height: hp(55),
    marginRight: wp(27),
  },
  titleTxt: {
    fontFamily: "Bold",
    fontSize: hp(16),
    color: colors.primary,
  },
  subtitleTxt: {
    fontFamily: "SemiBold",
    fontSize: hp(16),
    color: colors.darkGrey,
  },
  signoutWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: wp(10),
  },
  signoutTxt: {
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: colors.black,
  },
  signoutBox: {
    width: wp(45),
    height: wp(45),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: colors.lightGrey,
  },
  signoutIcon: {
    resizeMode: "contain",
    width: wp(25),
    height: hp(25),
    tintColor: colors.black,
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
