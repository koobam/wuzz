import React from 'react';
import { VStack } from '@components/atoms';
import { Camera as VisionCamera, useCameraDevice } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';

const Camera = () => {
  const device = useCameraDevice('front');
  const isFocused = useIsFocused();

  if (!device) {
    return <VStack fill />;
  }

  return (
    <VisionCamera
      style={{
        flex: 1,
        borderRadius: 30,
        overflow: 'hidden',
      }}
      device={device}
      isActive={isFocused}
    />
  );
};

export default Camera;

