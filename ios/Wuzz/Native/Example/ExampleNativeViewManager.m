#import <React/RCTViewManager.h>

/// Objective-C module export for ExampleNativeView
/// This file is required for React Native to discover and use the component
@interface RCT_EXTERN_MODULE(ExampleNativeViewManager, RCTViewManager)

// Export props that can be set from React Native
RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(subtitle, NSString)
RCT_EXPORT_VIEW_PROPERTY(buttonText, NSString)
RCT_EXPORT_VIEW_PROPERTY(buttonColor, UIColor)

// Export events that can be handled in React Native
RCT_EXPORT_VIEW_PROPERTY(onButtonPress, RCTBubblingEventBlock)

@end

