import React, { useState } from "react";
import firebase from "../../config/Fire";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SectionList,
  StatusBar,
} from "react-native";
import { Provider, Menu } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import { format } from "date-fns";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { wp, hp } from "../../config/Dimensions";
import { colors } from "../../res/colors";
import { icons } from "../../res/icons";
import { useCollection } from "../../data/useCollection";
import { Loading, PriceFormat, BudgetList } from "../../components";
import BudgetImage from "../../assets/images/budget.svg";

export default function BudgetScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const budgetRef = firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("budget");

  const { loading, data } = useCollection(budgetRef);
  const [clear, setClear] = useState(false);
  const [menu, setMenu] = useState(false);

  const clearBudget = () => {
    const length = data.length;

    setMenu(false);

    length != 0 ? setClear(true) : null;

    for (let i = 0; i < length; i++) {
      budgetRef
        .doc(data[i].id)
        .update({ data: [] })
        .then(() => setClear(false))
        .catch((error) => {
          alert(error);
          setClear(false);
        });
    }
  };

  const deleteBudget = (section, index) => {
    budgetRef.doc("incomeDoc").update({
      date: format(new Date(), "d/M/yyyy"),
      time: format(new Date(), "h:mm a"),
    });

    data[section.no].data.splice(index, 1);

    budgetRef.doc(section.id).update({
      data: data[section.no].data,
    });
  };

  const headerList = (section) => {
    return (
      <Text
        style={[
          styles.headerTxt,
          {
            marginTop: section.title == "Expense" ? hp(20) : hp(0),
            marginBottom: hp(10),
          },
        ]}
      >
        {section.title} ({section.data.length})
      </Text>
    );
  };

  const renderList = (section, item, index) => {
    return (
      <BudgetList
        navigation={navigation}
        data={data}
        section={section}
        item={item}
        index={index}
        deleteBudget={() => deleteBudget(section, index)}
      />
    );
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  if (loading || clear) {
    return <Loading />;
  }

  let totalIncome = 0;
  let totalExpense = 0;
  let currentBalance = 0;

  data[0].data.forEach((item) => {
    totalIncome += item.value;
  });

  data[1].data.forEach((item) => {
    totalExpense += item.value;
  });

  currentBalance = totalIncome - totalExpense;

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
            <Text style={styles.headerTxt}>Budget</Text>
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
                title="Clear budget"
                onPress={() => clearBudget()}
                titleStyle={styles.menuTxt}
              />
            </Menu>
          </View>
          {data[0].data.length > 0 || data[1].data.length > 0 ? (
            <View>
              <View style={{ marginVertical: hp(30) }}>
                <Text style={styles.totalpricetitleTxt}>Current Balance</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={[styles.totalpriceTxt, { flex: 1 }]}>
                    RM{" "}
                    <PriceFormat
                      value={currentBalance}
                      style={{ fontSize: hp(34) }}
                    />
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Balance", {
                        screen: "Balance",
                        params: { currentBalance },
                      })
                    }
                  >
                    <Entypo
                      name="chevron-right"
                      size={30}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                {currentBalance < 0 ? (
                  <Text style={[styles.totalpricetitleTxt, { color: "red" }]}>
                    Your expenses exceed your income
                  </Text>
                ) : null}
                <Text
                  style={[
                    styles.totalpricetitleTxt,
                    { fontFamily: "SemiBold" },
                  ]}
                >
                  Last modified: {data[0].date} {data[0].time}
                </Text>
              </View>
              <SectionList
                sections={data}
                style={{ height: hp(375) }}
                keyExtractor={(item, index) => item + index}
                renderItem={({ section, item, index }) =>
                  renderList(section, item, index)
                }
                renderSectionHeader={({ section }) => headerList(section)}
                keyboardShouldPersistTaps="always"
              />
            </View>
          ) : null}
        </View>
        {data[0].data.length == 0 && data[1].data.length == 0 ? (
          <View>
            <View style={styles.image}>
              <BudgetImage />
            </View>
            <Text style={styles.titleTxt}>No Data</Text>
            <Text style={styles.subtitleTxt}>Add budget to get started.</Text>
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.addbudgetBtn}
          onPress={() => navigation.navigate("AddBudget", { data })}
        >
          <Text style={styles.addbudgetTxt}>Add Budget</Text>
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
    height: hp(167.8),
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
  addbudgetBtn: {
    width: "100%",
    height: hp(43),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
  },
  addbudgetTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.white,
  },
});
