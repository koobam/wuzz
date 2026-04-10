import React, {Ref, memo, useCallback, useEffect} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import {BottomSheetDefaultBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HStack, VStack, Text, theme, Pressable, Divider, Flex, Box} from '@components/atoms';
import { useTranslation } from 'react-i18next';
import { ArrowRight2, SearchNormal1 } from 'iconsax-react-native';
import { Country } from '@api/country.types';
import { useDebounce } from '@hooks/utils/useDebounce';

interface PhoneModalProps {
  ref: Ref<BottomSheetModal>;
  data: Country[];
  onEndReached: () => void;
  onSearch: (value: string) => void;
}
export const PhoneModal = memo((props: PhoneModalProps) => {
    const {data, onEndReached, onSearch, ref} = props;
    const {bottom, top} = useSafeAreaInsets();
    const {t} = useTranslation();
    const [search, setSearch] = React.useState('');

    const debouncedValue = useDebounce(search, 500);

    const handleSearch = useCallback((text: string) => setSearch(text), []);

    const renderBackdrop = useCallback(
      (
        val: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps,
      ) => (
        <BottomSheetBackdrop
          {...val}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          style={[val?.style, {backgroundColor: 'rgba(255,255,255,0.4)'}].filter(Boolean)}
          enableTouchThrough
        />
      ),
      [],
    );

    const renderItem = useCallback(({item}: {item: Country}) => {
      return (
        <Pressable
          padding={{
            paddingHorizontal: theme.spacing.large,
            paddingVertical: theme.spacing.standard,
          }}
          onPress={() => {}}
          fill
          borderRadius={12}
          items="center"
          spacing={12}>
          <VStack borderRadius={25} items="center" justify="center" width={50} height={50} backgroundColor={theme.pallate.neutral['04']}>
          </VStack>
          <VStack fill>
            <Text type="b2" weight="bold" color={theme.pallate.neutral['01']} text={item.name} />
            <Text type="l1" color={theme.pallate.neutral['01']} text={`(+${item.calling_code}) - ${item.iso}`} />
          </VStack>
          <ArrowRight2 size={16} color={theme.pallate.neutral['01']} />
        </Pressable>
      );
    }, []);

    const ListHeaderComponent = useCallback(() => {
      return (
        <VStack
          backgroundColor={theme.pallate.neutral['06']}
          padding={{
            paddingHorizontal: theme.spacing.large,
            paddingTop: theme.spacing.large,
            paddingBottom: theme.spacing.standard,
          }}
          spacing={theme.spacing.standard}>
          <HStack spacing={theme.spacing.standard} fill items="center">
            <VStack fill>
              <Text
                type="s2"
                weight="bold"
                color={theme.pallate.neutral['01']}
                text={t('selectCountry', {ns: 'login'})} />
              <Text
                type="l1"
                color={theme.pallate.neutral['01']}
                text={t('selectCountryDescription', {ns: 'login'})}
              />
            </VStack>
          </HStack>
          <HStack items="center">
            <Flex
              fill
              padding={{paddingHorizontal: 20, paddingRight: 60}}
              borderRadius={10}
              height={44}
              backgroundColor={theme.pallate.neutral['04']}
              as={
                <BottomSheetTextInput
                  placeholder={t('searchCountry', {ns: 'login'})}
                  style={{color: theme.pallate.neutral['01']}}
                  onChangeText={handleSearch}
                  defaultValue={search}
                  placeholderTextColor={theme.pallate.neutral['01']}
                />
              }
            />
            <Box position={{right: 20}}>
              <SearchNormal1 size={20} color={theme.pallate.neutral['01']} />
            </Box>
          </HStack>
        </VStack>
      );
    }, [handleSearch, t, search]);


    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    return (
      <BottomSheetModal
        ref={ref}
        enablePanDownToClose
        topInset={top + theme.spacing.standard}
        keyboardBehavior="interactive"
        backgroundStyle={{backgroundColor: theme.pallate.neutral['06']}}
        handleIndicatorStyle={{backgroundColor: theme.pallate.neutral['03']}}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        snapPoints={['100%']}>
        <BottomSheetFlatList<Country>
          contentContainerStyle={{
            paddingBottom: bottom + theme.spacing.standard,
          }}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={() => <Divider thickness={theme.spacing.small} />}
          data={data}
          extraData={data}
          stickyHeaderIndices={[0]}
          keyExtractor={props => props.iso3}
          renderItem={renderItem}
          onEndReached={() => {
            console.log('handle on end reached');
            onEndReached();
          }}
        />
      </BottomSheetModal>
    );
  });

export default PhoneModal;
