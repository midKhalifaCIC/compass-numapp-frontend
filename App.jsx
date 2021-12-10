// (C) Copyright IBM Deutschland GmbH 2021.  All rights reserved.

/***********************************************************************************************
imports
***********************************************************************************************/

import React, { PureComponent } from "react";
import { LogBox, Platform, StatusBar, StyleSheet, View } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import Spinner from "./src/components/spinner/spinner";
import config from "./src/config/configProvider";
import AppNavigator from "./src/navigation/appNavigator";
import { persistor, reduxStore } from "./src/redux/store";

/***********************************************************************************************
Component
***********************************************************************************************/

class App extends PureComponent {
  /**
   * creates the appNavigator and provides the initial view
   * @constructor
   * @param  {object} props
   */

  render() {
    // hides the splash screen
    SplashScreen.hide();

    // and returns the basic view that contains the navigator
    return (
      <View style={localStyle.container}>
        {Platform.OS === "ios" && (
          <StatusBar barStyle={config.theme.values.defaultStatusBarStyleIos} />
        )}

        {Platform.OS === "android" && (
          <StatusBar
            barStyle={config.theme.values.defaultStatusBarStyleAndroid}
            backgroundColor={
              config.theme.values.defaultStatusBarAndroidBackgroundColor
            }
          />
        )}
        <Provider store={reduxStore}>
          <PersistGate loading={<Spinner visible />} persistor={persistor}>
            <AppNavigator />
          </PersistGate>
        </Provider>
      </View>
    );
  }
}

/***********************************************************************************************
local styling
***********************************************************************************************/

const localStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

/***********************************************************************************************
global variables / settings
***********************************************************************************************/

// needed by node-forge for the encryption functionality
global.Buffer = require("buffer").Buffer;

// deactivates the logbox-warning about the debugger running in the background
LogBox.ignoreLogs(["Remote debugger"]);

/***********************************************************************************************
export
***********************************************************************************************/

export default App;
