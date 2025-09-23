import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../../components/Loading/Spinner";
import { useGetPokemons } from "../../services/pokemons";
import { useGlobalFilterStore } from "../../common/store/globalFiltersStore";

const Home = () => {
    const queryClient = useQueryClient();
    const { search, setSearch } = useGlobalFilterStore();
    const { data, isLoading, error } = useGetPokemons();
    const { results } = data || [];

    const changePokemonName = () => {
      queryClient.setQueryData(["pokemons"], (oldData) => {
        return {
          ...oldData,
          results: oldData.results.map((pokemon) => ({ ...pokemon, name: "Nuevo Nombre" })),
        };
      });
    }
    
    console.log(data);
    if (isLoading) return <Spinner tip="Cargando Pokemones"/>;
    return (
        <div>
            <h1>Home</h1>
            {error && <p>Error: {error.message}</p>}
            {results && results.map((pokemon) => (
                <div key={pokemon.name}>
                    <h2>{pokemon.name}</h2>
                </div>
            ))}
            <button onClick={changePokemonName}>Cambiar Nombre</button>
            <input className="p-2 rounded-md border-2 border-gray-300" type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
    );
};

export default Home;
