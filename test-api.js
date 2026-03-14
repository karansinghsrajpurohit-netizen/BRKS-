import process from 'process';

const BASE_URL = 'http://localhost:5000/api';

async function testApi() {
  console.log('--- Testing API ---');

  // 1. Register
  console.log('\n1. Registering new user...');
  const regRes = await fetch(`${BASE_URL}/authuser/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `TestUser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    })
  });
  const regData = await regRes.json();
  console.log('Register Response:', regData);
  
  // Create a known user strictly for login text
  const email = `karan_${Date.now()}@test.com`;
  const password = 'password123';
  await fetch(`${BASE_URL}/authuser/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Karan Test', email, password })
  });

  // 2. Login
  console.log('\n2. Logging in...');
  const loginRes = await fetch(`${BASE_URL}/authuser/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const loginData = await loginRes.json();
  console.log('Login Response Message:', loginData.msg);
  
  const token = loginData.token;
  if (!token) {
    console.error('Failed to get token! Exiting.');
    return;
  }
  console.log('Token Received (first 20 chars):', token.substring(0, 20) + '...');

  // 3. Add a book
  console.log('\n3. Adding a new book...');
  const bookRes = await fetch(`${BASE_URL}/book/addbook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({
      title: 'The Great Indian Novel',
      author: 'Shashi Tharoor',
      description: 'A satirical novel.',
      url: 'https://example.com/book',
      user: loginData.user[0]._id
    })
  });
  const bookData = await bookRes.json();
  console.log('Add Book Response:', bookData);

  // 4. Get all books
  console.log('\n4. Fetching all books...');
  const getBooksRes = await fetch(`${BASE_URL}/book/getBooks`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if(getBooksRes.ok) {
     const allBooksData = await getBooksRes.json();
     console.log('Get Books Response:', allBooksData);
  } else {
     console.log('Failed to fetch books:', await getBooksRes.text());
  }

}

testApi().catch(console.error);
