import { memo, useMemo } from 'react';
import { Dimensions, Linking } from 'react-native';
import { HStack, Text, theme, VStack } from '@components/atoms';
import { EmptyStatePlaceholder } from '@components/molecules';
import { isNetworkError } from '@http/errors';
import { Danger, InfoCircle, Wifi, WifiSquare } from 'iconsax-react-native';
import type { CategoryGridProps } from './category-grid.types';
import { CategoryCard } from './category-card';
import { CategoryGridLoading } from './category-grid-loading';
import { useTranslation } from 'react-i18next';

/** Background color per category index (cycles if there are more items). */
const CATEGORY_COLORS = ['#002FFF', '#FF9D00', '#FF6265', '#2DC892'];

/** Tilt (degrees) per category index (cycles if there are more items). */
const CATEGORY_ROTATIONS = [-8, 4, -4, 8];

/** Number of cards per row. */
const COLUMNS = 4;

/** How much each card overlaps the previous one (px). */
const CARD_OVERLAP = 16;

/**
 * Card width: available row width (screen minus the VStack's horizontal padding)
 * split into COLUMNS, plus the overlap added back so the overlapped cards still
 * fill the full width edge-to-edge (otherwise they'd cluster left).
 */
const CARD_WIDTH =
  (Dimensions.get('window').width -
    theme.spacing.large * 2 +
    CARD_OVERLAP * (COLUMNS - 1)) /
  COLUMNS;

export const CategoryGrid = memo(
  ({
    onCategoryPress,
    items: itemsProp,
    isLoading = false,
    isError = false,
    error,
    onRefresh,
  }: CategoryGridProps) => {
    const { t } = useTranslation("home");
    const items = itemsProp;
    const errorMessage = useMemo(() => {
      if (error instanceof Error) return error.message;
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error
      ) {
        return String((error as { message?: string }).message);
      }
      return null;
    }, [error]);

    const content = useMemo(() => {
      if (isLoading) return <CategoryGridLoading />;

      if (isError) {
        const network = isNetworkError(error);
        return (
          <EmptyStatePlaceholder
            iconSize={48}
            icon={
              network ? (
                <WifiSquare size={48} color={theme.pallate.neutral['04']} variant="Bulk" />
              ) : (
                <Danger size={48} color={theme.pallate.neutral['04']} variant="Linear" />
              )
            }
            title={network ? 'Tidak ada koneksi internet' : 'Gagal memuat layanan'}
            description={
              network
                ? 'Periksa koneksi internetmu lalu coba lagi.'
                : errorMessage ?? 'Terjadi kesalahan. Coba lagi nanti.'
            }
            primaryButton={
              onRefresh ? { label: 'Muat ulang', onPress: onRefresh } : undefined
            }
            secondaryButton={
              network
                ? { label: 'Pengaturan', onPress: () => { Linking.openSettings(); } }
                : undefined
            }
          />
        );
      }

      if (items.length === 0) {
        return (
          <EmptyStatePlaceholder
            iconSize={48}
            icon={
              <InfoCircle size={48} color={theme.pallate.neutral['04']} variant="Linear" />
            }
            title="Belum ada layanan"
            description="Kategori layanan belum tersedia saat ini."
            primaryButton={
              onRefresh ? { label: 'Muat ulang', onPress: onRefresh } : undefined
            }
          />
        );
      }

      return (
        <HStack items="flex-start">
          {items.map((item, index) => (
            <CategoryCard
              key={item.name}
              index={index}
              width={CARD_WIDTH}
              overlap={CARD_OVERLAP}
              rotation={CATEGORY_ROTATIONS[index % CATEGORY_ROTATIONS.length]}
              backgroundColor={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
              item={item}
              onPress={() => onCategoryPress(item)}
            />
          ))}
        </HStack>
      );
    }, [isLoading, isError, items, error, errorMessage, onCategoryPress, onRefresh]);

    return (
      <VStack
        spacing={theme.spacing.standard}
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingBottom: theme.spacing.large,
        }}
      >
        <VStack>
          <Text type="s2" weight="semibold">
            {t('category.title')}
          </Text>
          <Text type="l1" color={theme.pallate.neutral['04']}>
            {t('category.description')}
          </Text>
        </VStack>
        {content}
      </VStack>
    );
  },
);

CategoryGrid.displayName = 'CategoryGrid';
