import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import { getVotingOptions } from "../utils/getRandomPokemon";
import { type inferQueryResponse, trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [ids, setIds] = useState(() => getVotingOptions());

  const [first, second] = ids;

  const firstPokemon = trpc.example.getPokemonById.useQuery({ id: first });
  const secondPokemon = trpc.example.getPokemonById.useQuery({ id: second });

  const voteMutation = trpc.example.castVote.useMutation();

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }
    setIds(getVotingOptions());
  };

  const loaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data;

  return (
    <>
      <Head>
        <title>RoundestMon</title>
        <meta name="description" content="Vote for the Roundest Pokemon" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative flex h-screen w-screen flex-col items-center justify-center">
        <div className="text-center text-2xl">Which Pokemon is Roundest?</div>
        {loaded && (
          <div className="animate-fade-in mt-8 flex max-w-2xl items-center justify-between rounded border p-8">
            <>
              <PokemonListing
                pokemon={firstPokemon.data}
                vote={() => voteForRoundest(first)}
                disabled={voteMutation.isLoading}
              />
              <div className="p-8">VS</div>
              <PokemonListing
                pokemon={secondPokemon.data}
                vote={() => voteForRoundest(second)}
                disabled={voteMutation.isLoading}
              />
            </>
          </div>
        )}
        {!loaded && (
          <Image src="./wind-toy.svg" width={365} height={365} alt="loading" />
        )}
        <div className="absolute bottom-0 w-full pb-2 text-center text-xl">
          <a href="https://github.com/mohamedis8890/roundest">Github Repo</a>
        </div>
      </div>
    </>
  );
};

export default Home;

type PokemonFromServer = inferQueryResponse<"getPokemonById">;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
  disabled: boolean;
}> = ({ pokemon, vote, disabled }) => {
  return (
    <div
      className={`flex flex-col justify-center transition-opacity ${
        disabled && "opacity-0"
      }`}
    >
      <Image
        src={`${pokemon?.spriteUrl}`}
        alt="Pokemon"
        layout="fixed"
        width={256}
        height={256}
      />
      <div className="mt-[-2rem] mb-2 text-center text-2xl capitalize">
        {pokemon?.name}
      </div>
      <button
        className="mx-auto inline-flex items-center rounded border px-4 py-1"
        onClick={() => vote()}
      >
        Roundest
      </button>
    </div>
  );
};
