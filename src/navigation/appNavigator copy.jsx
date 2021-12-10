// (C) Copyright IBM Deutschland GmbH 2021.  All rights reserved.

/***********************************************************************************************
imports
***********************************************************************************************/

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import About from "../screens/about/aboutContainer";
import Login from "../screens/login/loginContainer";
import Survey from "../screens/checkIn/surveyContainer";
import CheckIn from "../screens/checkIn/checkInContainer";

/***********************************************************************************************
export and AppContainer-creation
***********************************************************************************************/

const Stack = createStackNavigator();

/**
 * creates the app container based on the two stack-navigators
 */
export default (store) => {
  console.log("navigator");
  const {
    User: { subjectId },
    // eslint-disable-next-line react/destructuring-assignment
  } = store.getState();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        {subjectId ? (
          /* stack of screens when logged in */
          <>
            <Stack.Screen name="CheckIn" component={CheckIn} />
            <Stack.Screen name="Survey" component={Survey} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="WebView" component={About} />
            <Stack.Screen name="LegalInformation" component={About} />
          </>
        ) : (
          /* stack of screens when not logged in */
          <>
            <Stack.Screen name="Landing" component={Login} />
            <Stack.Screen name="Login" component={Login} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
