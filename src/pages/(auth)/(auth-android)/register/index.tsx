import React, { memo, useCallback, useRef } from 'react';
import { KeyboardAvoidingView, StyleSheet, useWindowDimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
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

  const dateInputRef = useRef<DateInputRef>(null);

  const handleNextWithClose = useCallback(() => {
    dateInputRef.current?.close();
    handleNext();
  }, [handleNext]);

  const isUsernameStep = steps[currentStep]?.id === 'username';
  const isUsernameUnavailable = isUsernameStep && isUsernameAvailable === false;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="height"
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

      <PagerView
        ref={pagerRef as any}
        style={styles.pager}
        initialPage={0}
        scrollEnabled={false}
        offscreenPageLimit={steps.length - 1}
        onPageSelected={e => {
          scrollX.value = e.nativeEvent.position * width;
        }}
      >
        {steps.map((step, index) => (
          <StepForm
            key={step.id}
            item={{ ...step, subtitle: step.subtitle ?? null }}
            control={control}
            errors={errors}
            isLoading={isLoading}
            isUsernameAvailable={isUsernameAvailable}
            isCheckingUsername={isCheckingUsername}
            verificationMethod={config.verificationMethod}
            isActive={index === currentStep}
            dateInputRef={dateInputRef}
            checkPasswordsMatch={function (): boolean {
              throw new Error('Function not implemented.');
            }}
          />
        ))}
      </PagerView>

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
            disabled={
              isLoading ||
              isUsernameUnavailable ||
              (isUsernameStep && isCheckingUsername)
            }
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
    flex: 1,
    backgroundColor: theme.pallate.neutral['01'],
    paddingTop: theme.spacing.standard,
  },
  dotsRow: {
    paddingVertical: theme.spacing.standard,
  },
  pager: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
});

export default Register;
