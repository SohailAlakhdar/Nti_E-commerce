const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const authService = require("../services/auth.service");
const cartService = require("../services/cart.service");
const logger = require("../logger/logger");

const REFRESH_COOKIE = "refresh_token";

const setRefreshCookie = (res, token) => {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const register = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.register(req.body);
  setRefreshCookie(res, tokens.refreshToken);
  res.status(201).json(new ApiResponse("Registered successfully", { user, accessToken: tokens.accessToken }));
});

const login = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.login(req.body);
  setRefreshCookie(res, tokens.refreshToken);

  // Merge whatever guest cart this browser was using into the user's cart.
  const guestSessionId = req.cookies?.[cartService.SESSION_COOKIE];
  if (guestSessionId) {
    await cartService.mergeGuestCartIntoUser({ sessionId: guestSessionId, userId: user._id });
    res.clearCookie(cartService.SESSION_COOKIE);
  }

  logger.info("User logged in", { userId: user._id });
  res.json(new ApiResponse("Logged in successfully", { user, accessToken: tokens.accessToken }));
});

const refresh = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies?.[REFRESH_COOKIE];
  const { user, tokens } = await authService.refresh(rawRefreshToken);
  setRefreshCookie(res, tokens.refreshToken);
  res.json(new ApiResponse("Token refreshed", { user, accessToken: tokens.accessToken }));
});

const logout = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies?.[REFRESH_COOKIE];
  await authService.logout(rawRefreshToken);
  res.clearCookie(REFRESH_COOKIE);
  res.json(new ApiResponse("Logged out successfully"));
});

const me = asyncHandler(async (req, res) => {
  res.json(new ApiResponse("Current user", { user: req.user.toSafeJSON() }));
});

module.exports = { register, login, refresh, logout, me };
