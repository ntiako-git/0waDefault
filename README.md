# Discord App

Base simple pour démarrer une application Discord avec **TypeScript**, **discord.js**, **Prisma** et **PostgreSQL**.

## Installation

Le projet utilise **pnpm** par défaut, mais **npm fonctionne aussi**.
Si vous utilisez npm, modifiez dans `package.json` :

```json
"packageManager": "pnpm@10.30.1"
```

Puis installez les dépendances :

```bash
pnpm install
```

ou

```bash
npm install
```

## Dépendances

### Dependencies

* discord.js
* dotenv
* chalk
* @prisma/client
* @prisma/adapter-pg

### DevDependencies

* typescript
* tsx
* prisma
* rimraf
* @types/node

## Scripts

```bash
pnpm run dev           # Lancer le bot en développement
pnpm run build         # Compiler le projet
pnpm run start         # Lancer la version compilée
pnpm run clean         # Supprimer dist et generated

pnpm run prisma:dev    # Migration dev
pnpm run prisma:gen    # Générer le client Prisma
pnpm run prisma:studio # Prisma Studio
pnpm run db:deploy     # Déployer les migrations
pnpm run prod:deploy   # Déploiement production complet
```

## Prisma

* **Schema** : `prisma/schema.prisma`
* **Migrations** : `prisma/migrations/`
* **Client généré** : `generated/`

Après modification du schema :

```bash
pnpm run prisma:dev
pnpm run prisma:gen
```

## Structure du projet

```
prisma/
  schema.prisma

src/
  commands/
  config/
  controllers/
  core/
  events/
  services/
  types/
  views/
  main.ts
```

## Lancer le projet

```bash
pnpm run dev
```

## Build production

```bash
pnpm run prod:deploy
```
