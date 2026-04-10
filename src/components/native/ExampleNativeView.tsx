import React from 'react';
import { requireNativeComponent, ViewStyle, NativeSyntheticEvent } from 'react-native';

interface ExampleNativeViewProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonColor?: string;
  onButtonPress?: (event: NativeSyntheticEvent<{ message: string; timestamp: number }>) => void;
  style?: ViewStyle;
}

interface NativeEvent {
  message: string;
  timestamp: number;
}

const ExampleNativeViewNative = requireNativeComponent<ExampleNativeViewProps>('ExampleNativeView');

export const ExampleNativeView: React.FC<ExampleNativeViewProps> = ({
  title,
  subtitle,
  buttonText,
  buttonColor,
  onButtonPress,
  style,
  ...props
}) => {
  const handleButtonPress = (event: NativeSyntheticEvent<NativeEvent>) => {
    console.log('Button pressed in native:', event.nativeEvent);
    onButtonPress?.(event);
  };

  return (
    <ExampleNativeViewNative
      title={title}
      subtitle={subtitle}
      buttonText={buttonText}
      buttonColor={buttonColor}
      onButtonPress={handleButtonPress}
      style={style}
      {...props}
    />
  );
};

