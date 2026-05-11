# talk-intro

A throwaway GraphQL server used during Jeff's conference talk. Single query:

```graphql
query TalkIntro {
  me {
    name
    title
    company
    socials {
      twitter
      github
    }
    bio
  }
}
```

## Update bio before talk

Edit `data.ts` and replace the `PLACEHOLDER` strings with the values you want
to read out on stage.

## Run locally

From repo root:

```sh
npm install
npm run intro
```

Then open <http://localhost:4001> for GraphiQL.

## Deployment

This server is not intended to be deployed — it exists as a talk artifact. If
you do want to host it (e.g. so attendees can hit it from their laptops), the
shape is small enough to drop into anything that can run Node 22 with no build
step:

- Fly.io: `fly launch` from this directory, expose port `4001` (or set
  `PORT=8080` and edit `index.ts`).
- Render / Railway: same idea — start command is `node
  --experimental-strip-types --no-warnings=ExperimentalWarning index.ts`.
- A laptop hotspot also works.
