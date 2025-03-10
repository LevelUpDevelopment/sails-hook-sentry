var Transport = require('winston-transport');
var util = require('util');
var sentryNode = require('@sentry/node');

//
// Inherit from `winston-transport` so you can take advantage
// of the base functionality and `.exceptions.handle()`.
//
module.exports = class SentryTransport extends Transport {
  constructor(settings) {
    super(settings);

    sentryNode.init({ dsn: settings.dsn, ...settings.options });
    this.sentry = sentryNode;
  }

  log(info, callback) {
    setImmediate(() => {
      if (info.meta) {
        console.log(info.meta);
      } else {
        console.log(info.message);
      }
    });

    try {
      const minLogLevel = Object.keys(sails.log).indexOf(process.env.SENTRY_LOG_LEVEL || 'error');
      const currLogLevel = Object.keys(sails.log).indexOf(info.level);
      if (minLogLevel >= currLogLevel && this.sentry) {
        this.sentry.captureException(info.meta);
      }
    } catch(err) {
      console.error(err);
    }
    callback();
  }
};