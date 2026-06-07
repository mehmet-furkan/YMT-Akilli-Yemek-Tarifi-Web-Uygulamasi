const Sentry = require("@sentry/node");
const logger = require("../utils/logger");

/**
 * Sentry hata izlemeyi başlatır. Yalnızca production'da ve SENTRY_DSN
 * tanımlıysa devreye girer; aksi halde sessizce atlar (dev'i etkilemez).
 */
const initSentry = () => {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  if (!process.env.SENTRY_DSN) {
    logger.warn("Sentry DSN bulunamadı (SENTRY_DSN). Sentry başlatılmadı.");
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    // Production'da %100 yerine örnekleme yap (maliyet/performans)
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.1,
  });

  logger.info("Sentry başarıyla başlatıldı.");
};

module.exports = { initSentry, Sentry };
