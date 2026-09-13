import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { ShareProfileTarget } from '../../hooks/useShareProfile';

export type ShareProfileOption = {
  id: ShareProfileTarget;
  label: string;
  icon: React.ReactNode;
};

export type ShareProfileModalProps = {
  modalRef: React.RefObject<BottomSheetModal | null>;
  /** URI of the captured profile card image to show as preview (e.g. from captureRef). */
  previewImageUri: string | null;
  onSelectTarget: (target: ShareProfileTarget) => void;
};
