import {Character, CharacterAction} from './character';

type Walkthrough = {
  message: string;
  name: Character;
  action: CharacterAction;
  cloud: {
    type: 'top' | 'bottom';
    text: 'b1' | 'b2',
  };
  container: {
    position: Record<string, number>;
  };
  avatar: {
    position: Record<string, number>;
    rotate?: string;
  };
  uri: {
    character: string;
    cloud: string;
    sound: string;
  };
};

const cdnBaseUrl = 'https://cdn.tobby.life/walkthrough/';
const cloudBaseUrl = cdnBaseUrl + 'clouds/';
const soundBaseUrl = cdnBaseUrl + 'sounds/';

export const walkthrough: Walkthrough[] = [
  {
    message:
      'Hey! I’m Tobby. 👋 Let’s beat that addiction together... Ready to start?',
    action: 'talk',
    name: 'tobby',
    cloud: {
      type: 'top',
      text: 'b1',
    },
    container: {
      position: {
        bottom: 0,
      }
    },
    avatar: {
      position: {
        bottom: 0,
        left: 0,
      },
    },
    uri: {
      character: cdnBaseUrl + 'tobby/greetings.png',
      cloud: cloudBaseUrl + 'cloud_2.png',
      sound: soundBaseUrl + 'greetings.mp3',
    },
  },
  {
    message:
      'These are your main stats: ❤️ Hearts, 🔥 Streaks, 💎 Gems! You’ll see them at the top to track your progress.',
    name: 'tobby',
    action: 'talk',
    cloud: {
      type: 'bottom',
      text: 'b2',
    },
    container: {
      position: {
        top: 0,
        left: 50,
      },
    },
    avatar: {
      position: {
        top: 100,
        right: -80,
      },
      rotate: '-30deg',
    },
    uri: {
      character: cdnBaseUrl + 'tobby/pointing.png',
      cloud: cloudBaseUrl + 'cloud_2.png',
      sound: soundBaseUrl + 'track.mp3',
    },
  },
  {
    message:
      'This is your Room 🏠 It starts empty, but you’ll fill it as you make progress!',
    name: 'tobby',
    action: 'talk',
    cloud: {
      type: 'top',
      text: 'b1',
    },
    container: {
      position: {
        bottom: 0,
      },
    },
    avatar: {
      position: {
        bottom: 0,
        left: 0,
      },
    },
    uri: {
      character: cdnBaseUrl + 'tobby/pointing.png',
      cloud: cloudBaseUrl + 'cloud_3.png',
      sound: soundBaseUrl + 'greetings.mp3',
    },
  },
];
