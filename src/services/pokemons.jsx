import { useQuery } from "@tanstack/react-query";
import { axiosGet } from "../apis/calls";


export const useGetPokemons = () => {
  return useQuery({
    queryKey: ["pokemons"],
    queryFn: () => axiosGet("/pokemon"),
  });
};