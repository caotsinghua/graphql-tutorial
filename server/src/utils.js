const SQL = require("sequelize");
const paginateResults = ({
  after: cursor,
  pageSize = 20,
  results,
  getCusor = () => null
}) => {
  if (pageSize < 1) return [];
  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex(item => {
    let itemCursor = item.cursor ? item.cursor : getCusor(item);
    return itemCursor ? itemCursor === cursor : false;
  });
  return cursorIndex > 0
    ? cursorIndex === results.length - 1
      ? []
      : results.slice(
          cursorIndex + 1,
          Math.min(results.length, cursorIndex + 1 + pageSize)
        )
    : results.slice(0, pageSize);
};
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
    updatedAt: SQL.DATE,
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
    updatedAt: SQL.DATE,
    launchId: SQL.INTEGER,
    userId: SQL.INTEGER
  });
  db.sync();
  return {
    users,
    trips
  };
};

module.exports = {
  createStore,
  paginateResults
};
