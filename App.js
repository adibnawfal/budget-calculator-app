import React from "react";
import { StyleSheet, Text, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { enableScreens } from "react-native-screens";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { colors } from "./src/res/colors";
import { icons } from "./src/res/icons";
import { wp, hp } from "./src/config/Dimensions";
import { DrawerContent } from "./src/components";
import {
  AuthenticationScreen,
  WelcomeScreen,
  ExpressHomeScreen,
} from "./src/screens/onboarding";
import {
  SignInScreen,
  SignUpScreen,
  ForgotPasswordScreen,
} from "./src/screens/auth";
import {
  ExpressScreen,
  BudgetScreen,
  BalanceScreen,
  ListScreen,
  ReceiptScreen,
  ShowReceiptScreen,
  AccountScreen,
  ChangePasswordScreen,
  DeleteAccountScreen,
} from "./src/screens/main";
import {
  AddExpressHomeScreen,
  AddExpressScreen,
  AddBudgetScreen,
  AddBalanceScreen,
  AddListScreen,
} from "./src/screens/add";
import {
  EditExpressHomeScreen,
  EditExpressScreen,
  EditBudgetScreen,
  EditBalanceScreen,
  EditListScreen,
} from "./src/screens/edit";

import fixtimerbug from "./src/config/fixtimerbug";

enableScreens();

const stackOption = () => ({
  headerShown: false,
});

const drawerOption = (title, icon) => ({
  drawerIcon: () => <Image source={icon} style={styles.icon} />,
  title: () => <Text style={styles.text}>{title}</Text>,
});

const StackExpress = createStackNavigator();

function ExpressNavigator() {
  return (
    <StackExpress.Navigator initialRouteName="Express">
      <StackExpress.Screen
        name="Express"
        component={ExpressScreen}
        options={stackOption}
      />
      <StackExpress.Screen
        name="AddExpress"
        component={AddExpressScreen}
        options={stackOption}
      />
      <StackExpress.Screen
        name="EditExpress"
        component={EditExpressScreen}
        options={stackOption}
      />
    </StackExpress.Navigator>
  );
}

const StackBudget = createStackNavigator();

function BudgetNavigator() {
  return (
    <StackBudget.Navigator initialRouteName="Budget">
      <StackBudget.Screen
        name="Budget"
        component={BudgetScreen}
        options={stackOption}
      />
      <StackBudget.Screen
        name="AddBudget"
        component={AddBudgetScreen}
        options={stackOption}
      />
      <StackBudget.Screen
        name="EditBudget"
        component={EditBudgetScreen}
        options={stackOption}
      />
      <StackBudget.Screen
        name="Balance"
        component={BalanceNavigator}
        options={stackOption}
      />
    </StackBudget.Navigator>
  );
}

const StackBalance = createStackNavigator();

function BalanceNavigator() {
  return (
    <StackBalance.Navigator initialRouteName="Balance">
      <StackBalance.Screen
        name="Balance"
        component={BalanceScreen}
        options={stackOption}
      />
      <StackBalance.Screen
        name="AddBalance"
        component={AddBalanceScreen}
        options={stackOption}
      />
      <StackBalance.Screen
        name="EditBalance"
        component={EditBalanceScreen}
        options={stackOption}
      />
    </StackBalance.Navigator>
  );
}

const StackList = createStackNavigator();

function ListNavigator() {
  return (
    <StackList.Navigator initialRouteName="List">
      <StackList.Screen
        name="List"
        component={ListScreen}
        options={stackOption}
      />
      <StackList.Screen
        name="AddList"
        component={AddListScreen}
        options={stackOption}
      />
      <StackList.Screen
        name="EditList"
        component={EditListScreen}
        options={stackOption}
      />
    </StackList.Navigator>
  );
}

const StackReceipt = createStackNavigator();

function ReceiptNavigator() {
  return (
    <StackReceipt.Navigator initialRouteName="Receipt">
      <StackReceipt.Screen
        name="Receipt"
        component={ReceiptScreen}
        options={stackOption}
      />
      <StackReceipt.Screen
        name="ShowReceipt"
        component={ShowReceiptScreen}
        options={stackOption}
      />
    </StackReceipt.Navigator>
  );
}

const StackAccount = createStackNavigator();

function AccountNavigator() {
  return (
    <StackAccount.Navigator initialRouteName="Account">
      <StackAccount.Screen
        name="Account"
        component={AccountScreen}
        options={stackOption}
      />
      <StackAccount.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={stackOption}
      />
      <StackAccount.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={stackOption}
      />
    </StackAccount.Navigator>
  );
}

const DrawerRoutes = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <DrawerRoutes.Navigator
      initialRouteName="Express"
      drawerStyle={styles.drawer}
      drawerContentOptions={{ activeBackgroundColor: colors.lightGrey }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <DrawerRoutes.Screen
        name="Express"
        component={ExpressNavigator}
        options={() => drawerOption("Express", icons.express)}
      />
      <DrawerRoutes.Screen
        name="Budget"
        component={BudgetNavigator}
        options={() => drawerOption("Budget", icons.budget)}
      />
      <DrawerRoutes.Screen
        name="List"
        component={ListNavigator}
        options={() => drawerOption("List", icons.list)}
      />
      <DrawerRoutes.Screen
        name="Receipt"
        component={ReceiptNavigator}
        options={() => drawerOption("Receipt", icons.receipt)}
      />
      <DrawerRoutes.Screen
        name="Account"
        component={AccountNavigator}
        options={() => drawerOption("Account", icons.account)}
      />
    </DrawerRoutes.Navigator>
  );
}

const StackExpressHome = createStackNavigator();

function ExpressHomeNavigator() {
  return (
    <StackExpressHome.Navigator initialRouteName="ExpressHome">
      <StackExpressHome.Screen
        name="ExpressHome"
        component={ExpressHomeScreen}
        options={stackOption}
      />
      <StackExpressHome.Screen
        name="AddExpressHome"
        component={AddExpressHomeScreen}
        options={stackOption}
      />
      <StackExpressHome.Screen
        name="EditExpressHome"
        component={EditExpressHomeScreen}
        options={stackOption}
      />
    </StackExpressHome.Navigator>
  );
}

const StackApp = createStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    Regular: require("./src/assets/fonts/OpenSans-Regular.ttf"),
    SemiBold: require("./src/assets/fonts/OpenSans-SemiBold.ttf"),
    Bold: require("./src/assets/fonts/OpenSans-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StackApp.Navigator initialRouteName="Authentication">
          <StackApp.Screen
            name="Authentication"
            component={AuthenticationScreen}
            options={stackOption}
          />
          <StackApp.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={stackOption}
          />
          <StackApp.Screen
            name="SignIn"
            component={SignInScreen}
            options={stackOption}
          />
          <StackApp.Screen
            name="SignUp"
            component={SignUpScreen}
            options={stackOption}
          />
          <StackApp.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={stackOption}
          />
          <StackApp.Screen
            name="ExpressHome"
            component={ExpressHomeNavigator}
            options={stackOption}
          />
          <StackApp.Screen
            name="HomeApp"
            component={DrawerNavigator}
            options={stackOption}
          />
        </StackApp.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  drawer: {
    width: "80%",
  },
  icon: {
    resizeMode: "contain",
    width: wp(25),
    height: hp(25),
    marginLeft: wp(20),
    tintColor: colors.black,
  },
  text: {
    fontFamily: "SemiBold",
    fontSize: hp(12),
    color: colors.black,
  },
});
