import 'dotenv/config';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://crowdfunding_user:crowdfunding_password@localhost:5432/crowdfunding_test';

// Clean up after tests
afterAll(async () => {
  // Wait a bit for connections to close
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Note: In a real application, you might want to clean up test data
  // For now, we'll rely on the test database being separate
  console.log('Test cleanup completed');
});