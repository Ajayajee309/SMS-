const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const sequelize = require('./src/config/db');

async function forceAdmin() {
  await sequelize.sync();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

  let user = await User.findOne({ where: { username: 'admin' } });
  if (user) {
    await user.update({ password: hashedPassword });
    console.log('Admin password reset to admin123');
  } else {
    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'Admin'
    });
    console.log('Admin user created: admin / admin123');
  }
  process.exit(0);
}
forceAdmin();
