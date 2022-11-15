const MAX_DEX_ID = 493;

export const getRandomPokemon: (notThisOne?: number) => number = (
  notThisOne
) => {
  const pokedexNumber = Math.floor(Math.random() * MAX_DEX_ID);

  if (pokedexNumber !== notThisOne) return pokedexNumber;

  return getRandomPokemon(notThisOne);
};

export const getVotingOptions = () => {
  const firstId = getRandomPokemon();
  const secondId = getRandomPokemon(firstId);

  return [firstId, secondId];
};
