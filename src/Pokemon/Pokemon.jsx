import { useEffect, useState } from "react";
import { PokemonCard } from "../PokemonCard/PokemonCard";
import { useDebounce } from "../utils.js/debounce"; // Import debounce hook
import "./Pokemon.css";

export const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const API = "https://pokeapi.co/api/v2/pokemon?limit=124";

  // Fetch Pokémon data from API
  const fetchPokemon = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      // Fetch detailed data for each Pokémon
      const detailedPokemonData = data.results.map(async (curPokemon) => {
        const res = await fetch(curPokemon.url);
        const data = await res.json();
        return data;
      });

      const detailedResponses = await Promise.all(detailedPokemonData);
      setPokemon(detailedResponses);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const debouncedSearch = useDebounce(search, 1000);

  const searchData = pokemon.filter((curPokemon) =>
    curPokemon.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <>
      <section className="container">
        <header>
          <h1> GoPoké</h1>
        </header>
        <div className="pokemon-search">
          <input
            type="text"
            placeholder="Search Pokémon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="cards-container">
          <ul className="cards">
            {loading ? (
              <h1>Loading Pokemons...</h1>
            ) : error ? (
              <h1>{error.message}</h1>
            ) : 
                searchData.length > 0 ? 
              searchData.map((curPokemon) => (
                <PokemonCard key={curPokemon.id} pokemonData={curPokemon} />
              )) : (
                     <p className="pokemon-message">
                    No Pokemon found
              </p>
             )
            }
          </ul>
        </div>
      </section>
    </>
  );
};
