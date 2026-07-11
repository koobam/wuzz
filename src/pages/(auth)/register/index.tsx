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
  Pressable,
} from '@components/atoms';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '@navigation/root/root.types';
import { ArrowCircleLeft } from 'iconsax-react-native';
import { IconArrowLeft, IconArrowRight } from 'tabler-icons-react-native';
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
  const insets = useSafeAreaInsets();

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
      <Pressable
        onPress={handleClose}
        self="flex-start"
        margin={{
          marginTop: insets.top + theme.spacing.standard,
          marginLeft: theme.spacing.large,
        }}
        padding={{
          paddingVertical: theme.spacing.standard,
          paddingHorizontal: theme.spacing.medium,
        }}
        borderWidth={1}
        borderColor={theme.pallate.neutral['02']}
        items="center"
        spacing={theme.spacing.small}
        borderRadius={999}
        backgroundColor={theme.pallate.neutral['01']}
      >
        <ArrowCircleLeft
          variant="Bulk"
          size={24}
          color={theme.pallate.neutral['04']}
        />
        <Text type="b2" weight="bold" color={theme.pallate.neutral['04']}>
          Kembali
        </Text>
      </Pressable>

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
