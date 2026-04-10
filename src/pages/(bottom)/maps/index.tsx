import { HStack, Text, theme, VStack, Box, Pressable } from '@components/atoms';
import { MapsType } from './maps.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Mapbox, { Camera, MapView } from '@rnmapbox/maps';
import LinearGradient from 'react-native-linear-gradient';
import { useState, useCallback } from 'react';
import Image from '@components/atoms/image';
import { IconChevronDown, IconMapPin } from 'tabler-icons-react-native';
import { FlashList } from '@shopify/flash-list';
import { Icon, People } from 'iconsax-react-native';

export const Maps = (_props: MapsType) => {
  const { top } = useSafeAreaInsets();
  const [zoomLevel, setZoomLevel] = useState<number>(2);

  const handleCameraChanged = useCallback((state: any) => {
    if (state?.properties?.zoom !== undefined) {
      setZoomLevel(state.properties.zoom);
    }
  }, []);

  console.log('zoomLevel', zoomLevel);

  return (
    <VStack fill>
      <LinearGradient
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
        colors={[theme.pallate.neutral['06'], 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <VStack
          padding={{
            paddingTop: theme.spacing.standard + top,
            paddingBottom: theme.spacing.large,
          }}
          spacing={theme.spacing.standard}
        >
          <HStack padding={{
            paddingHorizontal: theme.spacing.large,
          }} items="center" justify="space-between">
            <VStack>
              <Text
                type="h3"
                weight="bold"
                italic
                color={theme.pallate.neutral['01']}
              >
                Maps
              </Text>
              <Text type="l1" italic color={theme.pallate.neutral['01']}>
                Every story deserves a place.
              </Text>
            </VStack>
          </HStack>
          {/* Tabs FlashList */}
          <FlashList
            horizontal
            data={[
              { label: 'Friends', icon: <People variant="Bulk" size={22} color={theme.pallate.neutral['01']} /> },
              { label: 'Moments' },
              { label: 'Countries' },
              { label: 'Cities' },
            ]}
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.large,
            }}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <Box width={theme.spacing.small} />
            )}
            renderItem={({ item, index }) => (
              <Pressable
                padding={{
                  paddingHorizontal: theme.spacing.large,
                  paddingVertical: theme.spacing.standard,
                }}
                borderRadius={30}
                items="center"
                spacing={theme.spacing.small}
                backgroundColor={index === 0 ? theme.pallate.neutral['05'] : theme.pallate.neutral['01']}
              >
                {item.icon}
                <Text
                  type="l1"
                  color={index === 0 ? theme.pallate.neutral['01'] : theme.pallate.neutral['05']}
                  align="center"
                  weight={index === 0 ? 'bold' : 'regular'}
                >
                  {item.label}
                </Text>
              </Pressable>
            )}
          />
        </VStack>
      </LinearGradient>
      <MapView
        style={{
          flex: 1,
        }}
        projection="globe"
        logoEnabled={false}
        attributionEnabled={false}
        onCameraChanged={handleCameraChanged}
        compassEnabled={false}
        scaleBarEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <Camera
          animationDuration={800}
          animationMode="easeTo"
          followPadding={{
            paddingBottom: 0,
          }}
          followUserLocation
          minZoomLevel={3}
        />
        {[
          {
            id: 1,
            lng: 106.8456,
            lat: -6.2088,
            imageUri: [
              'https://images.unsplash.com/photo-1542581482-851c38ee4b94?w=400',
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
            ],
            rating: 4.5,
          },
          {
            id: 2,
            lng: 106.8451,
            lat: -6.2146,
            imageUri: [
              'https://images.unsplash.com/photo-1542581482-851c38ee4b94?w=400',
              'https://images.unsplash.com/photo-1542581482-851c38ee4b94?w=400',
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
            ],
            rating: 4.5,
          },
          {
            id: 3,
            lng: 110.3695,
            lat: -7.7956,
            imageUri: [
              'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400',
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
            ],
            rating: 4.7,
          },
          {
            id: 5,
            lng: 110.821,
            lat: -7.5561,
            imageUri: [
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
              'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400',
              'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400',
            ],
            rating: 4.8,
          },
          {
            id: 6,
            lng: 110.2177,
            lat: -7.4798,
            imageUri: [
              'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400',
              'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400',
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
            ],
            rating: 4.7,
          },
          {
            id: 4,
            lng: 110.4144,
            lat: -6.9904,
            imageUri: [
              'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400',
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
            ],
            rating: 4.6,
          },
        ].map(post => (
          <Mapbox.MarkerView
            key={`post-marker-${post.id}`}
            id={`post-marker-${post.id}`}
            coordinate={[post.lng, post.lat]}
          >
            <Box width={90}>
              {post.imageUri.map((image, index) => (
                <Box
                  position="absolute"
                  backgroundColor={theme.pallate.neutral['01']}
                  borderRadius={16}
                  width={90}
                  height={90}
                  padding={{
                    paddingVertical: 0,
                    paddingHorizontal: 0,
                  }}
                  style={{
                    ...theme.elevations['2'],
                    overflow: 'hidden',
                    transform: [{ rotate: `${-30 + index * 30}deg` }],
                  }}
                  borderWidth={3}
                  borderColor={theme.pallate.neutral['01']}
                >
                  <Image
                    uri={image}
                    style={{
                      width: 90,
                      height: 90,
                      // Match the parent rotation so the image doesn't look clipped
                      transform: [{ rotate: '-15deg' }],
                    }}
                    resizeMode="cover"
                  />
                </Box>
              ))}
              <Box
                padding={{ paddingHorizontal: 4, paddingVertical: 2 }}
                backgroundColor={theme.pallate.neutral['06']}
                borderRadius={999}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  type="l1"
                  weight="bold"
                  color={theme.pallate.neutral['01']}
                >
                  {post.imageUri.length} Destination
                </Text>
              </Box>
            </Box>
          </Mapbox.MarkerView>
        ))}
        <Mapbox.UserLocation animated={false} />
      </MapView>
    </VStack>
  );
};
