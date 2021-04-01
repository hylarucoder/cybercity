import {Module} from "@nestjs/common";
import {AppController} from "./controller";
import {Service} from "./service";
import {GraphQLModule} from "@nestjs/graphql";
import {RecipesResolver} from "./resolvers";

@Module({
    imports: [GraphQLModule.forRootAsync({
        useFactory: () => ({
            path: "/api/user/graphql",
            autoSchemaFile: 'schema.gql',
        })
    })],
    controllers: [AppController],
    providers: [Service, RecipesResolver],
})
export class AppModule {
}
