import { makeServer } from './server';

// Initialize MirageJS server in development mode
if (__DEV__) {
  makeServer();
  console.log('[MirageJS] Mock API server started');
  console.log('[MirageJS] Test credentials:');
  console.log('  - Username: testuser / Password: password123');
  console.log('  - Username: john.doe / Password: test1234');
  console.log('  - OTP Code: 123456');
}

