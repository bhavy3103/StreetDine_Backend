import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err)
      return next(errorHandler(403, 'Forbidden'));

    req.user = user;
    next();
  })
};

export const authMiddlewareAdmin = (req, res, next) => {

  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decodedToken.role);
  if (decodedToken.role !== 'admin') {
    return next(errorHandler(403, 'Forbidden'));
  }
  req.user = user;
  next();

}
