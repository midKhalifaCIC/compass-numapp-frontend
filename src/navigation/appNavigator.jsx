// (C) Copyright IBM Deutschland GmbH 2021.  All rights reserved.

/***********************************************************************************************
imports
***********************************************************************************************/

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import About from "../screens/about/aboutContainer";
import Login from "../screens/login/loginContainer";
import Survey from "../screens/checkIn/surveyContainer";
import CheckIn from "../screens/checkIn/checkInContainer";

/***********************************************************************************************
export and AppContainer-creation
***********************************************************************************************/

// creates the stack-navigator for the navigation while NOT LOGGED IN
const Stack = createStackNavigator();

const SignedOutView = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
    }}
  >
    <Stack.Screen name="Landing" component={Login} />
    <Stack.Screen name="Login" component={Login} />
  </Stack.Navigator>
);

// creates the stack-navigator for the navigation while LOGGED IN

const SignedInView = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
    }}
    initialRouteName="CheckIn"
  >
    <Stack.Screen name="CheckIn" component={CheckIn} />
    <Stack.Screen name="Survey" component={Survey} />
    <Stack.Screen name="About" component={About} />
    <Stack.Screen name="WebView" component={About} />
    <Stack.Screen name="LegalInformation" component={About} />
  </Stack.Navigator>
);

/**
 * creates the app container based on the two stack-navigators
 */
const AppNavigator = ({ isLoggedIn }) => (
  <NavigationContainer>
    {isLoggedIn ? SignedInView() : SignedOutView()}
  </NavigationContainer>
);

AppNavigator.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.User.subjectId !== null,
});

export default connect(mapStateToProps)(AppNavigator);
