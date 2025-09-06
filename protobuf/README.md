# @dnp2412/shipping-protos
To install package
```shell
npm install @dnp2412/shipping-protos
```

# Release process
## Generate typescript buf
```shell
buf generate
```

## Adding changesets
```shell
pnpm install
pnpm run build
pnpm changeset
```
## Versioning and publishing
```shell
pnpm changeset version
```
## Publish
```shell
pnpm changeset publish
```