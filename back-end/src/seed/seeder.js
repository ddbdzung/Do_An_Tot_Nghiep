const seedCategory = require('./category.seed');
const { connectMongodb, disconnectMongodb } = require('./db');

async function seed() {
  await connectMongodb();
  await seedCategory();
}

seed()
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
