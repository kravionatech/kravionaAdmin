export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[${new Date().toISOString()}] Error:`, err);

  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: "Route not found",
  });
};

export default { errorHandler, notFoundHandler };
