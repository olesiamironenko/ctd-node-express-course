const jwt = require('jsonwebtoken');
const CustomAPIError = require('../errors/custom-error');

const logon = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new CustomAPIError('Please provide username and password', 400);
  }

  const id = new Date().getDate();

  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  console.log(username, password);
  res.status(200).json({ msg: 'user created', token, username });
};

const hello = async (req, res) => {
  console.log(req.user);
  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(200).json({
    msg: `Hello, ${req.user.username}`,
    secret: `Your lucky number is ${luckyNumber}`,
  });
};

module.exports = {
  logon,
  hello,
};