const passwordService = require("../services/passwordService");

const savePassword = async (req, res) => {
  try {
    const { service, password } = req.body;
    if (!service || !password) {
      return res.status(400).send("Service and password are required.");
    }
    const result = await passwordService.savePassword(service, password);
    res.status(201).json({ message: "Password saved successfully", result });
  } catch (error) {
    res.status(500).send("Error saving password: " + error.message);
  }
};

const getPasswords = async (req, res) => {
  try {
    const passwords = await passwordService.getPasswords();
    res.status(200).json(passwords);
  } catch (error) {
    res.status(500).send("Error retrieving passwords: " + error.message);
  }
};

module.exports = {
  savePassword,
  getPasswords,
};