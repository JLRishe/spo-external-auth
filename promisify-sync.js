module.exports = f => function () { return Promise.resolve().then(() => f.apply(null, arguments)); }