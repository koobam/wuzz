import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExampleNativeView } from './ExampleNativeView';

/**
 * Example usage of the native component
 * 
 * To use this component:
 * 1. Make sure the native files are added to your Xcode project
 * 2. Rebuild the iOS app
 * 3. Import and use this component in your React Native code
 */
export const ExampleNativeViewScreen = () => {
  const handleButtonPress = (event: any) => {
    console.log('Button pressed!', event.nativeEvent);
    alert(`Message: ${event.nativeEvent.message}`);
  };

  return (
    <View style={styles.container}>
      <ExampleNativeView
        title="Custom Title"
        subtitle="This subtitle is set from React Native"
        buttonText="Press Me!"
        onButtonPress={handleButtonPress}
        style={styles.nativeView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  nativeView: {
    flex: 1,
  },
});

