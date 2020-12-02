import React, { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
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

export default function EditExpressScreen({ navigation, route }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const [itemName, setName] = useState(route.params.item.itemName);
  const [qty, setQty] = useState(route.params.item.qty);
  const [price, setPrice] = useState(route.params.item.price);

  const updateExpress = async () => {
    const { express, index } = route.params;

    if (itemName != "") {
      if (price != 0) {
        if (!isNaN(price)) {
          try {
            express.date = format(new Date(), "d/M/yyyy");
            express.time = format(new Date(), "h:mm a");
            express.data[index] = {
              no: express.data[index].no,
              itemName: itemName,
              qty: qty,
              price: price,
            };

            await AsyncStorage.setItem("@expressData", JSON.stringify(express));
          } catch (error) {
            alert(error);
          } finally {
            Keyboard.dismiss();
            navigation.pop();
          }
        } else {
          alert("Invalid price input");
        }
      } else {
        alert("Please enter price value");
      }
    } else {
      alert("Please enter item name");
    }
  };

  const checkQty = () => {
    if (qty == 1) {
      alert("Quantity cannot less than 1");
    } else {
      setQty(qty - 1);
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  let totalPrice = 0;

  totalPrice = qty * price;
  totalPrice = parseFloat(totalPrice).toFixed(2);

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
          <Text style={styles.titleTxt}>Edit express item</Text>
          <View style={styles.inputWrap}>
            <Text style={styles.inputtitleTxt}>Item Name</Text>
            <TextInput
              numberOfLines={1}
              placeholder="e.g. Chocolate"
              placeholderTextColor={colors.darkGrey}
              style={styles.inputTxt}
              onChangeText={(itemName) => setName(itemName)}
              value={itemName}
            />
          </View>
          <View style={{ marginVertical: hp(20) }}>
            <Text style={styles.inputtitleTxt}>Quantity</Text>
            <View style={styles.qtyWrap}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => checkQty()}
              >
                <Text style={styles.counterbtnTxt}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyTxt}>{qty}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => setQty(qty + 1)}
              >
                <Text style={styles.counterbtnTxt}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputWrap}>
            <Text style={styles.inputtitleTxt}>Price</Text>
            <TextInput
              numberOfLines={1}
              placeholder="e.g. 7.20"
              placeholderTextColor={colors.darkGrey}
              keyboardType="numeric"
              style={styles.inputTxt}
              onChangeText={(price) => setPrice(price)}
              value={price ? String(price) : null}
            />
          </View>
          <View style={{ marginVertical: hp(20) }}>
            <Text style={styles.inputtitleTxt}>Total Price Item</Text>
            <Text style={styles.totalpriceTxt}>RM{totalPrice}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.updateitemBtn}
          onPress={() => updateExpress()}
        >
          <Text style={styles.updateitemTxt}>Update Item</Text>
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
  qtyWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(12),
  },
  qtyTxt: {
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: colors.black,
    marginHorizontal: wp(20),
  },
  counterBtn: {
    width: wp(31),
    height: wp(31),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(5),
    backgroundColor: colors.primary,
  },
  counterbtnTxt: {
    fontFamily: "Bold",
    fontSize: hp(16),
    color: colors.white,
  },
  totalpriceTxt: {
    fontFamily: "Bold",
    fontSize: hp(22),
    color: colors.primary,
    marginTop: hp(12),
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
