import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticProps } from "next";
import Image from "next/image";
import React from "react";
import { prisma } from "../server/db/client";

type PokemonQueryResult = inferAsyncReturnType<typeof getOrderedPokemon>;

const ResultsPage: React.FC<{
  pokemon: PokemonQueryResult;
}> = (props) => {
  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <h2 className="py-5 text-center text-2xl">Results</h2>
      {props.pokemon.map((p) => (
        <PokemonListing key={p.id} pokemon={p} />
      ))}
    </div>
  );
};

const getVotePercentage = (pokemon: PokemonQueryResult[number]) => {
  const { voteFor, voteAgainst } = pokemon._count;
  const percentage =
    voteAgainst > 0 || voteFor > 0
      ? (voteFor / (voteFor + voteAgainst)) * 100
      : 0;
  return Math.floor(percentage);
};

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = ({
  pokemon,
}) => {
  return (
    <div className="flex items-center justify-between border-b pb-2">
      <div className="flex max-w-2xl items-center">
        <Image
          src={pokemon.spriteUrl}
          alt={pokemon.name}
          width={64}
          height={64}
        />
        <div className="capitalize">{pokemon.name}</div>
      </div>
      <div className="w-2xl">
        <div>For {pokemon._count.voteFor}</div>
        <div>Against {pokemon._count.voteAgainst}</div>
      </div>

      <div className="flex items-center pr-2">
        <div>{`${getVotePercentage(pokemon)} %`}</div>
      </div>
    </div>
  );
};

const getOrderedPokemon = async () => {
  const pokemonOrdered = await prisma.pokemon.findMany({
    orderBy: { voteFor: { _count: "desc" } },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: { voteFor: true, voteAgainst: true },
      },
    },
  });

  return pokemonOrdered;
};

export const getStaticProps: GetStaticProps = async () => {
  const pokemonOrdered = await getOrderedPokemon();

  //console.log("Show me the counts", pokemonOrdered);

  return {
    props: { pokemon: pokemonOrdered },
    revalidate: 60,
  };
};

export default ResultsPage;
