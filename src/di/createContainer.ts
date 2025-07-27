import { Container } from "inversify";
import { coreModule } from "./modules/core.module";

export function createContainer(customize?: (c: Container) => void) {
  const c = new Container({ defaultScope: "Singleton" });
  c.load(coreModule);
  if (customize) customize(c);
  return c;
}
