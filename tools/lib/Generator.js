"use strict";
var FileUtils_1 = require('./FileUtils');
var GeneratorHTML_1 = require('./GeneratorHTML');
var GeneratorEbook_1 = require('./GeneratorEbook');
var GeneratorPDF_1 = require('./GeneratorPDF');
var ts_log_debug_1 = require("ts-log-debug");
var Generator = (function () {
    /**
     *
     * @type {Map<string, Promise<string>>}
     */
    function Generator(settings) {
        this.settings = settings;
        this.tmpDir = this.settings.cwd + "/.tmp";
        this.pdfDir = this.tmpDir + "/pdf";
        this.ebookDir = this.tmpDir + "/ebook";
        this.htmlDir = this.tmpDir + "/html";
        this.resourcesDir = this.tmpDir + "/resources";
    }
    /**
     *
     * @returns {Promise<TResult|any[]>}
     */
    Generator.prototype.build = function () {
        var _this = this;
        return this.createWorkspace()
            .then(function () { return _this.taskCheckout(); })
            .then(function () { return _this.taskReadFiles(); })
            .then(function (filesContents) { return _this.taskGenerate(filesContents); })
            .then(function () { return _this.taskCopyToDirs(); })
            .then(function () { return _this.settings; })
            .then(function () { return FileUtils_1.default.remove(_this.tmpDir); });
    };
    /**
     *
     * @returns {Promise<void>}
     */
    Generator.prototype.createWorkspace = function () {
        var _this = this;
        return Promise.resolve()
            .then(function () { return FileUtils_1.default.remove(_this.settings.cwd); })
            .then(function () { return FileUtils_1.default.mkdirs(_this.settings.cwd); })
            .then(function () { return FileUtils_1.default.mkdirs(_this.tmpDir); })
            .then(function () { return FileUtils_1.default.mkdirs(_this.pdfDir); })
            .then(function () { return FileUtils_1.default.mkdirs(_this.htmlDir); })
            .then(function () { return FileUtils_1.default.mkdirs(_this.ebookDir); })
            .then(function () { return FileUtils_1.default.mkdirs(_this.resourcesDir); });
    };
    /**
     *
     * @returns {Promise<string[]>}
     */
    Generator.prototype.taskReadFiles = function () {
        var _this = this;
        var mapper = function (file) {
            return FileUtils_1.default
                .read(_this.settings.root + '/' + file.path)
                .then(function (content) { return ({
                title: file.title,
                path: file.path,
                content: content
            }); });
        };
        var promises = this.settings.concat.files.map(mapper);
        return Promise.all(promises);
    };
    /**
     *
     * @returns {Promise<TAll[]>}
     */
    Generator.prototype.taskGenerate = function (filesContents) {
        var generatorHTML = new GeneratorHTML_1.GeneratorHTML(this.htmlDir, this.settings);
        var generatorEbook = new GeneratorEbook_1.GeneratorEbook(this.ebookDir, this.settings);
        var generatorPDF = new GeneratorPDF_1.GeneratorPDF(this.pdfDir, this.settings);
        return Promise.resolve()
            .then(function () { return generatorHTML.generate(filesContents); })
            .then(function () { return generatorEbook.generate(filesContents); })
            .then(function () { return generatorPDF.generate(filesContents); });
    };
    /**
     *
     */
    Generator.prototype.taskCheckout = function () {
        var _this = this;
        if (this.settings.checkout) {
            ts_log_debug_1.$log.debug('Checkout all files...');
            return Promise.all(this.settings
                .checkout
                .branchs
                .map(function (branch) {
                return FileUtils_1.default.downloadFile(_this.settings.repository + "archive/" + branch + ".zip", _this.resourcesDir + "/" + branch + ".zip");
            }));
        }
    };
    /**
     *
     */
    Generator.prototype.taskCopyToDirs = function () {
        var _this = this;
        ts_log_debug_1.$log.debug('Generate directories');
        var promises = this.settings.outDir.map(function (task) {
            var path = _this.settings.cwd + '/' + task.path;
            return FileUtils_1.default
                .mkdirs(path)
                .then(function () {
                ts_log_debug_1.$log.debug("Export " + task.format + " to directory " + path);
                switch (task.format) {
                    case "html":
                        return FileUtils_1.default
                            .copy(_this.htmlDir, path)
                            .then(function () {
                            return FileUtils_1.default.copy(_this.resourcesDir, _this.htmlDir + "/" + _this.settings.checkout.cwd).catch(function () { return true; });
                        });
                    case "ebook":
                        return FileUtils_1.default
                            .copy(_this.ebookDir, path)
                            .then(function () {
                            return FileUtils_1.default.copy(_this.resourcesDir, _this.htmlDir + "/" + _this.settings.checkout.cwd).catch(function () { return true; });
                        });
                    case "pdf":
                        return FileUtils_1.default
                            .copy(_this.pdfDir + '/' + _this.settings.pdfName, path + '/' + _this.settings.pdfName)
                            .then(function () {
                            return FileUtils_1.default.copy(_this.resourcesDir, _this.htmlDir + "/" + _this.settings.checkout.cwd).catch(function () { return true; });
                        });
                }
                return Promise.resolve();
            });
        });
        return Promise.all(promises);
    };
    return Generator;
}());
exports.Generator = Generator;
//# sourceMappingURL=Generator.js.map