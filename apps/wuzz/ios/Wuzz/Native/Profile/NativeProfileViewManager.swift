import React

@objc(NativeProfileViewManager)
class NativeProfileViewManager: RCTViewManager {

  override static func requiresMainQueueSetup() -> Bool {
    true
  }

  override func view() -> UIView! {
    return NativeProfileView()
  }
}
