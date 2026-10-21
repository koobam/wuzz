/**
 * DUMMY DATA. There is no Wuzzer backend yet, so this stands in for it while the
 * "Cari Wuzzer Terdekat" section is designed. It is only wired up in development
 * builds (see the Home page): release builds show the honest empty state.
 * Delete this file when the real data exists.
 */
import type { Coordinates } from '@hooks/utils/useCurrentLocation';
import type { Wuzzer } from '../components/wuzzer-nearby/wuzzer-nearby.types';

type DummyWuzzer = Omit<Wuzzer, 'distanceKm' | 'coords'> & {
  /** Offset from the customer in degrees (0.001 is about 110 m). */
  dLat: number;
  dLong: number;
};

const DUMMY: DummyWuzzer[] = [
  {
    id: 'dummy-1',
    name: 'Budi Santoso',
    rating: 4.9,
    photoUri: 'https://i.pravatar.cc/200?img=12',
    dLat: 0.0032,
    dLong: 0.0021,
  },
  {
    id: 'dummy-2',
    name: 'Rina Marlina',
    rating: 4.8,
    photoUri: 'https://i.pravatar.cc/200?img=47',
    dLat: -0.0041,
    dLong: 0.0034,
  },
  {
    id: 'dummy-3',
    name: 'Agus Pratama',
    rating: 4.7,
    photoUri: 'https://i.pravatar.cc/200?img=33',
    dLat: 0.0058,
    dLong: -0.0042,
  },
  {
    id: 'dummy-4',
    name: 'Dewi Lestari',
    rating: 4.9,
    photoUri: 'https://i.pravatar.cc/200?img=45',
    dLat: -0.0067,
    dLong: -0.0029,
  },
  {
    id: 'dummy-5',
    name: 'Eko Wahyudi',
    rating: 4.6,
    photoUri: 'https://i.pravatar.cc/200?img=15',
    dLat: 0.0079,
    dLong: 0.0061,
  },
];

const EARTH_KM = 6371.0088;
const toRad = (deg: number): number => (deg * Math.PI) / 180;

const distanceKm = (a: Coordinates, b: Coordinates): number => {
  const dLat = toRad(b.lat - a.lat);
  const dLong = toRad(b.long - a.long);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLong / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.sqrt(h));
};

/** A few made-up Wuzzers scattered within roughly a kilometre of `around`, nearest first. */
export const dummyWuzzersNear = (around: Coordinates): Wuzzer[] =>
  DUMMY.map(({ dLat, dLong, ...wuzzer }) => {
    const coords = { lat: around.lat + dLat, long: around.long + dLong };
    return { ...wuzzer, coords, distanceKm: distanceKm(around, coords) };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
