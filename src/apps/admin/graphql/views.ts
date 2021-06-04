import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { AddRecipeInput } from "./input";
import { TRecipe } from "./types";

@Resolver()
export class RootResolver {
  @Query((returns) => TRecipe, { nullable: true })
  async recipe(@Arg("title", () => String) title: string): Promise<TRecipe> {
    return {
      specification: ",",
      description: "Desc 1",
      title: title,
      ratings: [0, 3, 1],
      creationDate: new Date("2018-04-11"),
    };
  }

  @Mutation((type) => TRecipe)
  addRecipe(@Arg("data", () => AddRecipeInput) newRecipeData: AddRecipeInput, @Ctx() ctx: any): TRecipe {
    return {
      specification: ",",
      description: "Desc 1",
      title: "Recipe 1",
      ratings: [0, 3, 1],
      creationDate: new Date("2018-04-11"),
    };
  }
}

@Resolver()
export class RootResolver2 {
  @Query((returns) => TRecipe, { nullable: true })
  async recipe2(@Arg("title", () => String) title: string): Promise<TRecipe> {
    return {
      specification: ",",
      description: "Desc 1",
      title: title,
      ratings: [0, 3, 1],
      creationDate: new Date("2018-04-11"),
    };
  }

  @Mutation(() => TRecipe)
  addRecipe2(@Arg("data", () => AddRecipeInput) newRecipeData: AddRecipeInput, @Ctx() ctx: any): TRecipe {
    return {
      specification: ",",
      description: "Desc 1",
      title: "Recipe 1",
      ratings: [0, 3, 1],
      creationDate: new Date("2018-04-11"),
    };
  }
}
