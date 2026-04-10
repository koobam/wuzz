import type { ServiceFilter } from '../../types';

export type ServiceFilterPillsProps = {
  value: ServiceFilter;
  onChange: (filter: ServiceFilter) => void;
};
