const { SESSION_COOKIE, generateSessionId } = require("../services/cart.service");


const ensureGuestSession = (req, res, next) => {
  if (req.user) return next(); // authenticated users don't need a guest session

  let sessionId = req.cookies?.[SESSION_COOKIE];
  if (!sessionId) {
    sessionId = generateSessionId();
    res.cookie(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
  req.guestSessionId = sessionId;
  next();
};

const cartOwnerFromReq = (req) => ({
  userId: req.user ? req.user._id : null,
  sessionId: req.user ? null : req.guestSessionId,
});

module.exports = { ensureGuestSession, cartOwnerFromReq };
