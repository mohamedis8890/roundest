const MAX_DEX_ID = 5;

export const getRandomPokemon: (notThisOne?: number) => number = (
  notThisOne
) => {
  const pokedexNumber = Math.floor(Math.random() * (MAX_DEX_ID - 1));

  if (pokedexNumber !== notThisOne) return pokedexNumber;

  return getRandomPokemon(notThisOne);
};

export const getVotingOptions = () => {
  const firstId = getRandomPokemon();
  const secondId = getRandomPokemon(firstId);

  return [firstId, secondId];
};
