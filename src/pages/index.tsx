import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getVotingOptions } from "../utils/getRandomPokemon";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
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

  const voteForRoundestFirst = (id: number) => {
    // TODO: Fire mutation to persist changes
    //
    setFirst(getVotingOptions(id)[0]);
  };

  const voteForRoundestSecond = (id: number) => {
    // TODO: Fire mutation to persist changes
    //
    setSecond(getVotingOptions(id)[1]);
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="text-center text-2xl">Which Pokemon is Roundest?</div>
        <div className="mt-8 flex max-w-2xl items-center justify-between rounded border p-8">
          <div className="flex h-64 w-64 flex-col justify-center ">
            <img
              src={firstPokemon.data?.sprites.front_default}
              alt={firstPokemon.data?.name}
              className="w-full"
            />
            <div className="mt-[-2rem] mb-2 text-center text-2xl capitalize">
              {firstPokemon.data?.name}
            </div>
            <button
              className="mx-auto inline-flex items-center rounded border px-4"
              onClick={() => voteForRoundestFirst(first)}
            >
              Roundest
            </button>
          </div>
          <div className="p-8">VS</div>
          <div className="flex h-64 w-64 flex-col justify-center ">
            <img
              src={seconfPokemon.data?.sprites.front_default}
              alt={firstPokemon.data?.name}
              className="w-full"
            />
            <div className="mt-[-2rem] mb-2 text-center text-2xl capitalize">
              {seconfPokemon.data?.name}
            </div>

            <button
              className="mx-auto inline-flex items-center rounded border px-4"
              onClick={() => voteForRoundestSecond(second)}
            >
              Roundest
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
