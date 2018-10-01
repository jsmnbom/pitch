

module.exports = function override(config, env) {
    let oneOf = config.module.rules.filter(x=>x.hasOwnProperty('oneOf'))[0].oneOf;
    let fileLoader = oneOf.filter(x=>x.hasOwnProperty('loader') && x.loader.includes('file-loader'))[0];
    fileLoader.exclude.push(/\.wasm$/);

    config.resolve.extensions.push('.wasm');

    RegExp.prototype.toJSON = RegExp.prototype.toString;

    var fs = require('fs');
    fs.writeFile("test.json", JSON.stringify(config), function(err) {
        if(err) {
            return console.log(err);
        }
    });
    return config;
};