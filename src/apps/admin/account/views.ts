import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType, PubSub, PubSubEngine,
  Query,
  registerEnumType,
  Resolver,
  Subscription,
} from "type-graphql";
import { Max, MaxLength, Min } from "class-validator";
import { TDate, TDateTime } from "@/graphql/scalar";

enum EnumLoginType {
  PASSWORD,
  CODE,
}

registerEnumType(EnumLoginType, {
  name: "EnumLoginType_LUFC",
});

@InputType()
export class InputLogin {
  @Field()
  @MaxLength(30)
  login: string;

  @Field(() => EnumLoginType)
  type: EnumLoginType;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  code?: string;
}

@InputType()
export class InputSendNotification {
  @Field()
  @MaxLength(400)
  content: string;
}

@ObjectType()
export class TLogin {
  @Field()
  @Min(1)
  id: string;
  @Field()
  token: string;
}

@ObjectType()
export class TProfile {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field(() => TDateTime)
  createdAt: Date;

  @Field(() => TDate)
  birthday: Date;

  @Field()
  token?: string;
}

@ObjectType()
export class TNotification {
  @Field()
  id: string;
  @Field()
  content: string;
  @Field(() => TDateTime)
  createdAt: Date;
}

@Resolver()
export class ViewAccount {
  @Query(() => TProfile)
  async profile(): Promise<TProfile> {
    return {
      id: "id",
      name: "name",
      createdAt: new Date("2018-04-11"),
      birthday: new Date("2018-04-11"),
      token: "asdasd",
    };
  }

  @Mutation()
  login(@Arg("data") data: InputLogin, @Ctx() ctx: any): TProfile {
    return {
      id: "id",
      name: "name",
      birthday: new Date("2018-04-11"),
      createdAt: new Date("2018-04-11"),
    };
  }

  @Mutation()
  async sendNotification(@Arg("data") data: InputSendNotification, @PubSub() pubSub: PubSubEngine) {
    await pubSub.publish({
      topic: "su",
      payload: data as any,
    });
  }

  @Subscription({
    topics: ["NOTIFICATIONS"],
    filter: ({ payload, args }) => args.priorities.includes(payload.priority),
  })
  newNotification(): TNotification {
    // ...
    return {
      id: "1",
      content: "new message",
      createdAt: new Date(),
    };
  }
}
