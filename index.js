var fs = require('fs');

module.exports = function requireAll(options, params) {
  if (typeof options === 'string') {
    options = {
      dirname: options,
      filter: /(.+)\.js(on)?$/,
      excludeDirs: /^\.(git|svn)$/,
      params: params
    };
  }

  var files = fs.readdirSync(options.dirname);
  var modules = {};

  function excludeDirectory(dirname) {
    return options.excludeDirs && dirname.match(options.excludeDirs);
  }

  files.forEach(function (file) {
    var filepath = options.dirname + '/' + file;
    if (fs.statSync(filepath).isDirectory()) {

      if (excludeDirectory(file)) return;

      modules[file] = requireAll({
        dirname: filepath,
        filter: options.filter,
        excludeDirs: options.excludeDirs
      });

    } else {
      var match = file.match(options.filter);
      if (!match) return;
	  
	  if(!options.params) {
	      modules[match[1]] = require(filepath);
	  } else {
		  modules[match[1]] = require(filepath)(params);
	  }
    }
  });

  return modules;
};
