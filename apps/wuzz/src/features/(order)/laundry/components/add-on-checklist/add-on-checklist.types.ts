import type { ChecklistOption } from '../../types';
import type { AddOnSelectionMode } from '../../utils';

export type AddOnChecklistProps = {
  /** Options to show (e.g. ADD_ON_OPTIONS for kiloan, SATUAN_OPTIONS for satuan). Default: ADD_ON_OPTIONS */
  options?: ChecklistOption[];
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Judul bagian (default: "Layanan Tambahan") */
  title?: string;
  /** Label opsional (default: "Opsional") */
  optionalLabel?: string;
  /** Hint di bawah judul (default: dari selectionMode) */
  selectionHint?: string;
  /** "multiple" = checklist bisa banyak, "single" = pilih salah satu (paid) */
  selectionMode?: AddOnSelectionMode;
  /** When false, user cannot deselect all (at least one required). Default selected = options[0]. */
  canOptOut?: boolean;
};
