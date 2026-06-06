import { TPaginationMeta } from '@/types';

export type TSample = {
  id: string;
  name: string;
};

export type TGetSamplesResponse = TPaginationMeta & {
  samples: TSample[];
};
