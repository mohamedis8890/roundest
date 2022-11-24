import { z } from "zod";

import { router, publicProcedure } from "../trpc";

import { PokemonClient } from "pokenode-ts";

import { prisma } from "../../db/client";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  getPokemonById: publicProcedure
    .input(z.object({ id: z.number().nullish() }))
    .query(async ({ input }) => {
      let pokemon;
      if (input.id) {
        const pokeApiConnection = new PokemonClient();
        pokemon = await pokeApiConnection.getPokemonById(input.id);
      }
      return { name: pokemon?.name, sprites: pokemon?.sprites };
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
