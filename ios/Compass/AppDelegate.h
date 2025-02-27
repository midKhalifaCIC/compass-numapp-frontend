/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>
#import <Expo/Expo.h>
#import <React/RCTBridgeDelegate.h>
#import <Firebase.h>

@interface AppDelegate : EXAppDelegateWrapper <RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
