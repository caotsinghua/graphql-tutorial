const { DataSource } = require("apollo-datasource");
const isEmail = require("isemail");
class UserApi extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }
  initialize(config) {
    this.context = config.context;
  }
  async findOrCreateUser({ email: emailArg } = {}) {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;
    const users = await this.store.users.findOrCreate({
      where: { email }
    });
    return users && users[0] ? users[0] : null;
  }
  //   订阅trip
  async bookTrips({ launchIds }) {
    const { user } = this.context;
    let userId;
    if (user) {
      userId = user.id;
    }
    if (!userId) return [];
    const result = [];
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId });
      if (res) result.push(res);
    }
    return result;
  }
  async bookTrip({ launchId }) {
    const userId = this.context.user.id;
    const res = await this.store.trips.findOrCreate({
      where: {
        userId,
        launchId
      }
    });
    return res && res.length ? res[0].get() : false;
  }
  async cancelTrip({ launchId }) {
    const userId = this.context.user.id;

    return await this.store.trips.destroy({
      where: {
        userId,
        launchId
      }
    });
  }
  async getLaunchIdsByUser() {
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: { userId }
    });
    return found && found.length
      ? found
          .map(item => {
            return item.dataValues.launchId;
          })
          .filter(id => !!id)
      : [];
  }
  async isBookedOnLaunch({ launchId }) {
    const userId = this.context.user.id;
    if (!userId) return false;
    const found = await this.store.trips.findAll({
      where: {
        userId,
        launchId
      }
    });
    return found && found.length > 0;
  }
}

module.exports = UserApi;
