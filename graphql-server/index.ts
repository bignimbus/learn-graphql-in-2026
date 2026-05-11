import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { resolvers } from './resolvers.ts';

const PORT = 4000;
const HERE = import.meta.dirname;
const SCHEMA_PATH = path.join(HERE, 'schema.graphql');

const typeDefs = fs.readFileSync(SCHEMA_PATH, 'utf-8');

const graphiqlHtml = buildGraphiqlHtml({
  title: 'GraphiQL — graphql-server',
  endpoint: '/',
});

const graphiqlPlugin = {
  async serverWillStart() {
    return {
      async renderLandingPage() {
        return { html: graphiqlHtml };
      },
    };
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [graphiqlPlugin],
  introspection: true,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
});

console.log(`[graphql-server] GraphQL endpoint: ${url}`);
console.log(`[graphql-server] GraphiQL UI:      open ${url} in a browser`);

function buildGraphiqlHtml(opts: { title: string; endpoint: string }): string {
  const require = createRequire(import.meta.url);
  const pkgDir = (pkg: string) =>
    path.dirname(require.resolve(`${pkg}/package.json`));
  const pkgVersion = (pkg: string): string =>
    JSON.parse(
      fs.readFileSync(path.join(pkgDir(pkg), 'package.json'), 'utf-8'),
    ).version;

  const v = {
    react: pkgVersion('react'),
    reactDom: pkgVersion('react-dom'),
    graphiql: pkgVersion('graphiql'),
    graphiqlReact: pkgVersion('@graphiql/react'),
    graphiqlToolkit: pkgVersion('@graphiql/toolkit'),
    graphql: pkgVersion('graphql'),
  };

  const styleCss = fs.readFileSync(
    path.join(pkgDir('graphiql'), 'dist/style.css'),
    'utf-8',
  );

  const importmap = {
    imports: {
      react: `https://esm.sh/react@${v.react}`,
      'react/': `https://esm.sh/react@${v.react}/`,
      'react-dom': `https://esm.sh/react-dom@${v.reactDom}`,
      'react-dom/': `https://esm.sh/react-dom@${v.reactDom}/`,
      graphiql: `https://esm.sh/graphiql@${v.graphiql}?standalone&external=react,react-dom,@graphiql/react,graphql`,
      'graphiql/': `https://esm.sh/graphiql@${v.graphiql}/`,
      '@graphiql/react': `https://esm.sh/@graphiql/react@${v.graphiqlReact}?standalone&external=react,react-dom,graphql,@graphiql/toolkit,@emotion/is-prop-valid`,
      '@graphiql/toolkit': `https://esm.sh/@graphiql/toolkit@${v.graphiqlToolkit}?standalone&external=graphql`,
      graphql: `https://esm.sh/graphql@${v.graphql}`,
      '@emotion/is-prop-valid': 'data:text/javascript,',
    },
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${opts.title}</title>
<style>
  body, html { margin: 0; padding: 0; }
  #graphiql { height: 100dvh; }
  .loading { height: 100dvh; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-family: system-ui, sans-serif; }
</style>
<style>${styleCss}</style>
<script type="importmap">${JSON.stringify(importmap)}</script>
<script type="module">
  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import { GraphiQL, HISTORY_PLUGIN } from 'graphiql';
  import { createGraphiQLFetcher } from '@graphiql/toolkit';
  import 'graphiql/setup-workers/esm.sh';

  const fetcher = createGraphiQLFetcher({ url: ${JSON.stringify(opts.endpoint)} });
  const container = document.getElementById('graphiql');
  const root = ReactDOM.createRoot(container);
  root.render(
    React.createElement(GraphiQL, {
      fetcher,
      plugins: [HISTORY_PLUGIN],
      defaultEditorToolsVisibility: true,
    }),
  );
</script>
</head>
<body>
<div id="graphiql"><div class="loading">Loading GraphiQL…</div></div>
</body>
</html>`;
}
