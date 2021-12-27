// в нашем случае это промежуточное звено, позв отправлять любые виды запросов с любых доменов

function cors(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, PATCH, POST, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next(); // ф-я некст вызывает по цепочке след миддлвар
}

module.exports = cors;
