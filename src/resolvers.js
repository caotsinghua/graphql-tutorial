module.exports = {
  Query: {
    launches: async (parent, args, context, info) => {
      return context.dataSources.launchApi.getAllLaunches();
    },
    launch: async (parent, args, { dataSources }) => {
      return dataSources.launchApi.getLaunchById({
        launchId: args.id
      });
    }
  },
  Mission: {
    missionPatch: (mission, { size } = { size: "LARGE" }) => {
      return size == "SMALL"
        ? mission.missionPatchSmall
        : mission.missionPatchLarge;
    }
  }
};
