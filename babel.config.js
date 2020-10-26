module.exports = function (api) {
  api.cache(true);

  const presets = [
    ["@babel/preset-env", {
      "targets": { 
        "browsers": "defaults",
        "node": "current"
      }
    }]
  ];

  const plugins = [["@babel/plugin-transform-classes"]];

  return {
    presets,
    plugins
  };
}
