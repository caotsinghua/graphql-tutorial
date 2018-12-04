module.exports = {
  Query: {
    launches: async (parent, args, context, info) => {
      return context.dataSources.launchApi.getAllLaunches();
    },
    launch: async (parent, args, { dataSources }) => {
      return dataSources.launchApi.getLaunchById({
        launchId: args.id
      });
    },
    me: async (parent, args, context, info) => {
      const { dataSources } = context;
      sigConsole.debug(dataSources.userApi);
      return dataSources.userApi.findOrCreateUser();
    }
  },
  Mission: {
    missionPatch: (mission, { size } = { size: "LARGE" }) => {
      return size == "SMALL"
        ? mission.missionPatchSmall
        : mission.missionPatchLarge;
    }
  },
  User: {
    trips: async (parent, args, context, info) => {
      const { dataSources } = context;
      const launchIds = await dataSources.userApi.getLaunchIdsByUser();
      if (!launchIds.length) return [];
      const result = await dataSources.launchApi.getLaunchesByIds({
        launchIds
      });
      return result;
    }
  },
  Mutation: {
    login: async (parent, { email }, { dataSources }) => {
      sigConsole.debug(email);
      const user = await dataSources.userApi.findOrCreateUser({ email });
      if (user) return Buffer.from(email).toString("base64");
    },
    bookTrips: async (parent, { launchIds }, { dataSources }) => {
      const res = await dataSources.userApi.bookTrips({ launchIds });
      sigConsole.debug(`res:${res}`);
      const launches = await dataSources.launchApi.getLaunchesByIds({
        launchIds
      });
      sigConsole.debug(launches);
      return {
        success: res && res.length === launches.length,
        message:
          res.length === launchIds.length
            ? "trips booked successfully"
            : `the following launches couldn't be booked: ${launchIds.filter(
                id => !res.includes(id)
              )}`,
        launches
      };
    },
    cancelTrip: async (parent, { launchId }, { dataSources }) => {
      const result = await dataSources.userApi.cancelTrip({
        launchId
      });
      sigConsole.debug(result);
      if (!result) {
        return {
          success: false,
          message: "failed to cancel trip"
        };
      }
      const launch = await dataSources.launchApi.getLaunchById(launchId);
      return {
        success: true,
        message: "trip cancelled",
        launch
      };
    }
  }
};
