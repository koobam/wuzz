// import { useEffect, useRef, useState, useCallback } from 'react';
// import { Platform } from 'react-native';
// import * as RNFS from '@dr.pogodin/react-native-fs';
// import { AudioContext, AudioBuffer } from 'react-native-audio-api';

// const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

// export const useAnimalese = () => {
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const bufferMapRef = useRef<Record<string, AudioBuffer>>({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (Platform.OS !== 'ios') {
//       console.warn('Animalese only supported on iOS');
//       setLoading(false);
//       return;
//     }

//     const loadSounds = async () => {
//       try {
//         const context = new AudioContext();
//         audioContextRef.current = context;

//         for (const letter of LETTERS) {
//           const filePath = `${RNFS.MainBundlePath}/${letter}.wav`;
//           const exists = await RNFS.exists(filePath);
//           if (!exists) {
//             console.warn(`File not found: ${filePath}`);
//             continue;
//           }

//           const buffer = await context.decodeAudioDataSource(filePath);
//           bufferMapRef.current[letter] = buffer;
//         }
//       } catch (e) {
//         console.warn('Failed to load sound:', e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadSounds();

//     return () => {
//       audioContextRef.current?.close();
//       audioContextRef.current = null;
//       bufferMapRef.current = {};
//     };
//   }, []);

//   const playLetterSound = useCallback((letter: string, playbackRate: number = 1) => {
//     const audioContext = audioContextRef.current;
//     const buffer = bufferMapRef.current[letter.toUpperCase()];
//     if (!audioContext || !buffer) return;

//     const source = audioContext.createBufferSource();
//     source.buffer = buffer;
//     source.playbackRate.setValueAtTime(playbackRate, audioContext.currentTime);
//     source.connect(audioContext.destination);
//     source.start();
//   }, []);

//   const speak = useCallback(
//     async (text: string, pitch: number = 1.5, speed: number = 150) => {
//       for (const char of text.toUpperCase()) {
//         if (char === ' ' || !LETTERS.includes(char)) {
//           await wait(speed * 2);
//           continue;
//         }
//         playLetterSound(char, pitch);
//         await wait(speed);
//       }
//     },
//     [playLetterSound]
//   );

//   return {
//     loading,
//     playLetterSound,
//     speak,
//   };
// };
