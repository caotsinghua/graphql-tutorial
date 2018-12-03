const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require("./schema");
const resolvers = require("./resolvers");
const LaunchApi = require("./datasources/launch");
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchApi: new LaunchApi()
  })
});
server.applyMiddleware({
  app,
  path: "/gpl"
});
app.listen(3001, () => {
  console.log(`[app] run at http://localhost:3001${server.graphqlPath}`);
});
