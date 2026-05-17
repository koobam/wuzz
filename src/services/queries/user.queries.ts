import { getMeInformation } from "@core/api/auth/user";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const userServicesQueries = createQueryKeys('userServices', {
  me: () => ({
    queryKey: ['me'],
    queryFn: () => getMeInformation(),
  }),
});
