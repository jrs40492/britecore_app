const fernet = require('fernet');

const secret = new fernet.Secret('TluxwB3fV_GWuLkR1_BzGs1Zk90TYAuhNMZP_0q4WyM=');
const message = 'gAAAAABcYvqTXnleAuVBJVwHr9DDGEbKQB1whryz3s9Tzu4bOot_gwbVLLEZrYWpCQKc6I7EKRp6nv9np_I3bWfirv1Bx_DCtpSmPtOymlrC1AWZk7OXc-zwClnPiYXLK8FvNKBkur_fWs1E-PKLjeNLdD_f_cOfWmVvsrqpWlYk317N_YxC7qKWcsTpMKnYLR9uCs2UCTIk';
const token = new fernet.Token({
  secret,
  token: message,
  ttl: 0,
});
console.log(token.decode());
