import {
  controller,
  httpGet,
  httpPost,
  request,
  requestParam,
  response
} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../types";
import { IUserService } from "../services/IUserService";
import { Request, Response } from "express";

@controller("/users")
export class UserController {
  constructor(
    @inject(TYPES.UserService) private readonly service: IUserService
  ) {}

  @httpGet("/")
  async list(@response() res: Response) {
    const users = await this.service.list();
    return res.json(users);
  }

  @httpGet("/:id")
  async get(@requestParam("id") id: string, @response() res: Response) {
    const user = await this.service.get(id);
    return res.json(user);
  }

  @httpPost("/")
  async create(@request() req: Request, @response() res: Response) {
    const { name, email } = req.body ?? {};
    const user = await this.service.create({ name, email });
    return res.status(201).json(user);
  }
}
