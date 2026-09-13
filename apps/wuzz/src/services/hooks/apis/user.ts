import { userServicesQueries } from "@services/queries/user.queries";
import { useQuery } from "@tanstack/react-query";

export const useFetchMe = () => {
    return useQuery({
        ...userServicesQueries.me(),
        select: (data) => data?.data ?? null,
        gcTime: 0,
    });
};