import React, { memo, useCallback, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text as RNText,
  useWindowDimensions,
  View,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HStack, Pressable, Text, VStack, theme } from '@components/atoms';
import {
  SafeText,
  TruncatedText,
  InkSafeText,
  BalancedText,
  PrettyText,
} from '@components/atoms/text';
import TextStyle from '@components/atoms/text/text.style';
import { IconChevronLeft, IconPlayerPlay, IconRefresh } from 'tabler-icons-react-native';

// ── Corpus ────────────────────────────────────────────────────────────────

// ── Render profiler constants ─────────────────────────────────────────────

const PROFILER_TEXT = 'The quick brown fox jumps over the lazy dog — typography benchmark.';
const PROFILER_ITEMS = 100;
const PROFILER_RUNS  = 7; // mount cycles per variant, first 2 discarded as warmup

// Equivalent flat style to Text type="b2" weight="regular" — used for the
// RN baseline so we're comparing component overhead, not style differences.
const RN_B2_STYLE = StyleSheet.create({
  text: { fontFamily: 'Poppins-Regular', fontWeight: '400', fontSize: 14, lineHeight: 21 },
}).text;

const RNTextBatch = React.memo(({ seed }: { seed: number }) => (
  <>
    {Array.from({ length: PROFILER_ITEMS }, (_, i) => (
      <RNText key={`${seed}-${i}`} style={RN_B2_STYLE}>{PROFILER_TEXT}</RNText>
    ))}
  </>
));
RNTextBatch.displayName = 'RNTextBatch';

const CustomTextBatch = React.memo(({ seed }: { seed: number }) => (
  <>
    {Array.from({ length: PROFILER_ITEMS }, (_, i) => (
      <Text key={`${seed}-${i}`} type="b2">{PROFILER_TEXT}</Text>
    ))}
  </>
));
CustomTextBatch.displayName = 'CustomTextBatch';

// ── Existing benchmark corpus ─────────────────────────────────────────────

const SHORT = 'Wuzz laundry app';
const LONG =
  'Selamat datang di Wuzz, aplikasi laundry terbaik untuk kebutuhan Anda. ' +
  'Kami menyediakan layanan kiloan, satuan, dan ekspres dengan penjemputan gratis. ' +
  'Pesan sekarang dan dapatkan promo menarik setiap harinya!';
const ITALIC_SAMPLE = 'Typography matters — italic glyphs often overshoot their container bounds.';
const BALANCED_SAMPLE = 'Wuzz makes laundry effortless with fast pickup and delivery across the city.';
const ITERATIONS = 200;

// ── Benchmark runner ──────────────────────────────────────────────────────

interface Result {
  label: string
  group: string
  avgMs: number
  opsPerSec: number
  error?: string
}

async function bench(group: string, label: string, fn: () => void, n = ITERATIONS): Promise<Result> {
  try {
    fn(); fn(); // warmup
    const t0 = performance.now();
    for (let i = 0; i < n; i++) fn();
    const elapsed = performance.now() - t0;
    const avg = elapsed / n;
    return { group, label, avgMs: avg, opsPerSec: Math.round(1000 / avg) };
  } catch (e: any) {
    return { group, label, avgMs: 0, opsPerSec: 0, error: e?.message ?? String(e) };
  }
}

// ── UI helpers ────────────────────────────────────────────────────────────

const HR = () => <View style={styles.hr} />;

const SectionLabel = ({ children }: { children: string }) => (
  <Text
    type="l1"
    weight="semibold"
    color={theme.pallate.neutral['03']}
    margin={{ marginBottom: 4 }}
    style={styles.sectionLabel}
  >
    {children.toUpperCase()}
  </Text>
);

const Card = ({ title, tag, children }: { title: string; tag?: string; children: React.ReactNode }) => (
  <VStack style={styles.card} gap={8} padding={{ paddingHorizontal: 16, paddingVertical: 14 }}>
    <HStack items="center" gap={8}>
      <Text type="b2" weight="semibold" color={theme.pallate.neutral['05']} fill>
        {title}
      </Text>
      {tag && (
        <View style={styles.tag}>
          <Text type="l2" weight="medium" color={theme.pallate.neutral['03']}>{tag}</Text>
        </View>
      )}
    </HStack>
    {children}
  </VStack>
);

const ResultRow = ({ r, isLast }: { r: Result; isLast: boolean }) => (
  <>
    <HStack justify="space-between" items="center" padding={{ paddingVertical: 7 }}>
      <Text type="b2" color={theme.pallate.neutral['04']} style={{ flex: 1, marginRight: 8 }}>
        {r.label}
      </Text>
      {r.error ? (
        <Text type="l1" color="#e53e3e" style={{ flex: 1, textAlign: 'right' }} numberOfLines={2}>
          {r.error}
        </Text>
      ) : (
        <VStack items="flex-end">
          <Text type="b2" weight="bold" color={theme.pallate.neutral['05']}>
            {r.avgMs < 0.1
              ? `${(r.avgMs * 1000).toFixed(0)} µs`
              : r.avgMs < 1
              ? `${(r.avgMs * 1000).toFixed(0)} µs`
              : `${r.avgMs.toFixed(3)} ms`}
          </Text>
          <Text type="l2" color={theme.pallate.neutral['03']}>
            {r.opsPerSec.toLocaleString()} ops/s
          </Text>
        </VStack>
      )}
    </HStack>
    {!isLast && <HR />}
  </>
);

const ResultGroup = ({ group, results }: { group: string; results: Result[] }) => (
  <VStack style={styles.card} padding={{ paddingHorizontal: 16, paddingVertical: 14 }} gap={0}>
    <Text type="l1" weight="semibold" color={theme.pallate.neutral['03']} margin={{ marginBottom: 6 }}>
      {group}
    </Text>
    {results.map((r, i) => (
      <ResultRow key={r.label} r={r} isLast={i === results.length - 1} />
    ))}
  </VStack>
);

// ── Screen ────────────────────────────────────────────────────────────────

const TextBenchmarkScreen = memo(({ navigation }: { navigation: any }) => {
  const { top } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const contentWidth = width - 32;

  const [results, setResults] = useState<Result[]>([]);
  const [running, setRunning] = useState(false);

  // ── Render profiler state ───────────────────────────────────────────────
  const [rnSeed, setRnSeed]         = useState(0);
  const [customSeed, setCustomSeed] = useState(0);
  const phaseRef    = useRef<'idle' | 'rn' | 'custom' | 'done'>('idle');
  const timings     = useRef<{ rn: number[]; custom: number[] }>({ rn: [], custom: [] });
  const [profiling, setProfiling]   = useState(false);
  const [profilerResult, setProfilerResult] = useState<{ rn: number; custom: number } | null>(null);

  const startProfiler = useCallback(() => {
    phaseRef.current  = 'rn';
    timings.current   = { rn: [], custom: [] };
    setProfilerResult(null);
    setProfiling(true);
    setRnSeed(s => s + 10_000);
  }, []);

  const onRenderRN = useCallback(
    (_id: string, phase: string, actualDuration: number) => {
      if (phaseRef.current !== 'rn' || phase !== 'mount') return;
      timings.current.rn.push(actualDuration);
      if (timings.current.rn.length < PROFILER_RUNS) {
        setTimeout(() => setRnSeed(s => s + 1), 32);
      } else {
        phaseRef.current = 'custom';
        setTimeout(() => setCustomSeed(s => s + 10_000), 32);
      }
    },
    [],
  );

  const onRenderCustom = useCallback(
    (_id: string, phase: string, actualDuration: number) => {
      if (phaseRef.current !== 'custom' || phase !== 'mount') return;
      timings.current.custom.push(actualDuration);
      if (timings.current.custom.length < PROFILER_RUNS) {
        setTimeout(() => setCustomSeed(s => s + 1), 32);
      } else {
        phaseRef.current = 'done';
        setProfiling(false);
        // Drop first 2 runs as JIT warmup, average the rest
        const avg = (arr: number[]) => {
          const warm = arr.slice(2);
          return warm.reduce((a, b) => a + b, 0) / warm.length;
        };
        setProfilerResult({
          rn:     avg(timings.current.rn),
          custom: avg(timings.current.custom),
        });
      }
    },
    [],
  );

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const runAll = useCallback(async () => {
    setRunning(true);
    setResults([]);

    const suite: Result[] = [];

    // ── Group 1: Current baseline (TextStyle helper) ──────────────────────
    suite.push(await bench(
      'Current (baseline)',
      'TextStyle() — b1 regular',
      () => TextStyle({ type: 'b1', weight: 'regular', color: '#000' }),
    ));
    suite.push(await bench(
      'Current (baseline)',
      'TextStyle() — h1 bold italic',
      () => TextStyle({ type: 'h1', weight: 'bold', italic: true }),
    ));
    suite.push(await bench(
      'Current (baseline)',
      'TextStyle() — s2 semibold + color',
      () => TextStyle({ type: 's2', weight: 'semibold', color: '#1a1a2e', align: 'center' }),
    ));

    // ── Group 2: Nitro — native measurement ───────────────────────────────
    let prepFn: any, layoutFn: any, layoutLinesFn: any,
        measureWidthFn: any, getFontMetricsFn: any,
        measureInkFn: any, truncateFn: any;

    let nitroAvailable = false;
    try {
      const prepMod     = await import('../../../core/text/prepare');
      const layoutMod   = await import('../../../core/text/layout');
      const inkMod      = await import('../../../core/text/ink-safe');
      const truncateMod = await import('../../../core/text/truncate');
      prepFn           = prepMod.prepare;
      layoutFn         = layoutMod.layout;
      layoutLinesFn    = layoutMod.layoutWithLines;
      measureWidthFn   = prepMod.measureNaturalWidth;
      getFontMetricsFn = inkMod.getFontMetrics;
      measureInkFn     = inkMod.measureInkBounds;
      truncateFn       = truncateMod.truncateText;
      // Probe to confirm native module is loaded
      prepFn(SHORT, 'regular', 16);
      nitroAvailable = true;
    } catch (e: any) {
      const errMsg = String(e?.message ?? e ?? 'unknown error');
      suite.push({ group: 'Nitro — measurement', label: 'prepare()', avgMs: 0, opsPerSec: 0, error: errMsg });
      suite.push({ group: 'Nitro — measurement', label: 'measureNaturalWidth()', avgMs: 0, opsPerSec: 0, error: errMsg });
      suite.push({ group: 'Nitro — measurement', label: 'getFontMetrics()', avgMs: 0, opsPerSec: 0, error: errMsg });
      suite.push({ group: 'Nitro — measurement', label: 'measureInkBounds()', avgMs: 0, opsPerSec: 0, error: errMsg });
    }

    if (nitroAvailable) {
      suite.push(await bench('Nitro — measurement', 'prepare() short — cold first / cache hit',
        () => prepFn(SHORT, 'regular', 16)));
      suite.push(await bench('Nitro — measurement', 'prepare() long — cache hit',
        () => prepFn(LONG, 'regular', 16)));
      suite.push(await bench('Nitro — measurement', 'measureNaturalWidth() long',
        () => measureWidthFn(LONG, 'regular', 16)));
      suite.push(await bench('Nitro — measurement', 'getFontMetrics() Poppins-Regular 16',
        () => getFontMetricsFn('regular', 16)));
      suite.push(await bench('Nitro — measurement', 'measureInkBounds() italic',
        () => measureInkFn(ITALIC_SAMPLE, 'regular', 16, true)));
    }

    // ── Group 3: Nitro — pure JS layout (no native calls) ─────────────────
    if (nitroAvailable) {
      const prepared = prepFn(LONG, 'regular', 16);
      suite.push(await bench('Nitro — JS layout (0 native calls)', 'layout() — lineCount + height',
        () => layoutFn(prepared, contentWidth)));
      suite.push(await bench('Nitro — JS layout (0 native calls)', 'layoutWithLines() — full line data',
        () => layoutLinesFn(prepared, contentWidth)));
    }

    // ── Group 4: Truncation ───────────────────────────────────────────────
    if (nitroAvailable) {
      suite.push(await bench('Truncation', 'truncateText() tail 1 line',
        () => truncateFn(LONG, 'regular', 16, contentWidth, 1, 'tail', '…')));
      suite.push(await bench('Truncation', 'truncateText() middle 1 line',
        () => truncateFn(LONG, 'regular', 16, contentWidth, 1, 'middle', '…')));
      suite.push(await bench('Truncation', 'truncateText() tail 3 lines',
        () => truncateFn(LONG, 'regular', 16, contentWidth, 3, 'tail', '…')));
    }

    setResults(suite);
    setRunning(false);
  }, [contentWidth]);

  // Group results for display
  const groupedResults = results.reduce<Record<string, Result[]>>((acc, r) => {
    (acc[r.group] ??= []).push(r);
    return acc;
  }, {});

  return (
    <VStack fill backgroundColor={theme.pallate.neutral['05']}>
      {/* Header */}
      <HStack
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingTop: top + theme.spacing.small,
          paddingBottom: theme.spacing.standard,
        }}
        items="center"
        justify="space-between"
      >
        <Pressable
          onPress={handleBack}
          padding={{ paddingVertical: theme.spacing.standard, paddingHorizontal: theme.spacing.medium }}
          items="center"
          gap={theme.spacing.small}
          borderRadius={999}
          style={styles.iconBtn}
          backgroundColor={theme.pallate.neutral['01']}
        >
          <IconChevronLeft size={24} color={theme.pallate.neutral['05']} />
          <Text type="b2" weight="semibold" color={theme.pallate.neutral['05']}>Back</Text>
        </Pressable>

        <Pressable
          onPress={running ? undefined : runAll}
          padding={{ paddingVertical: theme.spacing.standard, paddingHorizontal: theme.spacing.medium }}
          items="center"
          gap={theme.spacing.small}
          borderRadius={999}
          style={styles.iconBtn}
          backgroundColor={theme.pallate.neutral['01']}
        >
          {running ? (
            <ActivityIndicator size="small" color={theme.pallate.neutral['05']} />
          ) : (
            <>
              {results.length > 0
                ? <IconRefresh size={18} color={theme.pallate.neutral['05']} />
                : <IconPlayerPlay size={18} color={theme.pallate.neutral['05']} />}
              <Text type="b2" weight="semibold" color={theme.pallate.neutral['05']}>
                {results.length > 0 ? 'Re-run' : 'Benchmark'}
              </Text>
            </>
          )}
        </Pressable>
      </HStack>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <VStack padding={{ paddingHorizontal: theme.spacing.large }} gap={theme.spacing.large}>

          {/* Title */}
          <VStack gap={4}>
            <Text type="h3" weight="bold" color={theme.pallate.neutral['05']}>Text Debug</Text>
            <Text type="l1" color={theme.pallate.neutral['03']}>
              {ITERATIONS} iterations · Nitro JSI vs baseline TextStyle()
            </Text>
          </VStack>

          {/* Benchmark results */}
          {results.length === 0 && !running && (
            <VStack
              style={[styles.card, styles.emptyCard]}
              padding={{ paddingHorizontal: 16, paddingVertical: 28 }}
              items="center"
              gap={8}
            >
              <IconPlayerPlay size={30} color={theme.pallate.neutral['03']} />
              <Text type="b2" color={theme.pallate.neutral['03']} align="center">
                {'Press Benchmark to measure:\nTextStyle() vs Nitro JSI prepare/layout'}
              </Text>
            </VStack>
          )}

          {Object.entries(groupedResults).map(([group, rows]) => (
            <ResultGroup key={group} group={group} results={rows} />
          ))}

          {/* ── Render profiler ──────────────────────────────────────────── */}
          <SectionLabel>Render profiler</SectionLabel>

          {/*
            Hidden mount area — React.Profiler fires onRender even when the
            subtree has zero visible pixels, so we get pure JS reconciler cost.
          */}
          <View style={styles.hidden} pointerEvents="none">
            <React.Profiler id="rn-text-profiler" onRender={onRenderRN}>
              <RNTextBatch key={rnSeed} seed={rnSeed} />
            </React.Profiler>
            <React.Profiler id="custom-text-profiler" onRender={onRenderCustom}>
              <CustomTextBatch key={customSeed} seed={customSeed} />
            </React.Profiler>
          </View>

          <Card
            title={`React.Profiler · mount ×${PROFILER_RUNS}, ${PROFILER_ITEMS} items`}
            tag="JS commit time"
          >
            {!profilerResult && !profiling && (
              <Pressable
                onPress={startProfiler}
                padding={{ paddingVertical: theme.spacing.standard }}
                items="center"
                gap={theme.spacing.small}
                borderRadius={8}
                style={styles.profilerBtn}
              >
                <Text type="b2" weight="semibold" color={theme.pallate.neutral['03']}>
                  Run render profiler
                </Text>
              </Pressable>
            )}

            {profiling && (
              <HStack items="center" gap={10} padding={{ paddingVertical: theme.spacing.standard }}>
                <ActivityIndicator size="small" color={theme.pallate.neutral['03']} />
                <Text type="b2" color={theme.pallate.neutral['03']}>Profiling…</Text>
              </HStack>
            )}

            {profilerResult && (() => {
              const { rn, custom } = profilerResult;
              const overhead = custom - rn;
              const pct      = rn > 0 ? ((overhead / rn) * 100).toFixed(1) : '—';
              const faster   = overhead >= 0 ? `+${pct}%` : `${pct}%`;
              const rowColor = overhead > 2 ? '#e53e3e' : overhead > 0.5 ? '#d97706' : '#16a34a';
              return (
                <VStack gap={0}>
                  <Text type="l2" color={theme.pallate.neutral['03']} margin={{ marginBottom: 8 }}>
                    {`avg of ${PROFILER_RUNS - 2} warm runs · ${PROFILER_ITEMS} items/mount`}
                  </Text>
                  <HR />
                  <HStack justify="space-between" items="center" padding={{ paddingVertical: 9 }}>
                    <Text type="b2" color={theme.pallate.neutral['04']}>RN Text (flat style)</Text>
                    <Text type="b2" weight="bold" color={theme.pallate.neutral['05']}>
                      {rn.toFixed(2)} ms
                    </Text>
                  </HStack>
                  <HR />
                  <HStack justify="space-between" items="center" padding={{ paddingVertical: 9 }}>
                    <Text type="b2" color={theme.pallate.neutral['04']}>Custom Text (type="b2")</Text>
                    <Text type="b2" weight="bold" color={theme.pallate.neutral['05']}>
                      {custom.toFixed(2)} ms
                    </Text>
                  </HStack>
                  <HR />
                  <HStack justify="space-between" items="center" padding={{ paddingVertical: 9 }}>
                    <Text type="b2" color={theme.pallate.neutral['04']}>Overhead / item</Text>
                    <VStack items="flex-end">
                      <Text type="b2" weight="bold" style={{ color: rowColor }}>{faster}</Text>
                      <Text type="l2" color={theme.pallate.neutral['03']}>
                        {`${(Math.abs(overhead) / PROFILER_ITEMS * 1000).toFixed(1)} µs per item`}
                      </Text>
                    </VStack>
                  </HStack>
                  <HR />
                  <Pressable
                    onPress={startProfiler}
                    padding={{ paddingVertical: theme.spacing.standard }}
                    items="center"
                    borderRadius={8}
                    style={styles.profilerBtn}
                  >
                    <Text type="l1" weight="medium" color={theme.pallate.neutral['03']}>Re-run</Text>
                  </Pressable>
                </VStack>
              );
            })()}
          </Card>

          {/* ── Visual demos ─────────────────────────────────────────────── */}
          <SectionLabel>Component examples</SectionLabel>

          {/* Existing Text */}
          <Card title="Text" tag="current">
            <Text type="b2" color={theme.pallate.neutral['05']}>{LONG}</Text>
          </Card>

          <Card title="Text + numberOfLines={2}" tag="current">
            <Text type="b2" color={theme.pallate.neutral['05']} numberOfLines={2}>{LONG}</Text>
          </Card>

          {/* New components */}
          <Card title="SafeText" tag="new — line-by-line">
            <SafeText type="b2" color={theme.pallate.neutral['05']} maxWidth={contentWidth - 32}>
              {LONG}
            </SafeText>
          </Card>

          <Card title="TruncatedText  numberOfLines={2}  tail" tag="new">
            <TruncatedText
              type="b2"
              color={theme.pallate.neutral['05']}
              maxWidth={contentWidth - 32}
              numberOfLines={2}
              truncateMode="tail"
            >
              {LONG}
            </TruncatedText>
          </Card>

          <Card title="TruncatedText  numberOfLines={1}  middle" tag="new">
            <TruncatedText
              type="b2"
              color={theme.pallate.neutral['05']}
              maxWidth={contentWidth - 32}
              numberOfLines={1}
              truncateMode="middle"
            >
              {LONG}
            </TruncatedText>
          </Card>

          <Card title="InkSafeText — italic clipping fix" tag="new">
            <View style={styles.compareRow}>
              <VStack fill gap={4}>
                <Text type="l2" color={theme.pallate.neutral['03']}>Before (Text italic)</Text>
                <Text type="b2" italic color={theme.pallate.neutral['05']}>{ITALIC_SAMPLE}</Text>
              </VStack>
            </View>
            <View style={styles.compareRow}>
              <VStack fill gap={4}>
                <Text type="l2" color={theme.pallate.neutral['03']}>After (InkSafeText)</Text>
                <InkSafeText type="b2" italic color={theme.pallate.neutral['05']}>
                  {ITALIC_SAMPLE}
                </InkSafeText>
              </VStack>
            </View>
          </Card>

          <Card title="BalancedText — no lonely last word" tag="new">
            <View style={styles.compareRow}>
              <VStack fill gap={4}>
                <Text type="l2" color={theme.pallate.neutral['03']}>Text (unbalanced)</Text>
                <Text type="b2" color={theme.pallate.neutral['05']}>{BALANCED_SAMPLE}</Text>
              </VStack>
            </View>
            <View style={styles.compareRow}>
              <VStack fill gap={4}>
                <Text type="l2" color={theme.pallate.neutral['03']}>BalancedText</Text>
                <BalancedText type="b2" color={theme.pallate.neutral['05']} maxWidth={contentWidth - 32}>
                  {BALANCED_SAMPLE}
                </BalancedText>
              </VStack>
            </View>
          </Card>

          <Card title="PrettyText — distributed letter spacing" tag="new">
            <PrettyText type="b2" color={theme.pallate.neutral['05']} maxWidth={contentWidth - 32}>
              {BALANCED_SAMPLE}
            </PrettyText>
          </Card>

          {/* ── Type scale ──────────────────────────────────────────────── */}
          <SectionLabel>Type scale</SectionLabel>

          <Card title="All types · regular">
            {(['h1','h2','h3','s1','s2','s3','b1','b2','l1','l2','l3'] as const).map(t => (
              <Text key={t} type={t} color={theme.pallate.neutral['05']}>
                {t} — The quick brown fox
              </Text>
            ))}
          </Card>

          <Card title="All weights · b1">
            {(['light','regular','medium','semibold','bold','stylized'] as const).map(w => (
              <Text key={w} type="b1" weight={w} color={theme.pallate.neutral['05']}>
                {w} — The quick brown fox
              </Text>
            ))}
          </Card>

          <Card title="Italic variants · b1">
            {(['light','regular','medium','semibold','bold'] as const).map(w => (
              <Text key={w} type="b1" weight={w} italic color={theme.pallate.neutral['05']}>
                {w} italic — The quick brown fox
              </Text>
            ))}
          </Card>

        </VStack>
      </ScrollView>
    </VStack>
  );
});

TextBenchmarkScreen.displayName = 'TextBenchmarkScreen';
export default TextBenchmarkScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 64,
    paddingTop: theme.spacing.standard,
  },
  iconBtn: {
    ...theme.elevations[2],
  },
  card: {
    backgroundColor: theme.pallate.neutral['01'],
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyCard: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: theme.pallate.neutral['02'],
  },
  hr: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.pallate.neutral['02'],
    marginVertical: 2,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: theme.pallate.neutral['02'],
    borderRadius: 6,
  },
  sectionLabel: {
    letterSpacing: 0.8,
  },
  compareRow: {
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.pallate.neutral['02'],
  },
  hidden: {
    height: 0,
    overflow: 'hidden',
  },
  profilerBtn: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.pallate.neutral['02'],
  },
});
