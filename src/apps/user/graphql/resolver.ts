import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { AddRecipeInput } from "./input";
import { Recipe } from "./object_type";

@Resolver()
export class RootResolver {
  @Query((returns) => Recipe, { nullable: true })
  async recipe(@Arg("title") title: string): Promise<Recipe> {
    return {
      specification: ",",
      description: "Desc 1",
      title: title,
      ratings: [0, 3, 1],
      creationDate: new Date("2018-04-11"),
    };
  }

  @Mutation()
  addRecipe(
    @Arg("data") newRecipeData: AddRecipeInput,
    @Ctx() ctx: any,
  ): Recipe {
    return {
      specification: ",",
      description: "Desc 1",
      title: "Recipe 1",
      ratings: [0, 3, 1],
      creationDate: new Date("2018-04-11"),
    };
  }
}
