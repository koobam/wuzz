// import React, {memo, useEffect, useState} from 'react';
// import {Dimensions, StyleSheet} from 'react-native';
// import {Canvas, Path, Skia, PathOp} from '@shopify/react-native-skia';
// import {
//   Flex,
//   HStack,
//   Pressable,
//   Text,
//   theme,
//   TypingText,
//   VStack,
//   VStackAnimated,
// } from '@components/atoms';
// import FastImage from '@d11/react-native-fast-image';
// import {useHighlight} from '@hooks/utils/useHighlight';
// import {IconChevronRight} from 'tabler-icons-react-native';
// import {FadeInDown} from 'react-native-reanimated';
// import { useSound } from '@hooks/utils/useSound';
// import { walkthrough } from '@services/consts/walkthrough';
// import { SoundKey } from '@services/contexts/sound/sound.types';

// const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

// interface ActionProps {
//   onPressPrev: () => void;
//   onPressNext: () => void;
//   isLast?: boolean;
// }

// const Action = (props: ActionProps) => {
//   const {onPressPrev, onPressNext, isLast} = props;
//   return (
//   <HStack
//     spacing={theme.spacing.small}
//     position={{
//       bottom: 0,
//       right: 50,
//     }}
//   >
//     <Pressable
//       padding={{
//         paddingHorizontal: theme.spacing.large,
//         paddingVertical: theme.spacing.standard,
//       }}
//       onPress={onPressPrev}
//       borderRadius={50}
//       items="center"
//       borderWidth={1}
//       borderColor={theme.pallate.neutral['01']}
//       backgroundColor={theme.pallate.neutral['03']}
//     >
//       <Text type="l1" color={theme.pallate.neutral['01']} weight="bold">
//         Skip
//       </Text>
//     </Pressable>
//     <Pressable
//       padding={{
//         paddingRight: theme.spacing.standard,
//         paddingLeft: theme.spacing.large,
//         paddingVertical: theme.spacing.standard,
//       }}
//       borderWidth={1}
//       borderColor={theme.pallate.neutral['01']}
//       borderRadius={50}
//       items="center"
//       backgroundColor={theme.pallate.info['03']}
//       onPress={onPressNext}
//     >
//       <Text type="l1" color={theme.pallate.neutral['01']} weight="bold">
//         {!isLast ? 'Next' : 'Done'}
//       </Text>
//       {!isLast && (
//         <IconChevronRight size={20} color={theme.pallate.neutral['01']} />
//       )}
//     </Pressable>
//   </HStack>
// );
// };

// interface CloudProps {
//   uri: string;
//   message: string;
//   type: 'b1' | 'b2';
//   onPressPrev: () => void;
//   onPressNext: () => void;
// }
// const Cloud = (props: CloudProps) => {
//   const {uri, type, message, onPressPrev, onPressNext} = props;
//   return (
//   <VStack position="relative">
//   <FastImage
//     style={styles.cloud}
//     resizeMode="contain"
//     source={{uri}}
//   />
//   <Flex
//     style={{position: 'absolute'}}
//     padding={{
//       paddingTop: 72,
//       paddingLeft: 60,
//       paddingRight: 70,
//     }}
//   >
//     <TypingText align="center" type={type} speed={10} content={message} />
//   </Flex>
//   <Action onPressPrev={onPressPrev} onPressNext={onPressNext} />
// </VStack>
// );
// };
// export const Walkthrough = memo(() => {
//   const {currentStep, setCurrentStep, visible, stepRefs, setVisible} = useHighlight();
//   const [highlight, setHighlight] = useState({
//     x: 0,
//     y: 0,
//     width: 0,
//     height: 0,
//     borderRadius: 0, // Adjust as needed
//   });
//   const { play } = useSound();

//   useEffect(() => {
//     if (visible && walkthrough[currentStep]?.uri.sound) {
//         const soundKey: SoundKey = `${walkthrough[currentStep].name}:${walkthrough[currentStep].action}:${currentStep}`;
//         play(soundKey);
//     }
//   }, [currentStep, play, visible]);


//   useEffect(() => {
//     if (visible) {
//       // Scroll to the current step's ref when walkthrough becomes visible
//       const stepRef = stepRefs[currentStep];
//       if (stepRef.current) {
//         // Defer measurement to the next frame
//       requestAnimationFrame(() => {
//         stepRef.current?.measureInWindow((x, y, width, height) => {
//           setHighlight({
//             x,
//             y,
//             width,
//             height,
//             borderRadius: 50,
//           });
//         });
//       });
//       }
//     }
//   }, [visible, setCurrentStep, stepRefs, currentStep]);

//   if (!visible) {
//     return null;
//   }

//   const {x, y, width, height, borderRadius} = highlight;

//   console.log(highlight);

//   // Create a rounded rectangle for the "hole"
//   const rrect = Skia.RRectXY({x, y, width, height}, borderRadius, borderRadius);

//   // Outer full-screen path
//   const outer = Skia.Path.Make();
//   outer.addRect({x: 0, y: 0, width: screenWidth, height: screenHeight});

//   // Inner rounded rect path (the "hole")
//   const inner = Skia.Path.Make();
//   inner.addRRect(rrect);

//   // Subtract inner from outer using even-odd rule
//   outer.op(inner, PathOp.Difference);

//   const item = walkthrough[currentStep];

//   return (
//     <VStack style={StyleSheet.absoluteFill}>
//       <Canvas style={{flex: 1}}>
//         <Path path={outer} color="rgba(0,0,0,0.85)" />
//       </Canvas>

//       <VStackAnimated
//         entering={FadeInDown.duration(1500)}
//         style={[styles.containerAbsolute, item.container.position]}
//         items="flex-end"
//       >
//         {item.cloud.type === 'top' && (
//           <Cloud
//             uri={item.uri.cloud}
//             type={item.cloud.text}
//             message={item.message} onPressPrev={() => {
//               if (currentStep > 0) {
//                 setCurrentStep(currentStep - 1);
//               } else {
//                 setVisible(false);
//               }
//             }} onPressNext={() => {
//               if (currentStep < walkthrough.length - 1) {
//                 setCurrentStep(currentStep + 1);
//               } else {
//                 setVisible(false);
//               }
//             }}
//             />
//         )}
//         {/* <FastImage
//           style={[styles.avatar, item.avatar.position, {transform: item.avatar.rotate ? [{rotate: item.avatar.rotate}] : [] }]}
//           resizeMode="contain"
//           source={{uri: item.uri.character}}
//         /> */}
//         {item.cloud.type === 'bottom' && (
//           <Cloud
//             type={item.cloud.text}
//             uri={item.uri.cloud}
//             message={item.message}
//             onPressPrev={() => {
//               if (currentStep > 0) {
//                 setCurrentStep(currentStep - 1);
//               } else {
//                 setVisible(false);
//               }
//             }}
//             onPressNext={() => {
//               if (currentStep < walkthrough.length - 1) {
//                 setCurrentStep(currentStep + 1);
//               } else {
//                 setVisible(false);
//               }
//             }}
//           />
//         )}
//       </VStackAnimated>
//     </VStack>
//   );
// });

// const styles = StyleSheet.create({
//   avatar: {
//     width: 200,
//     height: 350,
//   },
//   cloud: {
//     width: 350,
//     height: 220,
//   },
//   containerAbsolute: {
//     position: 'absolute',
//   },
// });

// export default Walkthrough;
