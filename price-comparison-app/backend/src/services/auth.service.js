const bcrypt = require("bcryptjs");

const userRepository = require("../repositories/user.repository");
const { generateToken } = require("../utils/jwt");

const register = async (email, password) => {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    const error = new Error("Email Already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const userId = await userRepository.createUser(email, passwordHash);

  return {
    id: userId,
    email,
  };
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({
    userId: user.id,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
};

const getMe = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
  };
};

module.exports = {
  register,
  login,
  getMe,
};
