"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GeneratorBase_1 = require('./GeneratorBase');
var MDUtils_1 = require('./MDUtils');
var FileUtils_1 = require('./FileUtils');
var ts_log_debug_1 = require('ts-log-debug');
var GeneratorHTML = (function (_super) {
    __extends(GeneratorHTML, _super);
    function GeneratorHTML(dir, settings) {
        _super.call(this, settings);
        this.dir = dir;
    }
    /**
     *
     * @param filesContents
     */
    GeneratorHTML.prototype.generate = function (filesContents) {
        var _this = this;
        ts_log_debug_1.$log.debug('Task generate HTML');
        var menu = [];
        var promises = filesContents
            .map(function (fileContent) {
            var file = fileContent.path.replace('.md', '.html').replace('readme', 'index');
            var content = _this.replaceUrl(MDUtils_1.MDUtils.markdownToHTML(fileContent.content), filesContents);
            menu.push({
                title: fileContent.title,
                href: file
            });
            return _this
                .render('page', {
                pageTitle: "" + _this.settings.pageTitle,
                body: content,
                menu: menu
            })
                .then(function (content) { return FileUtils_1.default.write(_this.dir + "/" + file, content); });
        });
        promises = promises.concat(this.copyAssets(this.dir));
        return Promise.all(promises);
    };
    /**
     *
     * @param content
     * @param filesContents
     * @param cb
     * @returns {string}
     */
    GeneratorHTML.prototype.replaceUrl = function (content, filesContents, cb) {
        var _this = this;
        if (cb === void 0) { cb = function (c) { return c; }; }
        var _a = this.settings, root = _a.root, repository = _a.repository, branch = _a.branch;
        var base = repository + 'blob/' + branch + '/';
        var rules = filesContents
            .map(function (fileContent) { return ({
            from: base + fileContent.path.replace(root + '/', ''),
            to: fileContent.path.replace('.md', '.html').replace('readme', 'index')
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
    return GeneratorHTML;
}(GeneratorBase_1.GeneratorBase));
exports.GeneratorHTML = GeneratorHTML;
//# sourceMappingURL=GeneratorHTML.js.map