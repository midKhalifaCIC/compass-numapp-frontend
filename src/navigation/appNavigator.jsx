// (C) Copyright IBM Deutschland GmbH 2021.  All rights reserved.

/***********************************************************************************************
imports
***********************************************************************************************/

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import About from '../screens/about/aboutContainer';
import Login from '../screens/login/loginContainer';
import modalscreen from '../screens/modalscreen';
import { CheckIn } from '../screens/checkIn/checkInContainer';
import ModalScreen from '../screens/modalscreen';

/***********************************************************************************************
export and AppContainer-creation
***********************************************************************************************/

// creates the stack-navigator for the navigation while NOT LOGGED IN

function SignedOutView() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
      initialRouteName="Landing"
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Landing" component={Login} />
    </Stack.Navigator>
  );
}

// creates the stack-navigator for the navigation while LOGGED IN

function SignedInView() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
    
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
      initialRouteName="CheckIn"
    >
      <Stack.Screen name='Modal' component={ModalScreen} />
      <Stack.Screen name="CheckIn" component={CheckIn} />
      <Stack.Screen name="Survey" component={CheckIn} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="WebView" component={About} />
      <Stack.Screen name="LegalInformation" component={About} />
    </Stack.Navigator>
  );
}

/**
 * creates the app container based on the two stack-navigators
 */
const createAppNavigator = () => {
  const RootStack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
        initialRouteName="SignedOut"
      >
        <RootStack.Screen name="SignedIn" component={SignedInView} />
        <RootStack.Screen name="SignedOut" component={SignedOutView} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default createAppNavigator;
