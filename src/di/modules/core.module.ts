import { ContainerModule } from "inversify";
import { TYPES } from "../../types";
import { IUserRepository } from "../../repositories/IUserRepository";
import { InMemoryUserRepository } from "../../repositories/InMemoryUserRepository";
import { IUserService } from "../../services/IUserService";
import { UserService } from "../../services/UserService";

export const coreModule = new ContainerModule((bind) => {
  bind<IUserRepository>(TYPES.UserRepository)
    .to(InMemoryUserRepository)
    .inSingletonScope();

  bind<IUserService>(TYPES.UserService)
    .to(UserService)
    .inSingletonScope();
});
