export const sendSuccess = (res, data, message = "Request successful", statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });

export const createError = (message, statusCode = 500, details = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
};
