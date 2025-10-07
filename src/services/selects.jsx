import { useQuery } from "@tanstack/react-query";
import { axiosGet } from "../apis/calls";

export const useSelectOptions = (field) => {
    const { data: options = [], isLoading } = useQuery({
        queryKey: ["select-options", field.api_ref],
        queryFn: () => field.api_ref ? axiosGet(`selects/${field.api_ref}`) : Promise.resolve(field.options),
        enabled: !!field.api_ref,
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    });

    return { options, isLoading };
}


