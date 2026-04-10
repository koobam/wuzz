import { FasterImageProps, FasterImageView } from '@candlefinance/faster-image';
import React, { memo, useCallback } from 'react';
import { Image as ImageNative } from 'react-native';

interface ImageProps extends Omit<FasterImageProps, 'source'> {
  uri: string | number;
  resizeMode?: FasterImageProps['source']['resizeMode'];
}

const Image = memo((props: ImageProps) => {
  const { uri, resizeMode, ...rest } = props;
  const resolveImageUri = useCallback(() => {
    if (typeof uri === 'string') {
      return uri;
    }
    return ImageNative.resolveAssetSource(uri).uri || '';
  }, [uri])();

  return (
    <FasterImageView
      source={{
        resizeMode: resizeMode || 'cover',
        url: resolveImageUri,
      }}
      {...rest}
    />
  );
});

Image.displayName = 'Image';
export default Image;
