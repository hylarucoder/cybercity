import { Args, Query, Resolver, Subscription } from "@nestjs/graphql";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Recipe {
  @Field((type) => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  creationDate: Date;

  @Field((type) => [String])
  ingredients: string[];
}

@Resolver((of) => Recipe)
export class RecipesResolver {
  @Query((returns) => Recipe)
  async recipe(@Args("id") id: string): Promise<Recipe> {
    return null;
  }

  @Query((returns) => [Recipe])
  recipes(): any[] {
    return [];
  }
}
