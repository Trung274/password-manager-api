const crypto = require("crypto");
const Password = require("../models/passwordModel");

// Load encryption key and IV from environment variables
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "utf-8"); // Convert to buffer
const ENCRYPTION_IV = Buffer.from(process.env.ENCRYPTION_IV, "utf-8");   // Convert to buffer

// Validate the lengths of the key and IV
if (ENCRYPTION_KEY.length !== 32 || ENCRYPTION_IV.length !== 16) {
  throw new Error("Invalid ENCRYPTION_KEY or ENCRYPTION_IV length. ENCRYPTION_KEY must be 32 bytes and ENCRYPTION_IV must be 16 bytes.");
}

// Encrypt a password
const encryptPassword = (password) => {
  try {
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, ENCRYPTION_IV);
    let encrypted = cipher.update(password, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

// Decrypt a password
const decryptPassword = (encryptedPassword) => {
  try {
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, ENCRYPTION_IV);
    let decrypted = decipher.update(encryptedPassword, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
};

// Save a password (encrypted)
const savePassword = async (service, password) => {
  try {
    const encryptedPassword = encryptPassword(password);
    const newPassword = new Password({ service, password: encryptedPassword });
    return await newPassword.save();
  } catch (error) {
    throw new Error(`Failed to save password: ${error.message}`);
  }
};

// Retrieve all passwords (decrypted)
const getPasswords = async () => {
  try {
    const passwords = await Password.find({});
    return passwords.map((item) => ({
      service: item.service,
      password: decryptPassword(item.password),
    }));
  } catch (error) {
    throw new Error(`Failed to retrieve passwords: ${error.message}`);
  }
};

module.exports = {
  savePassword,
  getPasswords,
};
