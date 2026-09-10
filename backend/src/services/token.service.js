const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const env = require("../config/env");
const ROLES = require("../enums/roles.enum");
const RefreshToken = require("../models/refreshToken.model");

/**
 * Two independent signing-secret pairs are used depending on the caller's
 * role (Section 4): USER_* secrets for normal customers, SYSTEM_* secrets
 * for admins. This means a leaked/forged user token can never be replayed
 * as an admin token even if role-checking logic elsewhere had a bug.
 */
const secretsFor = (role) =>
  role === ROLES.ADMIN
    ? { access: env.jwt.accessSystemSecret, refresh: env.jwt.refreshSystemSecret }
    : { access: env.jwt.accessUserSecret, refresh: env.jwt.refreshUserSecret };

const signAccessToken = (user) => {
  const { access } = secretsFor(user.role);
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    access,
    { expiresIn: env.jwt.accessExpiresIn }
  );
};

const signRefreshToken = (user) => {
  const { refresh } = secretsFor(user.role);
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    refresh,
    { expiresIn: env.jwt.refreshExpiresIn }
  );
};

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const msFromExpiresIn = (expiresIn) => {
  // Supports simple "15m" / "30d" style strings used in .env.
  const match = /^(\d+)([smhd])$/.exec(expiresIn);
  if (!match) return 30 * 24 * 60 * 60 * 1000; // fallback: 30 days
  const value = parseInt(match[1], 10);
  const unit = { s: 1000, m: 60000, h: 3600000, d: 86400000 }[match[2]];
  return value * unit;
};

const issueTokenPair = async (user) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + msFromExpiresIn(env.jwt.refreshExpiresIn)),
  });

  return { accessToken, refreshToken };
};

const verifyAccessToken = (token, role) => {
  const { access } = secretsFor(role);
  return jwt.verify(token, access);
};

/**
 * A raw refresh token doesn't tell us the role ahead of time, so we try
 * both secrets. This is safe: jwt.verify rejects tokens signed with a
 * different secret, so only one branch can ever succeed.
 */
const decodeRefreshTokenAnyRole = (token) => {
  for (const role of Object.values(ROLES)) {
    try {
      const { refresh } = secretsFor(role);
      return jwt.verify(token, refresh);
    } catch (_) {
      // try next role
    }
  }
  return null;
};

const revokeRefreshToken = async (rawToken) => {
  await RefreshToken.updateOne(
    { tokenHash: hashToken(rawToken) },
    { $set: { revoked: true } }
  );
};

const isRefreshTokenActive = async (rawToken) => {
  const doc = await RefreshToken.findOne({ tokenHash: hashToken(rawToken) });
  return !!doc && !doc.revoked && doc.expiresAt > new Date();
};

module.exports = {
  issueTokenPair,
  verifyAccessToken,
  decodeRefreshTokenAnyRole,
  revokeRefreshToken,
  isRefreshTokenActive,
  hashToken,
};
