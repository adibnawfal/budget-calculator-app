import React from "react";
import firebase from "../../config/Fire";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { wp, hp } from "../../config/Dimensions";
import { colors } from "../../res/colors";
import { icons } from "../../res/icons";

export default function ShowReceiptScreen({ navigation, route }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const deleteReceipt = () => {
    const { data, index } = route.params;

    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("receipt")
      .doc(data[index].id)
      .delete();

    navigation.pop();
  };

  const renderList = (item) => {
    const price = parseFloat(item.price).toFixed(2);

    return (
      <View style={styles.listWrap}>
        <View style={{ flex: 1, marginRight: wp(20) }}>
          <Text numberOfLines={1} style={styles.listTxt}>
            {item.itemName}
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.listTxt, { color: colors.darkGrey }]}
          >
            Quantity {item.qty}
          </Text>
        </View>
        <Text style={[styles.listTxt, { fontFamily: "Bold" }]}>RM{price}</Text>
      </View>
    );
  };

  const { item } = route.params;

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
      <View style={{ width: "100%" }}>
        <TouchableOpacity
          style={{ width: wp(40) }}
          onPress={() => navigation.pop()}
        >
          <Image source={icons.back} style={styles.headerIcon} />
        </TouchableOpacity>
        <View style={{ marginVertical: hp(30) }}>
          <Text style={styles.totalpricetitleTxt}>Total Price</Text>
          <Text style={styles.totalpriceTxt}>
            RM{" "}
            <Text style={{ fontSize: hp(34) }} numberOfLines={1}>
              {item.totalPrice}
            </Text>
          </Text>
          <Text style={[styles.totalpricetitleTxt, { fontFamily: "SemiBold" }]}>
            Saved on: {item.date} {item.time}
          </Text>
        </View>
        <Text style={[styles.headerTxt, { marginBottom: hp(10) }]}>
          List items ({item.data.length})
        </Text>
        <FlatList
          data={item.data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderList(item)}
          style={{ height: hp(335) }}
          keyboardShouldPersistTaps="always"
        />
      </View>
      <TouchableOpacity
        style={styles.deletereceiptBtn}
        onPress={() => deleteReceipt()}
      >
        <Text style={styles.deletereceiptTxt}>Delete Receipt</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
  totalpricetitleTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.darkGrey,
  },
  totalpriceTxt: {
    fontFamily: "Bold",
    fontSize: hp(22),
    color: colors.primary,
  },
  listWrap: {
    flexDirection: "row",
    width: "100%",
    height: hp(58),
    alignItems: "center",
    paddingHorizontal: wp(22),
    borderRadius: wp(10),
    backgroundColor: colors.lightGrey,
    marginBottom: hp(10),
  },
  listTxt: {
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: colors.black,
  },
  image: {
    width: wp(200),
    height: hp(184.38),
    marginBottom: hp(30),
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
  deletereceiptBtn: {
    width: "100%",
    height: hp(43),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
  },
  deletereceiptTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.white,
  },
});
