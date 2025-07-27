# Inversify Testing & DI Cheatsheet

## Container Fundamentals
- Create: `new Container({ defaultScope: "Singleton" })`
- Register: `bind(TYPES.X).to(Impl).inSingletonScope()`
- Resolve: `get(TYPES.X)`
- Override: `rebind(TYPES.X).to(Fake)`

## Typical File Layout
```
src/
  di/
    modules/core.module.ts
    createContainer.ts
  app.ts          # buildApp(container)
  server.ts       # entrypoint (listen)
test/
  unit/           # service tests
  e2e/            # http tests with Supertest
```

## Test Patterns
**A. Fresh container per test (preferred)**
```ts
const c = createContainer((c) => {
  c.rebind(TYPES.Repo).to(FakeRepo);
});
const app = buildApp(c);
```

**B. Snapshot/restore global container (quick & dirty)**
```ts
beforeEach(() => container.snapshot());
afterEach(() => container.restore());
```

**C. Env-based modules**
```ts
const c = new Container();
c.load(coreModule, testInfraModule);
```

## Lifetimes
- Singleton: default for stateless components.
- Request: use for DB sessions and per-request context.
- Transient: use rarely; prefer stateless functions otherwise.

## Common Errors
- Missing `reflect-metadata` import.
- Decorator metadata not emitted (tsconfig flags).
- Controllers not imported (no routes).
- Circular dependencies between service/repository.
