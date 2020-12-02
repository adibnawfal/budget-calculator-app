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
import { Loading, PriceFormat, BalanceList } from "../../components";
import BalanceImage from "../../assets/images/balance.svg";

export default function BalanceScreen({ navigation, route }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const balanceRef = firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("balance")
    .doc("balanceDoc");

  const { currentBalance } = route.params;
  const { date, time } = useDateTime(balanceRef);
  const { loading, data } = useData(balanceRef);
  const [clear, setClear] = useState(false);
  const [menu, setMenu] = useState(false);

  const clearBalance = () => {
    const length = data.length;

    setMenu(false);

    length != 0 ? setClear(true) : null;

    for (let i = 0; i < length; i++) {
      balanceRef
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

  const deleteBalance = (index) => {
    balanceRef.set({
      date: format(new Date(), "d/M/yyyy"),
      time: format(new Date(), "h:mm a"),
    });

    balanceRef.collection("data").doc(data[index].id).delete();
  };

  const renderList = (item, index) => {
    return (
      <BalanceList
        navigation={navigation}
        data={data}
        item={item}
        index={index}
        deleteBalance={() => deleteBalance(index)}
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
  let newBalance = 0;

  data.forEach((item) => {
    totalPrice += item.qty * item.price;
  });

  newBalance = currentBalance - totalPrice;
  newBalance = parseFloat(newBalance).toFixed(2);

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
            <TouchableOpacity onPress={() => navigation.pop()}>
              <Image source={icons.back} style={styles.headerIcon} />
            </TouchableOpacity>
            <PriceFormat value={currentBalance} style={styles.headerTxt} />
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
                title="Clear item"
                onPress={() => clearBalance()}
                titleStyle={styles.menuTxt}
              />
            </Menu>
          </View>
          {data.length > 0 ? (
            <View>
              <View style={{ marginVertical: hp(30) }}>
                <Text style={styles.totalpricetitleTxt}>New Balance</Text>
                <Text style={styles.totalpriceTxt}>
                  RM{" "}
                  <PriceFormat
                    value={newBalance}
                    style={{ fontSize: hp(34) }}
                  />
                </Text>
                {newBalance < 0 ? (
                  <Text style={[styles.totalpricetitleTxt, { color: "red" }]}>
                    You have exceeded your current balance
                  </Text>
                ) : null}
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
              <BalanceImage />
            </View>
            <Text style={styles.titleTxt}>No Data</Text>
            <Text style={styles.subtitleTxt}>Add item to get started.</Text>
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.addbalanceBtn}
          onPress={() => navigation.navigate("AddBalance", { data })}
        >
          <Text style={styles.addbalanceTxt}>Add Item</Text>
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
  listView: {
    flexDirection: "row",
    width: "100%",
    height: hp(58),
    alignItems: "center",
    paddingHorizontal: wp(22),
    borderRadius: wp(10),
    backgroundColor: colors.lightGrey,
    marginBottom: hp(10),
  },
  image: {
    width: wp(200),
    height: hp(157.53),
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
  addbalanceBtn: {
    width: "100%",
    height: hp(43),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
  },
  addbalanceTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.white,
  },
  animatedBtn: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    borderRadius: wp(10),
    marginBottom: hp(10),
  },
});
