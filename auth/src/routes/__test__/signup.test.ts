import request from 'supertest';
import app from '../../app';

// Valid password and email
it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)
});

// invalid email
it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
      password: 'passwordw'
    })
    .expect(400)
});

// invalid password (less than 4 characters)
it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pas'
    })
    .expect(400)
});

//  Missing email and password (If we want to test different fields we use await. Otherwise return is fine)
it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test'})
    .expect(400)

  await request(app)
  .post('/api/users/signup')
  .send({ password: 'password'})
  .expect(400)
});

// Not allow to register a duplicated email
it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

    await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400)
});

// Check if we have the cookie in the header after registering a user
it('sets a cookie after successful signup', async () => {
  const response = await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'password'
  })
  .expect(201)

  expect(response.get('Set-Cookie')).toBeDefined();
});