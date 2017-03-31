"use strict";
var request = require("request");
var walk = require('walk');
var FsExtra = require("fs-extra");
var ts_log_debug_1 = require('ts-log-debug');
var FileUtils = (function () {
    function FileUtils() {
    }
    /**
     *
     * @param path
     * @returns {Promise<string[]>}
     */
    FileUtils.mkdirs = function (path) {
        var _this = this;
        var paths = typeof path === "string" ? [path] : path;
        var promises = paths.map(function (path) {
            return new Promise(function (resolve, reject) { return FsExtra.mkdirs(path, _this.nodeify(resolve, reject)); });
        });
        return Promise.all(promises);
    };
    /**
     *
     * @returns {Promise<T>}
     */
    FileUtils.list = function (path, pattern) {
        if (pattern === void 0) { pattern = /\.md$/; }
        return new Promise(function (resolve, reject) {
            var files = [];
            var walker = walk.walk(path, {
                followLinks: false,
                filters: ["node_modules"]
            });
            walker.on('file', function (root, stat, next) {
                // Add this file to the list of files
                if (stat.name.match(pattern)) {
                    files.push(root + '/' + stat.name);
                }
                next();
            });
            walker.on('end', function () {
                resolve(files);
            });
        });
    };
    /**
     *
     * @param url
     * @param to
     * @returns {Promise<T>}
     */
    FileUtils.downloadFile = function (url, to) {
        return new Promise(function (resolve, reject) {
            ts_log_debug_1.$log.debug('checkout', url);
            request(url)
                .pipe(FsExtra.createWriteStream(to))
                .on('close', resolve)
                .on('error', reject);
        })
            .then(function () {
            ts_log_debug_1.$log.debug('checkout done', url);
        });
    };
    FileUtils.nodeify = function (resolve, reject) {
        return function (err, result) {
            if (err)
                return reject(err);
            resolve(result);
        };
    };
    /**
     *
     * @param path
     */
    FileUtils.read = function (path) {
        return new Promise(function (resolve, reject) {
            return FsExtra.readFile(path, FileUtils.nodeify(resolve, reject));
        })
            .then(function (content) { return content.toString(); });
    };
    /**
     *
     * @param path
     * @param content
     */
    FileUtils.write = function (path, content) {
        return new Promise(function (resolve, reject) {
            return FsExtra.writeFile(path, content, FileUtils.nodeify(resolve, reject));
        });
    };
    /**
     *
     * @param from
     * @param to
     */
    FileUtils.copy = function (from, to) {
        return new Promise(function (resolve, reject) {
            return FsExtra.copy(from, to, FileUtils.nodeify(resolve, reject));
        });
    };
    /**
     *
     * @param path
     */
    FileUtils.remove = function (path) {
        return new Promise(function (resolve, reject) {
            return FsExtra.remove(path, FileUtils.nodeify(resolve, reject));
        });
    };
    return FileUtils;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileUtils;
//# sourceMappingURL=FileUtils.js.map