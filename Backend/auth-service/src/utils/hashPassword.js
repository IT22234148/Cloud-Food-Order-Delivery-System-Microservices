const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (input, hash) => {
  return await bcrypt.compare(input, hash);
};

module.exports = { hashPassword, comparePassword };
