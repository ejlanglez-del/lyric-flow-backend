const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {

  console.log('BODY RECIBIDO EN LOGIN:', req.body);
  if (!req.body) {
    res.status(400);
    throw new Error('No se recibió body en la petición');
  }
  // Solo si req.body existe, hacemos destructuring
  let email, password;
  if (typeof req.body === 'object') {
    email = req.body.email;
    password = req.body.password;
  }
  if (!email || !password) {
    console.error('Faltan campos en el login:', req.body);
    res.status(400);
    throw new Error('Faltan email o password');
  }

  const user = await User.findOne({ email });
  console.log('Usuario encontrado:', user ? user.email : 'No existe');

  if (user) {
    try {
      const isMatch = await user.matchPassword(password);
      console.log('Password match:', isMatch);
      if (isMatch) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
        return;
      }
    } catch (err) {
      console.error('Error al comparar password:', err);
      res.status(500);
      throw new Error('Error interno al comparar password');
    }
  }
  res.status(401);
  throw new Error('Email o contraseña inválidos');
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('El usuario ya existe');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Datos de usuario inválidos');
  }
});

module.exports = { authUser, registerUser };