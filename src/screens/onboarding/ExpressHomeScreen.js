import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
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
import { Loading, ExpressHomeList } from "../../components";
import ExpressImage from "../../assets/images/express.svg";

export default function ExpressScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const [express, setExpress] = useState();
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  const updateExpress = async () => {
    try {
      const newData = {
        date: null,
        time: null,
        data: [],
      };

      const express = await AsyncStorage.getItem("@expressData");
      setExpress(express != null ? JSON.parse(express) : newData);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpress = async (index) => {
    try {
      express.date = format(new Date(), "d/M/yyyy");
      express.time = format(new Date(), "h:mm a");
      express.data.splice(index, 1);

      await AsyncStorage.setItem("@expressData", JSON.stringify(express));
    } catch (error) {
      alert(error);
    } finally {
      updateExpress();
    }
  };

  const clearExpress = async () => {
    setMenu(false);
    setLoading(true);

    try {
      await AsyncStorage.removeItem("@expressData");
    } catch (error) {
      alert(error);
    } finally {
      updateExpress();
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      updateExpress();
    });

    return unsubscribe;
  }, []);

  const renderList = (item, index) => {
    return (
      <ExpressHomeList
        navigation={navigation}
        express={express}
        item={item}
        index={index}
        deleteExpress={() => deleteExpress(index)}
      />
    );
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  if (loading) {
    return <Loading />;
  }

  let totalPrice = 0;

  express.data.forEach((item) => {
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
            <TouchableOpacity onPress={() => navigation.pop()}>
              <Image source={icons.back} style={styles.headerIcon} />
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
            </Menu>
          </View>
          {express.data.length > 0 ? (
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
                  Last modified: {express.date} {express.time}
                </Text>
              </View>
              <Text style={[styles.headerTxt, { marginBottom: hp(10) }]}>
                List items ({express.data.length})
              </Text>
              <FlatList
                data={express.data}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item, index }) => renderList(item, index)}
                style={{ height: hp(335) }}
                keyboardShouldPersistTaps="always"
              />
            </View>
          ) : null}
        </View>
        {express.data.length == 0 ? (
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
          onPress={() =>
            navigation.navigate("AddExpressHome", { express: express })
          }
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
