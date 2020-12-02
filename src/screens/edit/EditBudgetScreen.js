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
import { format } from "date-fns";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { wp, hp } from "../../config/Dimensions";
import { colors } from "../../res/colors";
import { icons } from "../../res/icons";

export default function EditBudgetScreen({ navigation, route }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const [income, setIncome] = useState(
    route.params.section.title == "Income" ? true : false
  );
  const [expense, setExpense] = useState(
    route.params.section.title == "Expense" ? true : false
  );
  const [name, setName] = useState(route.params.item.name);
  const [value, setvalue] = useState(route.params.item.value);

  const updateBudget = () => {
    const { data, section, index } = route.params;
    const selection = income ? 0 : 1;
    const list = data[section.no].data[index];

    const budgetRef = firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("budget");

    if (name != "") {
      if (value != 0) {
        if (!isNaN(value)) {
          budgetRef.doc("incomeDoc").update({
            date: format(new Date(), "d/M/yyyy"),
            time: format(new Date(), "h:mm a"),
          });

          if (selection == 0) {
            if (section.title == "Expense") {
              data[section.no].data.splice(index, 1);

              budgetRef.doc(section.id).update({
                data: data[section.no].data,
              });

              data[selection].data.push({
                name: name,
                value: Number(value),
              });

              budgetRef.doc(data[selection].id).update(data[selection]);
            } else {
              list.name = name;
              list.value = Number(value);

              budgetRef.doc(section.id).update(data[section.no]);
            }
          } else {
            if (section.title == "Income") {
              data[section.no].data.splice(index, 1);

              budgetRef.doc(section.id).update({
                data: data[section.no].data,
              });

              data[selection].data.push({
                name: name,
                value: Number(value),
              });

              budgetRef.doc(data[selection].id).update(data[selection]);
            } else {
              list.name = name;
              list.value = Number(value);

              budgetRef.doc(section.id).update(data[section.no]);
            }
          }

          Keyboard.dismiss();
          navigation.pop();
        } else {
          alert("Invalid value input");
        }
      } else {
        income
          ? alert("Please enter income value")
          : alert("Please enter expense value");
      }
    } else {
      income
        ? alert("Please enter income name")
        : alert("Please enter expense name");
    }
  };

  const toggleSelection = (selection) => {
    if (selection == "Income") {
      setIncome(true);
      setExpense(false);
    } else {
      setIncome(false);
      setExpense(true);
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
          <Text style={styles.titleTxt}>
            Edit {income ? "income" : "expense"}
          </Text>
          <View style={styles.selectionWrap}>
            <TouchableOpacity
              style={[
                styles.selectionBtn,
                {
                  borderTopLeftRadius: wp(10),
                  borderBottomLeftRadius: wp(10),
                  backgroundColor: income ? colors.primary : colors.white,
                  borderWidth: income ? wp(0) : wp(1.5),
                },
              ]}
              onPress={() => toggleSelection("Income")}
            >
              <Text
                style={[
                  styles.updateitemTxt,
                  { color: income ? colors.white : colors.primary },
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectionBtn,
                {
                  borderTopRightRadius: wp(10),
                  borderBottomRightRadius: wp(10),
                  backgroundColor: expense ? colors.primary : colors.white,
                  borderWidth: expense ? wp(0) : wp(1.5),
                },
              ]}
              onPress={() => toggleSelection("Expense")}
            >
              <Text
                style={[
                  styles.updateitemTxt,
                  { color: expense ? colors.white : colors.primary },
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: hp(30) }}>
            <View style={[styles.inputWrap, { marginBottom: hp(20) }]}>
              <Text style={styles.inputtitleTxt}>
                {income ? "Income" : "Expense"} Name
              </Text>
              <TextInput
                numberOfLines={1}
                placeholder={income ? "e.g. Salary" : "e.g. Insurance"}
                placeholderTextColor={colors.darkGrey}
                style={styles.inputTxt}
                onChangeText={(name) => setName(name)}
                value={name}
              />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputtitleTxt}>Value</Text>
              <TextInput
                numberOfLines={1}
                placeholder={income ? "e.g. 2500" : "e.g. 150"}
                placeholderTextColor={colors.darkGrey}
                keyboardType="numeric"
                style={styles.inputTxt}
                onChangeText={(value) => setvalue(value)}
                value={value ? String(value) : null}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.updateitemBtn}
          onPress={() => updateBudget()}
        >
          <Text style={styles.updateitemTxt}>
            Update {income ? "Income" : "Expense"}
          </Text>
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
  selectionWrap: {
    flexDirection: "row",
    width: "100%",
    height: hp(30),
    marginBottom: hp(30),
  },
  selectionBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.primary,
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
  updateitemBtn: {
    width: "100%",
    height: hp(43),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
  },
  updateitemTxt: {
    fontFamily: "Bold",
    fontSize: hp(12),
    color: colors.white,
  },
});
