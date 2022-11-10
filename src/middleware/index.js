const validateInput = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    const valid = error === null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details
        .map((item) => item.message.replace(/['"]/g, ""))
        .join(",");
      res.status(422).json({
        status: "failed",
        error: message,
      });
    }
  };
};

module.exports = validateInput;
