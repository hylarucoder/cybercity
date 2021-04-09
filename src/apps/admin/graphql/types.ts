import { Field, Int, ObjectType } from "type-graphql";

@ObjectType({ description: "Object representing cooking recipe" })
export class TRecipe {
  @Field()
  title: string;

  @Field((type) => String, {
    nullable: true,
    deprecationReason: "Use `description` field instead",
  })
  get specification(): string | undefined {
    return this.description;
  }

  @Field({
    nullable: true,
    description: "The recipe description with preparation info",
  })
  description?: string;

  @Field((type) => [Int])
  ratings: number[];

  @Field()
  creationDate: Date;
}
