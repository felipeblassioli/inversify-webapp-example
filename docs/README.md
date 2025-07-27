# Testing with Inversify Containers (Docs Only)

This documentation explains the **Dependency Injection (DI) approach** and the **testing strategy** used with InversifyJS for a typical web application structured as **Controller → Service → Repository**.

It is designed to be copied into `docs/testing-with-inversify-containers/` of any TypeScript/Node project that uses Inversify (with or without `inversify-express-utils`).

---

## 1) DI Approach

### 1.1 Composition Root
Bind your interfaces/tokens to implementations in one place (the *composition root*), preferably via **Container Modules** and a **factory** function:

- `core.module` holds feature/service/repository bindings.
- `createContainer(customize?)` returns a new `Container` and optionally applies overrides (useful in tests).

Rationale:
- Reproducible containers (fresh per test, per CLI) without global state.
- Easy to add `infra`/`feature` modules and compose per environment (prod/test).

### 1.2 Tokens & Decorators
- Use **Symbols** as tokens (e.g., `TYPES.UserService`).
- Decorate classes with `@injectable()` and constructor params with `@inject(TYPES.X)`.
- Ensure `experimentalDecorators` and `emitDecoratorMetadata` are enabled in `tsconfig.json` and `reflect-metadata` is imported *before* any decorated class is loaded.

### 1.3 Lifetimes (Scopes)
- **Singleton**: one instance per container; good for stateless services and in‑memory fakes.
- **Request**: one instance per logical resolution request; recommended for DB sessions or per‑request context.
- **Transient**: new instance every resolution; use sparingly.

Guideline:
- Default to **Singleton** for pure logic.
- Use **Request** for resources that must not leak across requests (sessions, transactions).

### 1.4 HTTP Integration
Keep a pure function `buildApp(container)` that returns an Express app; put the `listen()` call in a small `server.ts`. This separation lets tests supply their own container.

---

## 2) Testing Strategy (Chosen + Alternatives)

### 2.1 Chosen: **Fresh Container per Test** (Pattern A)
- Build a new container in each test (or test suite) via `createContainer(overrides?)`.
- For HTTP tests, do `buildApp(createContainer(...))` and exercise routes with Supertest.
- For unit tests that don’t need the container, you can instantiate services with stub/fake repos directly (pure DI).

**Pros**: parallel-safe, explicit, no cross-test leakage.  
**Cons**: a bit more boilerplate than a single global container.

### 2.2 Alternatives
- **Pattern B — snapshot/restore** on a global container: quick but brittle for parallel runs.
- **Pattern C — env-based modules**: compose `prodInfra` vs `testInfra` modules; explicit but more files.

---

## 3) Practical Recipes

**Override a binding in a test**
```ts
const app = buildApp(createContainer((c) => {
  c.rebind(TYPES.UserRepository).to(FakeUserRepository);
}));
```

**Request-scoped repository for DB sessions**
```ts
bind<IUserRepository>(TYPES.UserRepository)
  .to(PrismaUserRepository)
  .inRequestScope();
```

**Pure DI unit test (bypass container)**
```ts
const service = new UserService(new StubRepo());
```

---

## 4) Pitfalls Checklist

- [ ] `"experimentalDecorators": true` and `"emitDecoratorMetadata": true` in `tsconfig.json`.
- [ ] `import "reflect-metadata";` before importing decorated classes (app + tests).
- [ ] Controllers imported exactly once before server build (if using `inversify-express-utils`).
- [ ] No circular deps; break with factories or interfaces where needed.
- [ ] Avoid a process‑level singleton container in tests.

---

## 5) Glossary

- **Container**: registry + factory that resolves tokens to implementations with lifetimes.
- **Binding**: recipe that maps a token to an implementation (`to`, `toConstantValue`, `toDynamicValue`, etc.).
- **Scope**: lifetime of instances—`Singleton`, `Request`, `Transient`.
- **ContainerModule**: a bundle of bindings that can be loaded into a container.
- **Composition Root**: the only place where modules are composed and bindings are registered.
