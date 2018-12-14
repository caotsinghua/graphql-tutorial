const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require("./schema");
const resolvers = require("./resolvers");
const LaunchApi = require("./datasources/launch");
const UserApi = require("./datasources/user");
const { createStore } = require("./utils");
const sigConsole = require("signale");
const isEmail = require("isemail");
const bodyparser = require("body-parser");
const app = express();
const store = createStore();
global.sigConsole = sigConsole;

const context = async ({ req }) => {
  const auth = (req.headers && req.headers.authorization) || "";
  const email = Buffer.from(auth, "base64").toString("ascii");
  sigConsole.info(`context email:${email}`);
  if (!isEmail.validate(email)) return { user: null };
  const users = await store.users.findOrCreate({
    where: {
      email
    }
  });
  const user = users && users[0] ? users[0] : null;
  return {
    user: {
      ...user.dataValues
    }
  };
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  dataSources: () => ({
    launchApi: new LaunchApi(),
    userApi: new UserApi({ store })
  })
});
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
server.applyMiddleware({
  app,
  path: "/"
});
app.listen(3001, () => {
  sigConsole.start(`[app] run at http://localhost:3001${server.graphqlPath}`);
});
