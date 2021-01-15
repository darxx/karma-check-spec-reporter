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

    const duplicationSpec = [];
    const reporter = {
        specStarted: (result) => {
            const spec = result.fullName.replace(result.description, '').trim();

            const index = duplicationSpec.map((item) => item.fullName).indexOf(result.fullName);
            if (index === -1) {
                duplicationSpec.push({
                    fullName: result.fullName,
                    description: spec,
                    it: result.description,
                    count: 1
                });
            } else {
                duplicationSpec[index].count++;
            }
        },
        done: () => {
            const found = duplicationSpec.filter((item) => item.count > 1);
            const count = found.length;
            const files = count > 0 ? 'files' : 'file';
            if (found.length > 0) {
                console.error(`\nFound duplication in spec ${files} [${count}]`);
                found.forEach((item) => {
                    console.error(`\x1B[31m \u00D7 \x1B\[0m${item.description} ${item.it} [${item.count}]`);
                });
            } else {
                console.log("\n\x1B[32m \u221A \x1B\[0m No duplication");
            }
            console.log("")
            duplicationSpec.length = 0;
        },
    };

    this.onBrowserComplete = () => {
        reporter.done();
    }
    this.specSuccess = this.specSkipped = this.specFailure = (browser, result) => {
        if (result.success) {
            reporter.specStarted(result)
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

