// global error handling
// const errorHandler = (error, req, res) => {
//   error.statusCode = error.statusCode || 500;
//   error.status = error.status || "error";
//   res.status(error.statusCode).json({
//     status: error.statusCode,
//     message: error.message,
//   });
// };
// export default errorHandler;

// development level
const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};
// prodction level

const prodError = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went wrong Please try again later",
    });
  }
};
const errorHandler = (error, req, res) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    prodError(res, error);
  }
};
export default errorHandler;
