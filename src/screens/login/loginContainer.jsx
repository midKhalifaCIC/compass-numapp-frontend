// (C) Copyright IBM Deutschland GmbH 2021.  All rights reserved.

/***********************************************************************************************
imports
***********************************************************************************************/

import { connect } from "react-redux";
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import config from "../../config/configProvider";
import localStorage from "../../services/localStorage/localStorage";

import LoginScreen from "./loginScreen";
import LandingScreen from "./landingScreen";
import * as loginActions from "./loginActions";
import { userActions } from "../../redux";
import { UserProps, GlobalsProps } from "../../prop-types";

/***********************************************************************************************
component:
container for the login screen
***********************************************************************************************/

class LoginContainer extends Component {
  /**
   * @constructor
   * @param  {object}    props
   * @param  {string}    props.subjectId holds the subjectId that is used to log in
   * @param  {object}    props.actions holds actions for the component (./loginActions.js)
   * @param  {boolean}   props.loggedIn if true: user is logged in
   * @param  {object}    props.navigation the navigation object provided by 'react-navigation'
   * @param  {boolean}   props.loginUnauthorized if true: the last authentication attempt returned a 401
   * @param  {object}    props.loginError the persisted error of the last authentication attempt
   */

  // events
  /*-----------------------------------------------------------------------------------*/

  /**
   * if the user is navigated to this screen the logout will be triggered automatically
   * after the component mounted (to clean the state). also triggers the auto-login if
   * configured in appConfig.js
   */
  componentDidMount = () => {
    const { user, actions, route } = this.props;
    // logout of an existing user
    if (user && user.subjectId) actions.logout();

    // triggers the auto-login when on the login-screen (only on DEV)
    if (config.appConfig.automateQrLogin && route.name === "Login") {
      // parses the input string to determine the subjectId (from the qr-code)
      const scannedId = this.checkQrCodeForUsername(
        config.appConfig.automateQrLoginSubjectId
      );
      // sets the subjectId defined in appConfig.js
      actions.updateUser({ subjectId: scannedId });
      // triggers the login
      // setTimeout(async () => actions.updateUser(scannedId), 1000);
    } else {
      this.autoLoginLastUser();
    }
  };

  /**
   * checks after each update if the user is logged in and (if yes) navigates to the checkIn-screen
   */
  componentDidUpdate = () => {
    const { user, navigation } = this.props;
    if (user && user.subjectId) navigation.navigate("CheckIn");
  };

  // class methods
  /*-----------------------------------------------------------------------------------*/

  /**
   * tries to log in the last persisted user, is triggered by componentDidMount()
   */
  autoLoginLastUser = async () => {
    const { actions } = this.props;
    // gets the last user from the AsyncStore
    const lastSubjectId = await localStorage.loadLastSubjectId();

    // logs the user in
    if (lastSubjectId) {
      actions.autoLoginLastUser();
      actions.updateUser({ subjectId: lastSubjectId });
    }
  };

  /**
   * tries to parse the input-string and returns the subjectId (from the qr-code)
   * @param  {string} str string to be checked
   * @returns {string}
   */
  checkQrCodeForUsername = (str) => {
    let subjectId;
    try {
      const qrCode = JSON.parse(str);
      if (
        qrCode[config.appConfig.qrCodeAttributeHoldingTheAppIdentifier] ===
        config.appConfig.appIdentifier
      )
        subjectId = qrCode[config.appConfig.qrCodeAttributeHoldingTheSubjectId];
    } catch (e) {
      return "";
    }
    // returns the id or an e
    return subjectId || "";
  };

  /**
   * is triggered when the qr-scann is getting something.
   * basically checks if it is a qr-code, then tries to parse it and uses the result
   * for a login-attempt
   * @param  {{data: string}} scanResult scan result from the qr-code scanner
   * @param  {any} camera camera reference
   */
  scanSuccess = (scanResult, camera) => {
    const { actions } = this.props;
    // parses the input string to determine the subjectId (from the qr-code)
    const subjectId = this.checkQrCodeForUsername(scanResult.data);

    // sets the subjectId defined in appConfig.js
    actions.updateUser(subjectId);
    // triggers the login
    // setTimeout(() => actions.sendCredentials(subjectId, camera), 500);
  };

  // rendering
  /*-----------------------------------------------------------------------------------*/

  render() {
    const { actions, navigation, loginUnauthorized, route, globals } =
      this.props;
    // checks the currently selected route
    return route.name === "Login" ? (
      // if on Login route
      <LoginScreen
        actions={actions}
        loading={globals.loading}
        error={globals.error}
        loginUnauthorized={loginUnauthorized}
        navigation={navigation}
        scanSuccess={this.scanSuccess}
      />
    ) : (
      // if on Landing route
      <LandingScreen loading={globals.loading} navigation={navigation} />
    );
  }
}

LoginContainer.propTypes = {
  globals: GlobalsProps.isRequired,
  user: UserProps.isRequired,
  actions: PropTypes.shape({
    updateUser: PropTypes.func.isRequired,
    sendCredentials: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  }).isRequired,
};

/***********************************************************************************************
redux
***********************************************************************************************/

// connects the redux-state with the local props and enables dispatching actions from it.
// updated properties are then available from the state. actions can be accessed through
// props.actions.

const mapStateToProps = (state) => ({
  user: state.User,
  globals: state.Globals,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...loginActions, ...userActions }, dispatch),
});

/***********************************************************************************************
export
***********************************************************************************************/

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
