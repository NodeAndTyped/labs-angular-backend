"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GeneratorBase_1 = require('./GeneratorBase');
var MDUtils_1 = require('./MDUtils');
var Express = require('express');
var serveStatic = require('serve-static');
var ts_log_debug_1 = require('ts-log-debug');
var htmlPDF = require('html-pdf');
var GeneratorPDF = (function (_super) {
    __extends(GeneratorPDF, _super);
    function GeneratorPDF(dir, settings) {
        _super.call(this, settings);
        this.dir = dir;
        this.pdfSettings = {
            format: 'A4',
            type: 'pdf',
            base: 'http://localhost:9090/',
            "border": {
                "top": "1cm",
                "right": "1cm",
                "bottom": "1cm",
                "left": "1cm"
            }
        };
        /**
         *
         * @param content
         */
        this.filter = function (content) { return content
            .split('\n')
            .map(function (line) { return line.replace(/\[Suivant\]\((.*)\)/gi, ''); })
            .join('\n'); };
    }
    /**
     *
     * @returns {Promise<T>}
     */
    GeneratorPDF.prototype.startServer = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.app = Express()
                .use(serveStatic(_this.dir))
                .listen(9090, resolve);
        });
    };
    /**
     *
     * @param filesContents
     */
    GeneratorPDF.prototype.generate = function (filesContents) {
        var _this = this;
        ts_log_debug_1.$log.debug('Task generate PDF');
        return this
            .startServer()
            .then(function () { return _this.copyAssets(_this.dir); })
            .then(function () { return _this.generateHTML(filesContents); })
            .then(function (filesContents) { return _this.generatePDF(filesContents); })
            .then(function () { return _this.app.close(); });
    };
    /**
     *
     * @param filesContents
     * @returns {Promise<TResult>[]}
     */
    GeneratorPDF.prototype.generateHTML = function (filesContents) {
        var _this = this;
        var promises = filesContents
            .map(function (fileContent) {
            var content = MDUtils_1.MDUtils.toTagID(fileContent.title)
                + "\n"
                + MDUtils_1.MDUtils.markdownToHTML(_this.filter(fileContent.content));
            content = _this.replaceUrl(content, filesContents, function (f) { return '#' + MDUtils_1.MDUtils.sanitize(f.title); });
            return Object.assign(fileContent, {
                content: content
            });
        });
        return Promise.all(promises);
    };
    GeneratorPDF.prototype.render = function (content) {
        return _super.prototype.render.call(this, 'pdf', {
            pageTitle: "" + this.settings.pageTitle,
            body: content,
        });
    };
    /**
     *
     * @returns {Promise<IFileContent[]>}
     */
    GeneratorPDF.prototype.generatePDF = function (filesContents) {
        var _this = this;
        return this.render(filesContents.map(function (f) { return f.content; }).join('\n'))
            .then(function (contentHTML) {
            return new Promise(function (resolve, reject) {
                htmlPDF
                    .create(contentHTML, _this.pdfSettings)
                    .toFile(_this.dir + '/' + _this.settings.pdfName, function (err, res) {
                    if (err)
                        return reject(err);
                    resolve(res);
                });
            });
        });
    };
    /**
     *
     * @param content
     * @param filesContents
     * @param cb
     * @returns {string}
     */
    GeneratorPDF.prototype.replaceUrl = function (content, filesContents, cb) {
        var _this = this;
        if (cb === void 0) { cb = function (c) { return c; }; }
        var _a = this.settings, root = _a.root, repository = _a.repository, branch = _a.branch;
        var base = repository + 'blob/' + branch + '/';
        var rules = filesContents
            .map(function (fileContent) { return ({
            from: base + fileContent.path.replace(root + '/', ''),
            to: cb(fileContent)
        }); });
        var rulesResources = this.settings.checkout.branchs
            .map(function (branch) { return ({
            from: repository + 'tree/' + branch,
            to: _this.settings.checkout.cwd + '/' + branch + '.zip'
        }); });
        rules = rules.concat(rulesResources);
        rules.push({
            from: base,
            to: ''
        });
        return this.replacer(content, rules);
    };
    return GeneratorPDF;
}(GeneratorBase_1.GeneratorBase));
exports.GeneratorPDF = GeneratorPDF;
//# sourceMappingURL=GeneratorPDF.js.map