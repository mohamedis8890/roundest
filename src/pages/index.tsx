import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getVotingOptions } from "../utils/getRandomPokemon";
import { type inferQueryResponse, trpc } from "../utils/trpc";

const Home: NextPage = () => {
  /*
  const [first, setFirst] = useState<number | undefined>();
  const [second, setSecond] = useState<number | undefined>();
  const firstPokemon = trpc.example.getPokemonById.useQuery({ id: first });
  const seconfPokemon = trpc.example.getPokemonById.useQuery({ id: second });

  useEffect(() => {
    const [firstP, secondP] = getVotingOptions();

    setFirst(firstP);
    setSecond(secondP);
  }, []);

  if (firstPokemon.isLoading || seconfPokemon.isLoading) return null;

  const voteForRoundestFirst = (id?: number) => {
    // TODO: Fire mutation to persist changes
    //
    setFirst(getVotingOptions(id)[0]);
  };

  const voteForRoundestSecond = (id?: number) => {
    // TODO: Fire mutation to persist changes
    //
    setSecond(getVotingOptions(id)[1]);
  };
  */

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

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative flex h-screen w-screen flex-col items-center justify-center">
        <div className="text-center text-2xl">Which Pokemon is Roundest?</div>
        <div className="mt-8 flex max-w-2xl items-center justify-between rounded border p-8">
          {!firstPokemon.isLoading &&
            firstPokemon.data &&
            !secondPokemon.isLoading &&
            secondPokemon.data && (
              <>
                <PokemonListing
                  pokemon={firstPokemon.data}
                  vote={() => voteForRoundest(first)}
                />
                <div className="p-8">VS</div>
                <PokemonListing
                  pokemon={secondPokemon.data}
                  vote={() => voteForRoundest(second)}
                />
              </>
            )}
        </div>
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
}> = ({ pokemon, vote }) => {
  return (
    <div className="flex flex-col justify-center">
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
