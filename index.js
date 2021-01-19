const checkSpecReporter = function (
    extendBaseReporter,
    logger
) {
    const self = this;
    extendBaseReporter(self);
    self._super = {
        specFailure: self.specFailure.bind(self)
    };
    logger.create('reporter.checkSpec');
    let duplicationSpec = [];
    let browsersList = [];
    const reporter = {
        specStarted: (browsers, result) => {
            if (browsersList.map((item) => item.id).indexOf(browsers.id) === -1) {
                browsersList.push({
                    id: browsers.id,
                    name: browsers.name
                })
            }

            const spec = result.fullName.replace(result.description, '').trim();
            const index = duplicationSpec.map((item) => item.browsersId + item.fullName).indexOf(browsers.id + result.fullName);

            if (index === -1) {
                duplicationSpec.push({
                    browsersId: browsers.id,
                    fullName: result.fullName,
                    description: spec,
                    it: result.description,
                    count: 1
                });
            } else {
                duplicationSpec[index].count++;
            }
        },
        done: (browsers) => {
            const found = duplicationSpec.filter((item) => item && item.count > 1 && item.browsersId == browsers.id);
            const count = found.length;
            const files = count === 1 ? 'file' : 'files';

            if (found.length > 0) {
                console.error(`\nFound duplication in spec ${files} [${count}]`);
                console.error(`Using ${browsers.name} browser\n`);
                [...found.filter((inFind) => inFind.browsersId === browsers.id)].forEach((item) => {
                    console.error(`\x1B[31m \u00D7 \x1B\[0m${item.description} ${item.it} [${item.count}]`);
                });
            } else {
                console.log(`\n\x1B[32m \u221A \x1B\[0m No duplication found using, ${browsers.name}`);
            }

            browsersList = browsersList.filter((item) => item && item.id !== browsers.id);
            duplicationSpec = duplicationSpec.filter((item) => item && item.browsersId !== browsers.id);
            if (browsersList.length === 0) {
                console.log("");
            }
        },
    };
    this.onBrowserComplete = (browser) => {
        reporter.done(browser);
    }
    this.specSuccess = this.specSkipped = this.specFailure = (browser, result) => {
        if (result.success && !result.skipped) {
            reporter.specStarted(browser, result)
        }
    }
}
checkSpecReporter.$inject = [
    'baseReporterDecorator',
    'logger'
]
module.exports = {
    'reporter:checkSpec': ['type', checkSpecReporter]
}
