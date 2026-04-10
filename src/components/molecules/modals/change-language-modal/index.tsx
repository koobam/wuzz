import React, { memo, useCallback, useMemo } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  HStack,
  VStack,
  Text,
  Flex,
  theme,
  Pressable,
} from '@components/atoms';
import { TextInput } from 'react-native';
import { LanguageType, languages } from '@services/index';
import { useTranslation } from 'react-i18next';
import { TickCircle } from 'iconsax-react-native';
import Image from '@components/atoms/image';

export const ChangeLanguageModal = memo(props => {
  const { ref } = props;
  const { bottom, top } = useSafeAreaInsets();
  const { i18n, t } = useTranslation();
  const flag = languages.find(item => item.value === i18n.language)?.flag;
  const flagUrl = useMemo(
    () => `https://flagcdn.com/80x60/${flag}.png`,
    [flag],
  );

  const renderBackdrop = useCallback(
    (val: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...val}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        style={[val?.style, { backgroundColor: 'rgba(255,255,255,0.4)' }].filter(Boolean)}
        enableTouchThrough
      />
    ),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: LanguageType }) => {
      return (
        <Pressable
          padding={{
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
          onPress={() => i18n.changeLanguage(item.value)}
          fill
          borderRadius={12}
          items="center"
          spacing={12}
        >
          <VStack
            borderRadius={20}
            items="center"
            justify="center"
            width={40}
            height={40}
            backgroundColor={theme.pallate.neutral['04']}
          >
            <Image
              uri={`https://flagcdn.com/80x60/${item.flag}.png`}
              resizeMode="contain"
              style={{
                width: 30,
                height: 14,
              }}
            />
          </VStack>
          <Text
            fill
            type="b1"
            weight="bold"
            color={theme.pallate.neutral['01']}
          >
            {item.value.toLocaleUpperCase()} - {item.label}
          </Text>
          {item.value === i18n.language && (
            <TickCircle size={22} color={theme.pallate.neutral['01']} />
          )}
        </Pressable>
      );
    },
    [i18n],
  );

  const ListHeaderComponent = useMemo(() => {
    return (
      <VStack
        backgroundColor={theme.pallate.neutral['06']}
        padding={20}
        spacing={20}
      >
        <HStack spacing={10} fill items="center">
          <VStack spacing={4} fill>
            <Text
              type="s1"
              weight="bold"
              color={theme.pallate.neutral['01']}
              text={t('changeLanguageTitle')}
            />
            <Text
              type="b2"
              color={theme.pallate.neutral['01']}
              text={t('changeLanguageSubtitle')}
            />
          </VStack>
          <HStack
            padding={{ paddingHorizontal: 20, paddingVertical: 10 }}
            borderRadius={40}
            spacing={theme.spacing.small}
            backgroundColor={theme.pallate.neutral['04']}
          >
            <Image
              uri={flagUrl}
              resizeMode="contain"
              style={{
                width: 20,
                height: 14,
              }}
            />
            <Text type="l1" weight="bold" color={theme.pallate.neutral['01']}>
              {i18n.language.toLocaleUpperCase()}
            </Text>
          </HStack>
        </HStack>
        <Flex
          fill
          padding={{ paddingHorizontal: 20 }}
          borderRadius={10}
          height={44}
          backgroundColor={theme.pallate.neutral['04']}
          as={
            <TextInput
              placeholder="Search Language"
              style={{ color: theme.pallate.neutral['01'] }}
              placeholderTextColor={theme.pallate.neutral['01']}
            />
          }
        />
      </VStack>
    );
  }, [flagUrl, i18n.language, t]);

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      enablePanDownToClose
      topInset={top + theme.spacing.standard}
      keyboardBehavior="interactive"
      backgroundStyle={{ backgroundColor: theme.pallate.neutral['06'] }}
      handleIndicatorStyle={{ backgroundColor: theme.pallate.neutral['03'] }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetFlatList<LanguageType>
        contentContainerStyle={{
          paddingBottom: bottom,
        }}
        ListHeaderComponent={ListHeaderComponent}
        data={languages}
        extraData={languages}
        stickyHeaderIndices={[0]}
        renderItem={renderItem}
      />
    </BottomSheetModal>
  );
});

export default ChangeLanguageModal;
