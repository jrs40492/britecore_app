const fernet = require('fernet');

const secret = new fernet.Secret('TluxwB3fV_GWuLkR1_BzGs1Zk90TYAuhNMZP_0q4WyM=');
const message = 'gAAAAABcq3QXWTU7PnVBOlUBOIOkI61ojuI8GLZmFQoUy_ETwR_0VHssIjNOn972f9DoiIl5ujWdpWUX-eGKsAX6Ef02AUWiq69C06NAQkKLfel9Q-7Xk94zSOGVVB2FctLEQ2LGuiUfZtbYkkuYS9DDNkWqWY6DNqvHAqga9KUMfDfnKrFmWNudyMtbr-M2PXPBvdlEX26n';
const token = new fernet.Token({
  secret,
  token: message,
  ttl: 0,
});
console.log(token.decode());
