import { Field, InputType } from "type-graphql";

@InputType()
export class AddRecipeInput {
  @Field((type) => String)
  title: string;

  @Field({ nullable: true })
  description?: string;
}
