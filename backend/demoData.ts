import { v4 as uuidv4 } from 'uuid';
import { Sequelize } from 'sequelize-typescript';
import { config } from 'dotenv';
import { User } from './src/user/user.model';
import { Item } from './src/item/item.model';
import { Bid } from './src/bid/bid.model';

export async function seedUsers(sequelize: Sequelize) {
  const names = [
    'Alice',
    'Bob',
    'Charlie',
    'David',
    'Eve',
    'Faythe',
    'Grace',
    'Heidi',
    'Ivan',
    'Judy',
  ];

  const users = names.map(name => ({
    itemId: uuidv4(),
    name,
  }));

  await User.bulkCreate(users);
  console.log('✅ Seeded 10 users');
}

export async function seedItems(sequelize: Sequelize) {
  const items = [
    {
      id: uuidv4(),
      name: 'Antique Vase',
      description: 'A rare 19th-century porcelain vase.',
      startingPrice: 100,
      endTime: new Date(Date.now() + 30 * 60000), // 30 minutes from now
    },
    {
      id: uuidv4(),
      name: 'Vintage Watch',
      description: 'Classic Swiss watch from the 1950s.',
      startingPrice: 250,
      endTime: new Date(Date.now() + 60 * 60000), // 60 minutes
    },
    {
      id: uuidv4(),
      name: 'Gaming Laptop',
      description: 'High-end gaming laptop with RTX GPU.',
      startingPrice: 1200,
      endTime: new Date(Date.now() + 45 * 60000), // 45 minutes
    },
    {
      id: uuidv4(),
      name: 'Mountain Bike',
      description: 'Durable and lightweight trail bike.',
      startingPrice: 400,
      endTime: new Date(Date.now() + 20 * 60000), // 20 minutes
    },
    {
      id: uuidv4(),
      name: 'Art Painting',
      description: 'Original painting by a local artist.',
      startingPrice: 800,
      endTime: new Date(Date.now() + 90 * 60000), // 90 minutes
    },
  ];

  await Item.bulkCreate(items);
  console.log('✅ Seeded 5 auction items');
}

config(); // Load environment variables

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [User, Item, Bid],
});

async function main() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    await seedUsers(sequelize);
    await seedItems(sequelize);

    console.log('✅ Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed', error);
    process.exit(1);
  }
}

main();