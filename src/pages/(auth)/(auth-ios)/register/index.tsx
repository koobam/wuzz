import React, { memo, useCallback, useLayoutEffect, useRef, type ReactNode } from 'react';
import { KeyboardAvoidingView, StyleSheet, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  VStack,
  Text,
  theme,
  Button,
  HStack,
  type DateInputRef,
} from '@components/atoms';
import { RootStackParamList } from '@navigation/root/root.types';
import {
  IconArrowLeft,
  IconArrowRight,
  IconX,
} from 'tabler-icons-react-native';
import {
  useRegisterForm,
  useStepNavigation,
} from '@features/(auth)/register/hooks';
import { PaginatorDot, StepForm } from '@features/(auth)/register/components';
import { getRegisterConfig } from '@features/(auth)/register/config';
import { FlashList, type FlashListRef } from '@shopify/flash-list';

interface Step {
  id: string;
  title: string;
  subtitle?: ReactNode;
}

const Register = memo(() => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { width } = useWindowDimensions();
  const config = getRegisterConfig();

  const {
    control,
    errors,
    isLoading,
    trigger,
    getValues,
    watch,
    setError,
    clearErrors,
    handleSubmit,
    onSubmit,
  } = useRegisterForm({ config });

  const watchedUsername = (watch('username') as string | undefined) ?? '';

  const flashListRef = useRef<FlashListRef<Step>>(null);

  const {
    currentStep,
    scrollX,
    pagerRef,
    handleNext,
    handleBack,
    handleClose,
    steps,
    isUsernameAvailable,
    isCheckingUsername,
  } = useStepNavigation({
    trigger,
    username: watchedUsername,
    getValues,
    setError,
    clearErrors,
    handleSubmit,
    onSubmit,
    config,
  });

  // Adapter: hook calls pagerRef.current.setPage() — wire it to FlashList on iOS
  useLayoutEffect(() => {
    pagerRef.current = {
      setPage: (index: number) => {
        flashListRef.current?.scrollToIndex({ index, animated: true });
      },
    };
  }, [pagerRef]);

  const dateInputRef = useRef<DateInputRef>(null);

  const handleNextWithClose = useCallback(() => {
    dateInputRef.current?.close();
    handleNext();
  }, [handleNext]);

  const renderStep = useCallback(
    ({ item, index }: { item: Step; index: number }) => (
      <StepForm
        item={{ ...item, subtitle: item.subtitle ?? null }}
        control={control}
        errors={errors}
        isLoading={isLoading}
        isUsernameAvailable={isUsernameAvailable}
        isCheckingUsername={isCheckingUsername}
        verificationMethod={config.verificationMethod}
        isActive={index === currentStep}
        dateInputRef={dateInputRef} checkPasswordsMatch={function (): boolean {
          throw new Error('Function not implemented.');
        } }      />
    ),
    [
      control,
      errors,
      isLoading,
      isUsernameAvailable,
      isCheckingUsername,
      config.verificationMethod,
      currentStep,
    ],
  );

  const keyExtractor = useCallback((item: Step) => item.id, []);
  const isUsernameStep = steps[currentStep]?.id === 'username';
  const isUsernameUnavailable = isUsernameStep && isUsernameAvailable === false;

  return (
    <KeyboardAvoidingView
      behavior="padding"
    >
      <Button position={{
        top: theme.spacing.large,
        right: theme.spacing.large,
      }} zIndex={1} variant="default" size="fixed" rounded onPress={handleClose}>
        <IconX size={20} color={theme.pallate.neutral['05']} />
      </Button>

      <HStack
        items="center"
        justify="center"
        gap={theme.spacing.tiny}
        style={styles.dotsRow}
      >
        {steps.map((_, index) => (
          <PaginatorDot key={index} index={index} scrollX={scrollX} />
        ))}
      </HStack>

      <FlashList
        ref={flashListRef as any}
        data={steps}
        extraData={errors}
        renderItem={renderStep}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        removeClippedSubviews
        drawDistance={width * steps.length}
        showsHorizontalScrollIndicator={false}
        onScroll={event => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
      />
      <VStack
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingBottom: theme.spacing.large,
        }}
        gap={theme.spacing.standard}
      >
        <HStack
          gap={theme.spacing.small}
          items="center"
          justify="space-between"
        >
          {currentStep !== 0 && (
            <Button
              variant="default"
              size="lg"
              rounded
              onPress={handleBack}
              disabled={isLoading}
            >
              <HStack
                items="center"
                justify="center"
                gap={theme.spacing.small}
              >
                <IconArrowLeft size={22} color={theme.pallate.neutral['05']} />
                <Text type="b2" color={theme.pallate.neutral['05']}>
                  Kembali
                </Text>
              </HStack>
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            rounded
            fill
            style={styles.nextButton}
            onPress={handleNextWithClose}
            disabled={isLoading || isUsernameUnavailable || (isUsernameStep && isCheckingUsername)}
          >
            <Text type="b1" weight="medium" color={theme.pallate.neutral['01']}>
              {currentStep === steps.length - 1
                ? isLoading
                  ? 'Membuat akun...'
                  : 'Buat akun'
                : 'Lanjut'}
            </Text>
            {currentStep < steps.length - 1 && (
              <IconArrowRight size={20} color={theme.pallate.neutral['01']} />
            )}
          </Button>
        </HStack>

        {currentStep === 0 && (
          <Button
            variant="link"
            size="sm"
            onPress={() => navigation.navigate('login')}
          >
            <Text type="b2" color={theme.pallate.neutral['04']}>
              Sudah punya akun?{' '}
              <Text
                type="b2"
                weight="semibold"
                color={theme.pallate.primary['03']}
              >
                Masuk
              </Text>
            </Text>
          </Button>
        )}
      </VStack>
    </KeyboardAvoidingView>
  );
});

Register.displayName = 'Register';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.pallate.neutral['01'],
    paddingTop: theme.spacing.standard,
  },
  header: {
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.standard,
  },
  dotsRow: {
    paddingVertical: theme.spacing.standard,
  },
  nextButton: {
    flex: 1,
  },
});

export default Register;
