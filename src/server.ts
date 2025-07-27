import { buildApp } from "./app";
import { createContainer } from "./di/createContainer";

const container = createContainer();
const app = buildApp(container);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`HTTP server listening on http://localhost:${port}/api`);
});
