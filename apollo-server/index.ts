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
  title: 'GraphiQL — apollo-server',
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

console.log(`[apollo-server] GraphQL endpoint: ${url}`);
console.log(`[apollo-server] GraphiQL UI:      open ${url} in a browser`);

function buildGraphiqlHtml(opts: { title: string; endpoint: string }): string {
  const require = createRequire(import.meta.url);
  const pkgDir = (pkg: string) =>
    path.dirname(require.resolve(`${pkg}/package.json`));
  const read = (file: string) => fs.readFileSync(file, 'utf-8');

  const reactJs = read(
    path.join(pkgDir('react'), 'umd/react.production.min.js'),
  );
  const reactDomJs = read(
    path.join(pkgDir('react-dom'), 'umd/react-dom.production.min.js'),
  );
  const graphiqlJs = read(path.join(pkgDir('graphiql'), 'graphiql.min.js'));
  const graphiqlCss = read(path.join(pkgDir('graphiql'), 'graphiql.min.css'));

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${opts.title}</title>
<style>
  body, html { margin: 0; padding: 0; height: 100%; }
  #graphiql { height: 100vh; }
</style>
<style>${graphiqlCss}</style>
</head>
<body>
<div id="graphiql">Loading GraphiQL…</div>
<script>${reactJs}</script>
<script>${reactDomJs}</script>
<script>${graphiqlJs}</script>
<script>
  const fetcher = GraphiQL.createFetcher({ url: ${JSON.stringify(opts.endpoint)} });
  const root = ReactDOM.createRoot(document.getElementById('graphiql'));
  root.render(React.createElement(GraphiQL, { fetcher, defaultEditorToolsVisibility: true }));
</script>
</body>
</html>`;
}
