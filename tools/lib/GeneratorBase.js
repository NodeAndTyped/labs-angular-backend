"use strict";
var path = require('path');
var basePath = path.resolve('./models');
var FileUtils_1 = require('./FileUtils');
var ts_log_debug_1 = require('ts-log-debug');
var ejs = require('ejs');
var GeneratorBase = (function () {
    function GeneratorBase(settings) {
        this.settings = settings;
        /**
         *
         * @type {Map<string, Promise<string>>}
         */
        this.cache = new Map();
    }
    /**
     *
     * @param file
     * @param scope
     * @returns {PromiseLike<TResult>|Promise<TResult>|Promise<T>|Promise<TResult2|TResult1>}
     */
    GeneratorBase.prototype.render = function (file, scope) {
        var promise;
        if (this.cache.has(file)) {
            promise = this.cache.get(file);
        }
        else {
            promise = FileUtils_1.default.read(basePath + "/" + file + ".html");
            this.cache.set(file, promise);
        }
        return promise.then(function (template) { return ejs.render(template, scope); });
    };
    /**
     *
     * @param cwd
     * @returns {Array}
     */
    GeneratorBase.prototype.copyAssets = function (cwd) {
        ts_log_debug_1.$log.debug('copy assets to', cwd);
        var promises = [];
        promises.push(FileUtils_1.default.copy(basePath + "/scripts/", cwd + "/scripts"));
        promises.push(FileUtils_1.default.copy(basePath + "/styles/", cwd + "/styles"));
        promises.push(FileUtils_1.default.copy(basePath + "/fonts/", cwd + "/fonts"));
        promises = promises.concat(this.settings.copy.map(function (file) { return FileUtils_1.default.copy(file.from, cwd + "/" + file.to); }));
        return promises;
    };
    GeneratorBase.prototype.replacer = function (content, rules) {
        rules.forEach(function (rule) { return content = content.replace(new RegExp(rule.from, 'gi'), rule.to); });
        return content;
    };
    return GeneratorBase;
}());
exports.GeneratorBase = GeneratorBase;
//# sourceMappingURL=GeneratorBase.js.map