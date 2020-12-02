import React, { useState, useEffect } from "react";
import firebase from "../../config/Fire";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  StatusBar,
} from "react-native";
import { Provider, Menu } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { wp, hp } from "../../config/Dimensions";
import { colors } from "../../res/colors";
import { icons } from "../../res/icons";
import { Loading } from "../../components";
import ReceiptImage from "../../assets/images/receipt.svg";

export default function ReceiptScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const receiptRef = firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("receipt");

  const [data, setData] = useState([]);
  const [dataHolder, setDataHolder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState("Search by total price");
  const [clear, setClear] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const unsubscribe = receiptRef
      .orderBy("no", "desc")
      .onSnapshot((snapshot) => {
        const data = [];

        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });

        setData(data);
        setDataHolder(data);
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  const clearReceipt = () => {
    const length = data.length;

    setMenu(false);

    length != 0 ? setClear(true) : null;

    for (let i = 0; i < length; i++) {
      receiptRef
        .doc(data[i].id)
        .delete()
        .then(() => setClear(false))
        .catch((error) => {
          alert(error);
          setClear(false);
        });
    }
  };

  const listFilter = (filterBy) => {
    setShowFilter(false);

    if (filterBy == "total price") {
      setFilter("Search by total price");
    } else if (filterBy == "date") {
      setFilter("Search by date");
    } else {
      setFilter("Search by time");
    }
  };

  const searchFilter = (text) => {
    const filterData = dataHolder.filter((item) => {
      let itemData = "";

      if (filter == "Search by total price") {
        itemData = `${item.totalPrice.toUpperCase()}`;
      } else if (filter == "Search by date") {
        itemData = `${item.date.toUpperCase()}`;
      } else {
        itemData = `${item.time.toUpperCase()}`;
      }

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    setData(filterData);
  };

  const renderList = (item, index) => {
    return (
      <View
        style={{
          borderBottomWidth: hp(1),
          borderBottomColor: colors.darkGrey,
        }}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            height: hp(95),
            justifyContent: "center",
            paddingHorizontal: wp(27),
          }}
          onPress={() =>
            navigation.navigate("ShowReceipt", {
              data,
              item,
              index,
            })
          }
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1, marginRight: wp(20) }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: "Bold",
                  fontSize: hp(16),
                  color: colors.primary,
                }}
              >
                RM{item.totalPrice}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: "Bold",
                  fontSize: hp(12),
                  color: colors.black,
                }}
              >
                {item.data.length} Items
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontFamily: "SemiBold",
                  fontSize: hp(12),
                  color: colors.darkGrey,
                }}
              >
                {item.date}
              </Text>
              <Text
                style={{
                  fontFamily: "SemiBold",
                  fontSize: hp(12),
                  color: colors.darkGrey,
                }}
              >
                {item.time}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  if (loading || clear) {
    return <Loading />;
  }

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <View style={{ width: "100%", paddingHorizontal: wp(27) }}>
          <View style={styles.headerWrap}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image source={icons.drawer} style={styles.headerIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTxt}>Receipt</Text>
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
                title="Clear receipt"
                onPress={() => clearReceipt()}
                titleStyle={styles.menuTxt}
              />
            </Menu>
          </View>
          <View style={styles.searchWrap}>
            <AntDesign
              name="search1"
              size={wp(18)}
              color={colors.darkGrey}
              style={{ paddingHorizontal: wp(20) }}
            />
            <TextInput
              placeholder={filter}
              placeholderTextColor={colors.darkGrey}
              style={styles.inputTxt}
              onChangeText={(text) => searchFilter(text)}
            />
            <Menu
              visible={showFilter}
              onDismiss={() => setShowFilter(false)}
              contentStyle={{
                backgroundColor: colors.white,
              }}
              anchor={
                <TouchableOpacity onPress={() => setShowFilter(true)}>
                  <MaterialIcons
                    name="filter-list"
                    size={20}
                    color={colors.darkGrey}
                    style={{ paddingHorizontal: wp(20) }}
                  />
                </TouchableOpacity>
              }
            >
              <Menu.Item
                title="Total Price"
                onPress={() => listFilter("total price")}
                titleStyle={styles.menuTxt}
              />
              <Menu.Item
                title="Date"
                onPress={() => listFilter("date")}
                titleStyle={styles.menuTxt}
              />
              <Menu.Item
                title="Time"
                onPress={() => listFilter("time")}
                titleStyle={styles.menuTxt}
              />
            </Menu>
          </View>
        </View>
        {data.length > 0 ? (
          <View style={styles.listWrap}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => renderList(item, index)}
              style={{ height: hp(480) }}
              keyboardShouldPersistTaps="always"
            />
          </View>
        ) : (
          <View>
            <View style={styles.image}>
              <ReceiptImage />
            </View>
            <Text style={styles.titleTxt}>No Data</Text>
            <Text style={styles.subtitleTxt}>Save express to get started.</Text>
          </View>
        )}
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: hp(25),
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
  searchWrap: {
    flexDirection: "row",
    width: "100%",
    height: wp(40),
    alignItems: "center",
    borderRadius: wp(10),
    backgroundColor: colors.lightGrey,
    marginTop: hp(30),
  },
  inputTxt: {
    flex: 1,
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: colors.black,
  },
  listWrap: {
    width: "100%",
    borderTopColor: colors.darkGrey,
    borderTopWidth: hp(1),
    marginTop: hp(30),
  },
  image: {
    width: wp(200),
    height: hp(153.19),
    marginTop: hp(75),
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
});
