const { RESTDataSource } = require("apollo-datasource-rest");
class LaunchApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.spacexdata.com/v2/";
  }
  async getAllLaunches() {
    const res = await this.get("launches");
    return res && res.length ? res.map(item => this.launchReducer(item)) : [];
  }
  async getLaunchById({ launchId }) {
    sigConsole.debug(`get launch id:${launchId}`);
    const res = await this.get("launches", { flight_number: launchId });
    return res ? this.launchReducer(res[0]) : null;
  }
  async getLaunchesByIds({ launchIds }) {
    sigConsole.debug(`getLaunches ${launchIds}`);
    return await Promise.all(
      launchIds.map(launchId => this.getLaunchById({ launchId }))
    ).then(res => res.filter(item => !!item));
  }
  launchReducer(launch) {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: launch.links.mission_patch
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type: launch.rocket.rocket_type
      }
    };
  }
}
module.exports = LaunchApi;
