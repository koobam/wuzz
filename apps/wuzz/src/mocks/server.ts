import { createServer, Model, Factory, Response } from 'miragejs';
import type { Registry } from 'miragejs/-types';
import type Schema from 'miragejs/orm/schema';

const models = {
  user: Model,
  device: Model,
};

type AppRegistry = Registry<typeof models, Record<string, never>>;
type AppSchema = Schema<AppRegistry>;

export const makeServer = () => {
  return createServer({
    models,

    factories: {
      user: Factory.extend({
        username(i: number) {
          return i === 0 ? 'testuser' : `user${i}`;
        },
        full_name(i: number) {
          return i === 0 ? 'Test User' : `User ${i}`;
        },
        password() {
          return 'password123';
        },
        phone(i: number) {
          return 5550100 + i;
        },
        countryCode() {
          return 1;
        },
        birth_date() {
          return '1990-01-01';
        },
        phone_verified_at() {
          return new Date().toISOString();
        },
        created_at() {
          return new Date().toISOString();
        },
        updated_at() {
          return new Date().toISOString();
        },
      }),

      device: Factory.extend({
        name() {
          return 'iPhone 15 Pro';
        },
        brand() {
          return 'Apple';
        },
        unique_id() {
          return Math.random().toString(36).substring(7);
        },
        ip_address() {
          return '192.168.1.1';
        },
        created_at() {
          return new Date().toISOString();
        },
        updated_at() {
          return new Date().toISOString();
        },
      }),
    },

    seeds(server) {
      // Create test users
      server.create('user', {
        id: 1,
        username: 'testuser',
        full_name: 'Test User',
        password: 'password123',
        phone: 5550100,
        countryCode: 1,
      } as any);

      server.create('user', {
        id: 2,
        username: 'john.doe',
        full_name: 'John Doe',
        password: 'test1234',
        phone: 5550101,
        countryCode: 1,
      } as any);
    },

    routes() {
      // Set API namespace
      this.urlPrefix = 'http://localhost:3000';
      this.namespace = '/api/v1';
      this.timing = 1000; // Simulate network delay

      // Login endpoint
      this.post('/auth/login', (schema: AppSchema, request) => {
        const { username, password } = JSON.parse(request.requestBody);

        const user = schema.findBy('user', { username });

        if (!user || user.password !== password) {
          return new Response(
            401,
            {},
            {
              success: false,
              message: 'Invalid username or password',
              error: 'INVALID_CREDENTIALS',
            }
          );
        }

        const device = schema.create('device', {
          user_id: user.id,
        } as any);

        return {
          success: true,
          data: {
            user: {
              id: user.id,
              username: user.username,
              full_name: user.full_name,
              phone: user.phone,
              countryCode: user.countryCode,
              birth_date: user.birth_date,
              created_at: user.created_at,
              updated_at: user.updated_at,
            },
            device: {
              id: device.id,
              name: device.name,
              brand: device.brand,
              unique_id: device.unique_id,
              ip_address: device.ip_address,
              user_id: device.user_id,
              created_at: device.created_at,
              updated_at: device.updated_at,
            },
            accessToken: 'mock_access_token_' + Date.now(),
            refreshToken: 'mock_refresh_token_' + Date.now(),
            verified: true,
            survey: false,
          },
        };
      });

      // Send OTP endpoint
      this.post('/verify/send', (schema: AppSchema, request) => {
        const { phone, countryCode, type } = JSON.parse(request.requestBody);

        console.log(`[MirageJS] Sending ${type} OTP to +${countryCode} ${phone}`);

        return {
          success: true,
          data: {
            resendAt: new Date(Date.now() + 60000).toISOString(),
          },
        };
      });

      // Verify OTP endpoint
      this.post('/verify/check', (schema: AppSchema, request) => {
        const { code } = JSON.parse(request.requestBody);

        // Accept 123456 as valid OTP
        if (code !== '123456') {
          return new Response(
            400,
            {},
            {
              success: false,
              message: 'Invalid OTP code',
              error: 'INVALID_OTP',
            }
          );
        }

        return {
          success: true,
          data: {
            verified: true,
          },
        };
      });

      // Register endpoint
      this.post('/auth/register', (schema: AppSchema, request) => {
        const { full_name, username, password, phone, countryCode } = JSON.parse(
          request.requestBody
        );

        // Check if username exists
        const existingUser = schema.findBy('user', { username });
        if (existingUser) {
          return new Response(
            400,
            {},
            {
              success: false,
              message: 'Username already taken',
              error: 'USERNAME_EXISTS',
            }
          );
        }

        const user = schema.create('user', {
          username,
          full_name,
          password,
          phone,
          countryCode,
        } as any);

        const device = schema.create('device', {
          user_id: user.id,
        } as any);

        return {
          success: true,
          data: {
            user: {
              id: user.id,
              username: user.username,
              full_name: user.full_name,
              phone: user.phone,
              countryCode: user.countryCode,
              birth_date: user.birth_date,
              created_at: user.created_at,
              updated_at: user.updated_at,
            },
            device: {
              id: device.id,
              name: device.name,
              brand: device.brand,
              unique_id: device.unique_id,
              ip_address: device.ip_address,
              user_id: device.user_id,
              created_at: device.created_at,
              updated_at: device.updated_at,
            },
            accessToken: 'mock_access_token_' + Date.now(),
            refreshToken: 'mock_refresh_token_' + Date.now(),
          },
        };
      });

      // Forgot password - request
      this.post('/auth/forgot-password/request', (schema: AppSchema, request) => {
        const { username } = JSON.parse(request.requestBody);

        const user = schema.findBy('user', { username });
        if (!user) {
          return new Response(
            404,
            {},
            {
              success: false,
              message: 'User not found',
              error: 'USER_NOT_FOUND',
            }
          );
        }

        // Mask phone number
        const phoneStr = user.phone.toString();
        const maskedPhone = `+${user.countryCode} ***-**-${phoneStr.slice(-4)}`;

        return {
          success: true,
          data: {
            phone: maskedPhone,
            countryCode: user.countryCode,
            username: user.username,
          },
        };
      });

      // Forgot password - verify OTP
      this.post('/auth/forgot-password/verify-otp', (schema: AppSchema, request) => {
        const { username, code } = JSON.parse(request.requestBody);

        const user = schema.findBy('user', { username });
        if (!user) {
          return new Response(
            404,
            {},
            {
              success: false,
              message: 'User not found',
              error: 'USER_NOT_FOUND',
            }
          );
        }

        if (code !== '123456') {
          return new Response(
            400,
            {},
            {
              success: false,
              message: 'Invalid OTP code',
              error: 'INVALID_OTP',
            }
          );
        }

        return {
          success: true,
          data: {
            resetToken: 'mock_reset_token_' + Date.now(),
            expiresAt: new Date(Date.now() + 600000).toISOString(),
          },
        };
      });

      // Forgot password - reset
      this.post('/auth/forgot-password/reset', (schema: AppSchema, request) => {
        const { resetToken, newPassword } = JSON.parse(request.requestBody);

        if (!resetToken || !resetToken.startsWith('mock_reset_token_')) {
          return new Response(
            400,
            {},
            {
              success: false,
              message: 'Invalid or expired reset token',
              error: 'INVALID_TOKEN',
            }
          );
        }

        return {
          success: true,
          data: {
            success: true,
            message: 'Password reset successfully',
          },
        };
      });

      // Pass through for any unhandled requests
      this.passthrough();
    },
  });
};

