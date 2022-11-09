const middleware = (schema, property) => {
  return (req, res, next) => {
    // Check if given account has "account-hash-"
    if (req[property].account) {
      if (req[property].account.includes("account-hash-")) {
        req[property].account = req[property].account.replace(
          "account-hash-",
          ""
        );
      }
    }

    const { error } = schema.validate(req[property]);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details
        .map((i) => i.message.replace(/['"]/g, ""))
        .join(",");
      res.status(422).json({
        status: "failed",
        error: message,
      });
    }
  };
};

module.exports = middleware;
