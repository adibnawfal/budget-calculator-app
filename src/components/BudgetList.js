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
import PriceFormat from "./PriceFormat";

export default function BudgetList({
  navigation,
  data,
  section,
  item,
  index,
  deleteBudget,
}) {
  let [fontsLoaded] = useFonts({
    Regular: require("../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../assets/fonts/OpenSans-Bold.ttf"),
  });

  const refsSwipe = [];

  const leftActions = (dragX, section, item, index) => {
    const scale = dragX.interpolate({
      inputRange: [-0, 100],
      outputRange: [0.9, 1],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("EditBudget", {
            data,
            section,
            item,
            index,
          });
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

  const rightActions = (dragX, section, index) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.9],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={() => {
          deleteBudget(section, index);
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

  return (
    <Swipeable
      renderLeftActions={(_, dragX) => leftActions(dragX, section, item, index)}
      renderRightActions={(_, dragX) => rightActions(dragX, section, index)}
      ref={(ref) => {
        refsSwipe[index] = ref;
      }}
    >
      <View style={styles.listWrap}>
        <Text numberOfLines={1} style={styles.listNameTxt}>
          {item.name}
        </Text>
        <PriceFormat value={item.value} style={styles.listValueTxt} />
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  listWrap: {
    flexDirection: "row",
    width: "100%",
    height: hp(40),
    alignItems: "center",
    paddingHorizontal: wp(22),
    borderRadius: wp(10),
    backgroundColor: colors.lightGrey,
    marginBottom: hp(10),
  },
  listNameTxt: {
    flex: 1,
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: colors.black,
    marginRight: wp(20),
  },
  listValueTxt: {
    fontFamily: "Bold",
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
