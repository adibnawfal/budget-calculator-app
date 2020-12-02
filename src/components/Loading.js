import React from "react";
import { StyleSheet, View, Image, StatusBar } from "react-native";

import { wp, hp } from "../config/Dimensions";
import { colors } from "../res/colors";
import { images } from "../res/images";

export default function Loading() {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <Image source={images.loader} style={styles.loaderImg} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  loaderImg: {
    resizeMode: "contain",
    width: wp(100),
    height: hp(100),
  },
});
