const sequelize = require('./config/db');
const { User, Student } = require('./models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced for seeding');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);

    await User.create({
      username: 'admin',
      password: hash,
      role: 'Admin'
    });
    console.log('Admin user created: admin / admin123');

    // Create a mock student
    await Student.create({
      regNo: 'REG2024001',
      name: 'Ajay K',
      department: 'Computer Science',
      year: '3rd Year',
      email: 'ajay@example.com',
      gender: 'Male'
    });
    console.log('Mock student created');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding', err);
    process.exit(1);
  }
}

seed();
