import React, { memo, useCallback, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CommonActions } from '@react-navigation/native';
import {
  VStack,
  Text,
  theme,
  Input,
  Button,
  HStack,
  Flex,
  Pressable,
} from '@components/atoms';
import { RootStackParamList } from '@navigation/root/root.types';
import { useAuthAction } from '@hooks/utils/useAuth';
import { loginSchema, LoginFormData } from '@features/(auth)/login/schemas';
import { ROOT_ROUTES } from '@navigation/root/_routes';
import { IconX } from 'tabler-icons-react-native';

type LoginProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const Login = memo(({ navigation }: LoginProps) => {
  const { setUser } = useAuthAction();
  const resolver = useMemo(() => zodResolver(loginSchema), []);

  const form = useForm<LoginFormData>({
    resolver,
    defaultValues: useMemo(
      () => ({
        username: '',
        password: '',
      }),
      [],
    ),
    mode: 'onBlur',
    shouldUnregister: true,
  });

  const { control, formState } = form;
  const errors = formState.errors;
  const isSubmitting = formState.isSubmitting;

  const handleForgotPassword = useCallback(() => {
    // TODO: navigate to forgot-password when screen exists
    navigation.replace('register');
  }, [navigation]);
  const handleSignUpPress = useCallback(() => {
    navigation.navigate('register');
  }, [navigation]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSubmit = useCallback(
    (_data: LoginFormData) => {
      // TODO: replace with real login API (e.g. useLogin mutation)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ROOT_ROUTES.BOTTOM }],
        }),
      );
    },
    [navigation],
  );

  const handleSimulateLogin = useCallback(() => {
    setUser({
      id: 'simulated-user',
      email: 'demo@wuzz.app',
      name: 'Demo User',
    });
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ROOT_ROUTES.BOTTOM }],
      }),
    );
  }, [setUser, navigation]);

  const isLoading = isSubmitting;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      removeClippedSubviews
      behavior="padding"
    >
      <Flex
        self="center"
        width={38}
        height={7}
        borderRadius={4}
        backgroundColor={theme.pallate.neutral['03']}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
      >
        <Button
          position={{
            top: theme.spacing.large,
            right: theme.spacing.large,
          }}
          zIndex={1}
          variant="default"
          size="fixed"
          rounded
          onPress={handleClose}
        >
          <IconX size={20} color={theme.pallate.neutral['05']} />
        </Button>
        <VStack gap={theme.spacing.tiny}>
          <Text type="h2" color={theme.pallate.neutral['05']}>
            Welcome back!
          </Text>
          <Text type="b2" color={theme.pallate.neutral['04']}>
            Your story always inspires others to follow in your footsteps.
          </Text>
        </VStack>

        <VStack gap={theme.spacing.standard}>
          <Controller
            control={control}
            name="username"
            render={({
              field: { onChange, onBlur, value },
            }: {
              field: {
                onChange: (value: string) => void;
                onBlur: () => void;
                value: string;
              };
            }) => (
              <Input
                placeholder="Username"
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.username?.message}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                variant="filled"
                spacing="none"
                size="md"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Password"
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                type="password"
                editable={!isLoading}
                variant="filled"
                spacing="none"
                size="md"
              />
            )}
          />

          <Button
            variant="link"
            size="sm"
            onPress={handleForgotPassword}
            disabled={isLoading}
          >
            <Text type="b2" color={theme.pallate.neutral['05']}>
              Forgot password?
            </Text>
          </Button>

          <Button
            variant="primary"
            size="lg"
            rounded
            onPress={form.handleSubmit(handleSubmit)}
            disabled={isLoading}
          >
            <Text type="b2" weight="medium" color={theme.pallate.neutral['01']}>
              {isLoading
                ? 'Signing into your account...'
                : 'Sign in to your account'}
            </Text>
          </Button>

          <Button
            variant="default"
            size="md"
            rounded
            onPress={handleSimulateLogin}
            disabled={isLoading}
          >
            <Text type="b2" color={theme.pallate.neutral['05']}>
              Simulate login
            </Text>
          </Button>
        </VStack>

        <HStack self="center" items="baseline" gap={theme.spacing.small}>
          <Text type="b2" color={theme.pallate.neutral['05']}>
            Don't have an account?
          </Text>
          <Pressable onPress={handleSignUpPress}>
            <Text
              type="b2"
              weight="medium"
              color={theme.pallate.primary['03']}
              text="Sign up"
            />
          </Pressable>
        </HStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

Login.displayName = 'Login';

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.standard,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.large,
    gap: theme.spacing.large,
  },
  submitButton: {
    marginTop: theme.spacing.standard,
  },
  signUpRow: {
    marginTop: theme.spacing.large,
  },
});

export default Login;
