import React, { useState } from "react";
import firebase from "../../config/Fire";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  StatusBar,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Provider, Menu } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { wp, hp } from "../../config/Dimensions";
import { colors } from "../../res/colors";
import { icons } from "../../res/icons";
import { useCollection } from "../../data/useCollection";
import { Loading } from "../../components";
import ListImage from "../../assets/images/list.svg";

export default function ListScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Regular: require("../../assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("../../assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("../../assets/fonts/OpenSans-Bold.ttf"),
  });

  const listRef = firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("list");

  const { loading, data } = useCollection(listRef);
  const [clear, setClear] = useState(false);
  const [menu, setMenu] = useState(false);

  const refsSwipe = [];

  const toggleListCompleted = (index) => {
    listRef.doc(data[index].id).update({
      completed: !data[index].completed,
    });
  };

  const clearList = () => {
    const length = data.length;

    setMenu(false);

    length != 0 ? setClear(true) : null;

    for (let i = 0; i < length; i++) {
      listRef
        .doc(data[i].id)
        .delete()
        .then(() => setClear(false))
        .catch((error) => {
          alert(error);
          setClear(false);
        });
    }
  };

  const deleteList = (index) => {
    listRef.doc(data[index].id).delete();
  };

  const leftActions = (dragX, item, index) => {
    const scale = dragX.interpolate({
      inputRange: [-0, 100],
      outputRange: [0.9, 1],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("EditList", {
            data,
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

  const rightActions = (dragX, index) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.9],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={() => {
          deleteList(index);
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

  const renderItem = (item, index) => {
    return (
      <Swipeable
        renderLeftActions={(_, dragX) => leftActions(dragX, item, index)}
        renderRightActions={(_, dragX) => rightActions(dragX, index)}
        ref={(ref) => {
          refsSwipe[index] = ref;
        }}
      >
        <TouchableOpacity
          style={styles.listWrap}
          onPress={() => toggleListCompleted(index)}
        >
          <MaterialCommunityIcons
            name={item.completed ? "check-circle" : "circle-outline"}
            size={24}
            color={item.completed ? colors.primary : colors.black}
          />
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              marginLeft: wp(22),
              fontFamily: "SemiBold",
              fontSize: hp(12),
              textDecorationLine: item.completed ? "line-through" : "none",
              color: item.completed ? colors.darkGrey : colors.black,
            }}
          >
            {item.itemName}
          </Text>
        </TouchableOpacity>
      </Swipeable>
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
        <View style={{ width: "100%" }}>
          <View style={styles.headerWrap}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image source={icons.drawer} style={styles.headerIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTxt}>List</Text>
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
                title="Clear list"
                onPress={() => clearList()}
                titleStyle={styles.menuTxt}
              />
            </Menu>
          </View>
          {data.length > 0 ? (
            <View>
              <Text
                style={[
                  styles.headerTxt,
                  { marginTop: hp(30), marginBottom: hp(10) },
                ]}
              >
                To Buy ({data.length})
              </Text>
              <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => renderItem(item, index)}
                style={{ height: hp(450) }}
                keyboardShouldPersistTaps="always"
              />
            </View>
          ) : null}
        </View>
        {data.length == 0 ? (
          <View>
            <View style={styles.image}>
              <ListImage />
            </View>
            <Text style={styles.titleTxt}>No Data</Text>
            <Text style={styles.subtitleTxt}>Add list to get started.</Text>
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.addlistBtn}
          onPress={() => navigation.navigate("AddList", { data })}
        >
          <Text style={styles.addlistTxt}>Add List</Text>
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
  image: {
    width: wp(200),
    height: hp(152.81),
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
  addlistBtn: {
    width: "100%",
    height: hp(43),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(10),
  },
  addlistTxt: {
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
