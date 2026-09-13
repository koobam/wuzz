export type RateWuzzerSectionProps = {
  wuzzerId: string;
  wuzzerName: string;
  onSubmit: (wuzzerId: string, rating: number) => void;
};
