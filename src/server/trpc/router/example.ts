import { z } from "zod";

import { router, publicProcedure } from "../trpc";

import { prisma } from "../../db/client";

export const exampleRouter = router({
  getPokemonById: publicProcedure
    .input(z.object({ id: z.number().nullish() }))
    .query(async ({ input }) => {
      if (input.id) {
        const pokemon = await prisma.pokemon.findFirst({
          where: { id: input.id },
        });
        if (!pokemon) throw new Error("Not existing");
        //return { name: pokemon.name, spriteUrl: pokemon.spriteUrl };
        return pokemon;
      }
    }),
  castVote: publicProcedure
    .input(z.object({ votedFor: z.number(), votedAgainst: z.number() }))
    .mutation(async ({ input }) => {
      const voteInDB = await prisma.vote.create({
        data: {
          votedForId: input.votedFor,
          votedAgainstId: input.votedAgainst,
        },
      });
      return { success: true, vote: voteInDB };
    }),
});
