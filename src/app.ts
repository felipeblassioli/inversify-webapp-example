import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { InversifyExpressServer } from "inversify-express-utils";
import { Container } from "inversify";

// Import controllers so decorators are evaluated and routes registered
import "./controllers/UserController";

export function buildApp(container: Container) {
  const server = new InversifyExpressServer(container, null, { rootPath: "/api" });

  server.setConfig((app) => {
    app.use(bodyParser.json());
  });

  server.setErrorConfig((app) => {
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err?.status ?? 500;
      res.status(status).json({ error: err?.message ?? "Internal Server Error" });
    });
  });

  return server.build();
}
