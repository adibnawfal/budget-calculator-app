import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { wp, hp } from "../config/Dimensions";
import { colors } from "../res/colors";

export default function BalanceList({
  navigation,
  data,
  item,
  index,
  deleteBalance,
}) {
  let [fontsLoaded] = useFonts({
    Regular: require("../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../assets/fonts/OpenSans-Bold.ttf"),
  });

  const refsSwipe = [];

  const leftActions = (dragX, item, index) => {
    const scale = dragX.interpolate({
      inputRange: [-0, 100],
      outputRange: [0.9, 1],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("EditBalance", { data, item, index });
          refsSwipe[index].close();
        }}
        style={styles.animatedBtn}
      >
        <Animated.View
          style={{ paddingHorizontal: wp(22), transform: [{ scale }] }}
        >
          <MaterialIcons name="edit" size={24} color={colors.white} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const rightActions = (dragX, index) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.9],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={() => {
          deleteBalance(index);
          refsSwipe[index].close();
        }}
        style={[styles.animatedBtn, { backgroundColor: "red" }]}
      >
        <Animated.View
          style={{ paddingHorizontal: wp(22), transform: [{ scale }] }}
        >
          <MaterialIcons name="delete" size={24} color={colors.white} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const price = parseFloat(item.price).toFixed(2);

  return (
    <Swipeable
      renderLeftActions={(_, dragX) => leftActions(dragX, item, index)}
      renderRightActions={(_, dragX) => rightActions(dragX, index)}
      ref={(ref) => {
        refsSwipe[index] = ref;
      }}
    >
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
    </Swipeable>
  );
}

const styles = StyleSheet.create({
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
  animatedBtn: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    borderRadius: wp(10),
    marginBottom: hp(10),
  },
});
