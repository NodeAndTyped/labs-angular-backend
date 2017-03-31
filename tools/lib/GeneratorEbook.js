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
var GeneratorEbook = (function (_super) {
    __extends(GeneratorEbook, _super);
    function GeneratorEbook(dir, settings) {
        _super.call(this, settings);
        this.dir = dir;
    }
    /**
     *
     * @param filesContents
     */
    GeneratorEbook.prototype.generate = function (filesContents) {
        var _this = this;
        ts_log_debug_1.$log.debug('Task generate Ebook');
        var promises = [];
        var menu = [];
        var ebookContent = filesContents
            .map(function (fileContent) {
            var content = MDUtils_1.MDUtils.toTagID(fileContent.title) + "\n";
            menu.push({
                title: fileContent.title,
                href: '#' + MDUtils_1.MDUtils.sanitize(fileContent.title)
            });
            return content + MDUtils_1.MDUtils.markdownToHTML(fileContent.content
                .split('\n')
                .map(function (line) { return line.replace(/\[Suivant\]\((.*)\)/gi, ''); })
                .join('\n'));
        }).join('\n');
        var promise = this
            .render('page', {
            pageTitle: "" + this.settings.pageTitle,
            body: this.replaceUrl(ebookContent, filesContents),
            menu: menu
        })
            .then(function (content) { return FileUtils_1.default.write(_this.dir + "/index.html", content); });
        promises.push(promise);
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
    GeneratorEbook.prototype.replaceUrl = function (content, filesContents) {
        var _this = this;
        var _a = this.settings, root = _a.root, repository = _a.repository, branch = _a.branch;
        var base = repository + 'blob/' + branch + '/';
        var rules = filesContents
            .map(function (fileContent) { return ({
            from: base + fileContent.path.replace(root + '/', ''),
            to: '#' + MDUtils_1.MDUtils.sanitize(fileContent.title)
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
    return GeneratorEbook;
}(GeneratorBase_1.GeneratorBase));
exports.GeneratorEbook = GeneratorEbook;
//# sourceMappingURL=GeneratorEbook.js.map