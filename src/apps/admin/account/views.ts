import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Publisher,
  PubSub,
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

  @Field(() => TDateTime)
  createdAt: Date;
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

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  createdBy?: string;

  @Field({ nullable: true })
  email?: string;

  @Field(() => TDateTime)
  createdAt: Date;

  @Field(() => TDate)
  birthday: Date;

  @Field({nullable: true})
  token?: string;
}

enum EnumSexType {
  MAN,
  WOMAN,
  SECRET,
}

registerEnumType(EnumSexType, {
  name: "EnumSexType",
});

@ObjectType()
export class TNotification {
  @Field()
  id: string;
  @Field()
  content: string;
  @Field(() => TDateTime)
  createdAt: Date;
}

type NotificationPayload = {
  id: string;
  content: string;
  createdAt: Date;
};

@ObjectType()
export class THealthCheck {
  @Field()
  ok: boolean;
}

@Resolver()
export class ViewAccount {
  @Query(() => THealthCheck)
  async healthCheck(): Promise<THealthCheck> {
    return {
      ok: true,
    };
  }

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
      token: "1",
    };
  }

  @Mutation(() => Boolean)
  async sendNotification(
    @Arg("data") data: InputSendNotification,
    @PubSub("NOTIFICATIONS") publish: Publisher<NotificationPayload>,
  ) {
    await publish({
      id: "id",
      content: data.content,
      createdAt: data.createdAt,
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
