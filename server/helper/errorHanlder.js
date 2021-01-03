module.exports = (err, req, res, next) => {
  let status = 500;
  if (err.errors) {
    const errType = err.errors[0].type;
    if (errType) {
      res.status(400).json({ message: err.errors[0].message });
    } else {
      res.status(err.errors[0].status).json({ message: err.errors[0].message });
    }
  } else {
    if (err.message === "invalid token") {
      res.status(400).json({ message: err.message });
    }
    res.status(status).json({ message: err.message });
  }
};
