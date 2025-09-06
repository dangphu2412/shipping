# `@dnp2412/shipping-protos`

This repo contains the protobuf definitions and generated TypeScript types used across services.
We use **Buf** for schema management and **Changesets** for automated versioning + publishing to npm.

---

### Create a Changeset
We use [Changesets](https://github.com/changesets/changesets) to track version bumps.
After you develop proto files
Run:

```bash
pnpm changeset
```

This will ask whether the change is `patch`, `minor`, or `major`, and create a new file under `.changeset/`.

Commit this file along with your code changes.

---

### 2. Open a PR

* Push your branch
* Open a pull request against `main`
* ~~CI will validate build + lint~~

When the PR is merged, the release pipeline takes over.

---

## 📦 Release Workflow (CI/CD)

On every merge to `main`, GitHub Actions runs the following:

1. **Checkout & Setup**

    * Install Node.js + pnpm
    * Install Buf

2. **Generate Protos**

   ```bash
   buf generate
   ```

3. **Build**

   ```bash
   pnpm run build
   ```

4. **Version Bump**

   ```bash
   pnpm changeset version
   ```

    * Updates `package.json` version
    * Updates changelog
    * Commits these changes back to `main`

5. **Publish to npm**

   ```bash
   pnpm changeset publish
   ```

    * Publishes only the `dist/` + `proto/` folders (controlled via `files` in `package.json`)
    * Publishes under the scope `@dnp2412`

---

## 🔑 Authentication

* CI uses an **npm automation token** stored as `NPM_TOKEN` in GitHub Actions secrets.
* Local developers should log in to npm at least once:

  ```bash
  npm login
  ```

---

## 🛠 Useful Commands

* **Preview what will be published**

  ```bash
  npm pack
  ```

  This creates a `.tgz` package locally to inspect contents.

* **Manually publish (if needed)**

  ```bash
  pnpm changeset publish
  ```

---

## 📂 Package Contents

The published npm package includes:

* `dist/` → generated TypeScript stubs
* `proto/` → raw protobuf definitions
* `package.json`, `README.md`, `CHANGELOG.md`

Everything else (tests, configs, etc.) is excluded.

---

## ✅ Summary Flow

1. Dev edits `proto/`
2. Run `buf generate && pnpm build`
3. Run `pnpm changeset` and commit
4. Open PR → merge
5. GitHub Actions auto-bumps version + publishes to npm

---

⚡️ Done. Now anyone consuming your package can just:

```bash
pnpm add @dnp2412/shipping-protos
```

---

Do you want me to also drop a **diagram (ASCII or Mermaid)** showing the dev → PR → CI → npm publish flow for extra clarity?
