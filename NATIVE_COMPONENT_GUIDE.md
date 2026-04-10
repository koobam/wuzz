# Creating Native Components in React Native (iOS)

This guide shows you how to create a native iOS component and bridge it to React Native, following the pattern used in this project.

## Overview

To create a native component, you need:
1. **Swift UIView** - The actual native component
2. **Swift View Manager** - Bridges the component to React Native
3. **Objective-C Module Export** - Exports the manager to React Native
4. **TypeScript Interface** (optional) - For type safety in React Native

## Step-by-Step Guide

### Step 1: Create the Swift UIView Component

Create a new Swift file for your native view (e.g., `MyNativeView.swift`):

```swift
import UIKit

final class MyNativeView: UIView {
  
  // MARK: - Properties
  private let label = UILabel()
  private let button = UIButton(type: .system)
  
  // MARK: - Init
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    setup()
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  // MARK: - Setup
  
  private func setup() {
    backgroundColor = .systemBackground
    
    // Configure label
    label.text = "Hello from Native!"
    label.textAlignment = .center
    label.font = .boldSystemFont(ofSize: 24)
    addSubview(label)
    
    // Configure button
    button.setTitle("Tap Me", for: .normal)
    button.addTarget(self, action: #selector(buttonTapped), for: .touchUpInside)
    addSubview(button)
  }
  
  // MARK: - Layout
  
  override func layoutSubviews() {
    super.layoutSubviews()
    
    let width = bounds.width
    let height = bounds.height
    
    label.frame = CGRect(
      x: 0,
      y: height / 2 - 60,
      width: width,
      height: 40
    )
    
    button.frame = CGRect(
      x: width / 2 - 50,
      y: height / 2 + 20,
      width: 100,
      height: 44
    )
  }
  
  // MARK: - Actions
  
  @objc private func buttonTapped() {
    print("Button tapped in native!")
    // You can send events to React Native here
  }
  
  // MARK: - Public Methods (for React Native props)
  
  func setTitle(_ title: String) {
    label.text = title
  }
  
  func setButtonText(_ text: String) {
    button.setTitle(text, for: .normal)
  }
}
```

### Step 2: Create the Swift View Manager

Create a View Manager file (e.g., `MyNativeViewManager.swift`):

```swift
import React

@objc(MyNativeViewManager)
class MyNativeViewManager: RCTViewManager {
  
  override static func requiresMainQueueSetup() -> Bool {
    true
  }
  
  override func view() -> UIView! {
    return MyNativeView()
  }
  
  // Export props to React Native
  @objc func setTitle(_ node: NSNumber, title: NSString) {
    DispatchQueue.main.async {
      let component = self.bridge.uiManager.view(forReactTag: node) as? MyNativeView
      component?.setTitle(title as String)
    }
  }
}
```

**Note:** For simpler props, you can use `RCT_EXPORT_VIEW_PROPERTY` in the Objective-C file instead.

### Step 3: Create the Objective-C Module Export

Create an Objective-C file (e.g., `MyNativeViewManager.m`):

```objc
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(MyNativeViewManager, RCTViewManager)

// Export props
RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(buttonText, NSString)

// Export events (optional)
RCT_EXPORT_VIEW_PROPERTY(onButtonPress, RCTBubblingEventBlock)

@end
```

### Step 4: Update Bridging Header (if needed)

If you create a new component in a different location, make sure your bridging header imports React:

```objc
#import <React/RCTViewManager.h>
```

### Step 5: Use in React Native (TypeScript)

Create a TypeScript interface file (e.g., `MyNativeView.types.ts`):

```typescript
import { ViewProps } from 'react-native';

export interface MyNativeViewProps extends ViewProps {
  title?: string;
  buttonText?: string;
  onButtonPress?: () => void;
}
```

Then use it in your component:

```typescript
import React from 'react';
import { requireNativeComponent, ViewStyle } from 'react-native';

const MyNativeViewNative = requireNativeComponent<{
  title?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  style?: ViewStyle;
}>('MyNativeView');

export const MyNativeView: React.FC<MyNativeViewProps> = ({
  title,
  buttonText,
  onButtonPress,
  style,
  ...props
}) => {
  return (
    <MyNativeViewNative
      title={title}
      buttonText={buttonText}
      onButtonPress={onButtonPress}
      style={style}
      {...props}
    />
  );
};
```

### Step 6: Use in Your App

```typescript
import { MyNativeView } from './components/MyNativeView';

export const MyScreen = () => {
  return (
    <MyNativeView
      title="Hello React Native!"
      buttonText="Click Me"
      onButtonPress={() => console.log('Pressed!')}
      style={{ flex: 1 }}
    />
  );
};
```

## Advanced: Sending Events from Native to React Native

To send events from native to React Native, update your Swift component:

```swift
final class MyNativeView: UIView {
  
  // Add event handler property
  @objc var onButtonPress: RCTBubblingEventBlock?
  
  @objc private func buttonTapped() {
    // Send event to React Native
    onButtonPress?([:])
    
    // Or with data:
    // onButtonPress?(["message": "Button was tapped!"])
  }
}
```

Then in your View Manager, export the event:

```objc
// In MyNativeViewManager.m
RCT_EXPORT_VIEW_PROPERTY(onButtonPress, RCTBubblingEventBlock)
```

## File Structure

```
ios/
  Fossa/
    Native/
      MyComponent/
        MyNativeView.swift          # The native UIView
        MyNativeViewManager.swift   # The bridge manager
        MyNativeViewManager.m       # Objective-C export
```

## Important Notes

1. **Naming Convention**: The component name in `requireNativeComponent` must match the `@objc` name in the View Manager (without "Manager")
2. **Main Thread**: Use `DispatchQueue.main.async` when updating UI from props
3. **Bridging Header**: Make sure your bridging header is configured in Xcode project settings
4. **Module Export**: The Objective-C file is required for React Native to discover your component

## Troubleshooting

- **Component not found**: Check that the `@objc` name matches the name in `requireNativeComponent`
- **Props not working**: Verify `RCT_EXPORT_VIEW_PROPERTY` in the `.m` file
- **Events not firing**: Ensure the event handler property is properly exported

