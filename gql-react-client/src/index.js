import React from "react";
import { render } from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import gql from "graphql-tag";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Launches from "./containers/launches";
import "semantic-ui-css/semantic.min.css";

const client = new ApolloClient({
  uri: "http://localhost:3001/"
});
render(
  <ApolloProvider client={client}>
    <Launches />
  </ApolloProvider>,
  document.querySelector("#root")
);
