import { useState, useCallback } from 'react';
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';

interface Layout extends LayoutRectangle {}

const useOnLayout = (): [Layout, (event: LayoutChangeEvent) => void] => {
  const [layout, setLayout] = useState<Layout>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    setLayout({ width, height, x, y });
  }, []);

  return [layout, onLayout];
};

export default useOnLayout;
