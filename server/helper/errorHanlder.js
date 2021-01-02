module.exports = (err, req, res, next) => {
  const errType = err.errors[0].type;
  if (errType) {
    res.status(400).json({ message: err.errors[0].message });
  } else {
    res.status(err.errors[0].status).json({ message: err.errors[0].message });
  }
};
