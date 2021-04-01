import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Render, Sse,
} from "@nestjs/common";
import { Service } from "./service";
import { tmpls } from "../../service/poster";
import {interval, Observable} from "rxjs";
import {map} from "rxjs/operators";

@Controller("api/user")
export class AppController {
  constructor(private readonly appService: Service) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Sse('/sse')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }
}
