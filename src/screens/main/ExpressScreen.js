import React, { useState } from "react";
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
import { Provider, Menu } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { wp, hp } from "../../config/Dimensions";
import { colors } from "../../res/colors";
import { icons } from "../../res/icons";
import { useDateTime } from "../../data/useDateTime";
import { useData } from "../../data/useData";
import { useReceipt } from "../../data/useReceipt";
import { Loading, ExpressList } from "../../components";
import ExpressImage from "../../assets/images/express.svg";

export default function ExpressScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const useridRef = firebase.auth().currentUser.uid;

  const expressRef = firebase
    .firestore()
    .collection("users")
    .doc(useridRef)
    .collection("express")
    .doc("expressDoc");

  const receiptRef = firebase
    .firestore()
    .collection("users")
    .doc(useridRef)
    .collection("receipt");

  const { date, time } = useDateTime(expressRef);
  const { loading, data } = useData(expressRef);
  const { receipt } = useReceipt(receiptRef);
  const [clear, setClear] = useState(false);
  const [menu, setMenu] = useState(false);

  const addReceipt = (totalPrice) => {
    const length = receipt.length;

    setMenu(false);

    if (totalPrice != "0.00") {
      for (let i = 0; i < length; i++) {
        receiptRef.doc(receipt[i].id).update({
          no: i,
        });
      }

      receiptRef.add({
        no: length,
        totalPrice: totalPrice,
        date: format(new Date(), "d/M/yyyy"),
        time: format(new Date(), "h:mm a"),
        data: [...data],
      });

      navigation.navigate("Receipt");
    } else {
      alert("Please insert at least one item");
    }
  };

  const clearExpress = () => {
    const length = data.length;

    setMenu(false);

    length != 0 ? setClear(true) : null;

    for (let i = 0; i < length; i++) {
      expressRef
        .collection("data")
        .doc(data[i].id)
        .delete()
        .then(() => setClear(false))
        .catch((error) => {
          alert(error);
          setClear(false);
        });
    }
  };

  const deleteExpress = (index) => {
    expressRef.update({
      date: format(new Date(), "d/M/yyyy"),
      time: format(new Date(), "h:mm a"),
    });

    expressRef.collection("data").doc(data[index].id).delete();
  };

  const renderList = (item, index) => {
    return (
      <ExpressList
        navigation={navigation}
        data={data}
        item={item}
        index={index}
        deleteExpress={() => deleteExpress(index)}
      />
    );
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  if (loading || clear) {
    return <Loading />;
  }

  let totalPrice = 0;

  data.forEach((item) => {
    totalPrice += item.qty * item.price;
  });

  totalPrice = parseFloat(totalPrice).toFixed(2);

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <View style={{ width: "100%" }}>
          <View style={styles.headerWrap}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image source={icons.drawer} style={styles.headerIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTxt}>Express</Text>
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
                title="Clear express"
                onPress={() => clearExpress()}
                titleStyle={styles.menuTxt}
              />
              <Menu.Item
                title="Save express"
                onPress={() => addReceipt(totalPrice)}
                titleStyle={styles.menuTxt}
              />
            </Menu>
          </View>
          {data.length > 0 ? (
            <View>
              <View style={{ marginVertical: hp(30) }}>
                <Text style={styles.totalpricetitleTxt}>Total Price</Text>
                <Text style={styles.totalpriceTxt}>
                  RM <Text style={{ fontSize: hp(34) }}>{totalPrice}</Text>
                </Text>
                <Text
                  style={[
                    styles.totalpricetitleTxt,
                    { fontFamily: "SemiBold" },
                  ]}
                >
                  Last modified: {date} {time}
                </Text>
              </View>
              <Text style={[styles.headerTxt, { marginBottom: hp(10) }]}>
                List items ({data.length})
              </Text>
              <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => renderList(item, index)}
                style={{ height: hp(335) }}
                keyboardShouldPersistTaps="always"
              />
            </View>
          ) : null}
        </View>
        {data.length == 0 ? (
          <View>
            <View style={styles.image}>
              <ExpressImage />
            </View>
            <Text style={styles.titleTxt}>No Data</Text>
            <Text style={styles.subtitleTxt}>Add express to get started.</Text>
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.addexpressBtn}
          onPress={() => navigation.navigate("AddExpress", { data })}
        >
          <Text style={styles.addexpressTxt}>Add Express</Text>
        </TouchableOpacity>
      </SafeAreaView>
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
  menuTxt: {
    fontFamily: "SemiBold",
    fontSize: hp(12),
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
  addexpressBtn: {
    width: "100%",
    height: hp(43),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
  },
  addexpressTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.white,
  },
});
