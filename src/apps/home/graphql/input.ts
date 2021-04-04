import { Field, InputType } from "type-graphql";

@InputType()
export class AddRecipeInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}
