module.exports = {
  Experiment: require("./lib/Experiment"),
  Variant: require("./lib/Variant"),
  emitter: require("./lib/emitter"),
  experimentDebugger: require("./lib/debugger"),
  mixpanelHelper: require("./lib/helpers/mixpanel"),
  segmentHelper: require("./lib/helpers/segment")
};
