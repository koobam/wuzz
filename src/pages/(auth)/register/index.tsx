import React, { memo, useCallback } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  VStack,
  Text,
  theme,
  Button,
  HStack,
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
import { FlashList } from '@shopify/flash-list';

interface Step {
  id: string;
  title: string;
  subtitle: string;
}

const Register = memo(() => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const config = getRegisterConfig();

  const {
    control,
    errors,
    isLoading,
    trigger,
    getValues,
    handleSubmit,
    onSubmit,
    checkPasswordsMatch,
  } = useRegisterForm({ config });

  const {
    currentStep,
    scrollX,
    flashListRef,
    handleNext,
    handleBack,
    handleClose,
    steps,
  } = useStepNavigation({
    trigger,
    getValues,
    checkPasswordsMatch,
    handleSubmit,
    onSubmit,
    config,
  });

  const renderStep = useCallback(
    ({ item, index }: { item: Step; index: number }) => (
      <StepForm
        item={item}
        control={control}
        errors={errors}
        isLoading={isLoading}
        checkPasswordsMatch={checkPasswordsMatch}
        verificationMethod={config.verificationMethod}
        isActive={index === currentStep}
      />
    ),
    [
      control,
      errors,
      isLoading,
      checkPasswordsMatch,
      config.verificationMethod,
      currentStep,
    ],
  );

  const keyExtractor = useCallback((item: Step) => item.id, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
        spacing={theme.spacing.tiny}
        style={styles.dotsRow}
      >
        {steps.map((_: Step, index: number) => (
          <PaginatorDot key={index} index={index} scrollX={scrollX} />
        ))}
      </HStack>

      <FlashList
        ref={flashListRef}
        data={steps}
        extraData={errors}
        renderItem={renderStep}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        removeClippedSubviews
        drawDistance={1800}
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
        spacing={theme.spacing.standard}
      >
        <HStack
          spacing={theme.spacing.small}
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
                spacing={theme.spacing.small}
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
            onPress={handleNext}
            disabled={isLoading}
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
