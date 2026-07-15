// =====================================================
// Auth helpers: JWT + bcrypt
// =====================================================

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const TOKEN_TTL = "7d"; // 7 days

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
}

/**
 * Hash a plain-text password using bcrypt
 * @param {string} plain
 * @returns {Promise<string>}
 */
export function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

/**
 * Verify a plain-text password against a bcrypt hash
 * @param {string} plain
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/**
 * Sign a JWT for an admin
 * @param {{ id: number, username: string }} admin
 * @returns {string}
 */
export function signToken(admin) {
  return jwt.sign(
    { sub: admin.id, username: admin.username, role: "admin" },
    getSecret(),
    { expiresIn: TOKEN_TTL }
  );
}

/**
 * Verify a JWT and return the payload
 * @param {string} token
 * @returns {object|null}
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
}

/**
 * Extract Bearer token from Authorization header
 * @param {string | null | undefined} header
 * @returns {string | null}
 */
export function extractBearerToken(header) {
  if (!header || typeof header !== "string") return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}
