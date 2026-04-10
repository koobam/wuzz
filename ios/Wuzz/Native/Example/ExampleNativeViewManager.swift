import React

/// View Manager that bridges ExampleNativeView to React Native
@objc(ExampleNativeViewManager)
class ExampleNativeViewManager: RCTViewManager {
  
  override static func requiresMainQueueSetup() -> Bool {
    true
  }
  
  override func view() -> UIView! {
    return ExampleNativeView()
  }
}

