/**
 * asyncHandler — Express route handler'larını try-catch'e sarmak yerine
 * bu wrapper ile error middleware'e otomatik düşürür.
 *
 * Kullanım:
 *   router.get("/", asyncHandler(async (req, res) => { ... }));
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
