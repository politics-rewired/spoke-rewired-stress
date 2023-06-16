function generateSendMessageParams(requestParams, ctx, ee, next) {
  const tn = [...Array(10)].map(() => Math.floor(Math.random() * 10)).join("");
  const toNumber = `+1${tn}`;

  ctx.vars.toNumber = toNumber;

  return next();
}

module.exports = { generateSendMessageParams };
