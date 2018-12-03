const SQL = require("sequelize");
const createStore = () => {
  const Op = SQL.Op;
  const operatorsAliases = {
    $in: Op.in
  };
  const db = new SQL("spacex", "tssword", "123123..", {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    operatorsAliases,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
  const users = db.define("user", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: SQL.DATE,
    updateAt: SQL.DATE,
    email: SQL.STRING,
    token: SQL.STRING
  });
  const trips = db.define("trips", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: SQL.DATE,
    updateAt: SQL.DATE,
    launchId: SQL.INTEGER,
    userId: SQL.INTEGER
  });
  return {
    users,
    trips
  };
};

module.exports = {
  createStore
};
