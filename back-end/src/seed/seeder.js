const seedCategory = require('./category.seed');
const seedWorker = require('./worker.seed');
const { connectMongodb, disconnectMongodb } = require('./db');

async function seed() {
  await connectMongodb();
  await Promise.all([seedCategory(), seedWorker()]);
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
