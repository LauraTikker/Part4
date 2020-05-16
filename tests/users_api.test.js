const supertest = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/users')
const app = require('../app')
const api = supertest(app)

beforeEach( async () => {
  await User.deleteMany({})
})

describe('creating new users', () => {
  test('new user is created', async () => {
    const newUser = {
      username: 'Elise',
      name: 'Elise',
      password: '12341534543'
    }

    const postNewUser = await api.post('/api/users').send(newUser)
    expect(postNewUser.status).toBe(200)
    const getNewUser = await api.get('/api/users').send(newUser)
    expect(getNewUser.status).toBe(200)
    expect(getNewUser.body).toHaveLength(1)

  })
  test('password is required', async () => {

    const newUser = {
      username: 'Elise',
      name: 'Elise',
    }

    const result = await api.post('/api/users').send(newUser)
    expect(result.status).toBe(400)
    expect(result.body.error).toBe('Password has to be included')
  })

  test('password has to be at least 3 characters long', async () => {

    const newUser = {
      username: 'Markus',
      name: 'Markus',
      password: '1'
    }

    const result = await api.post('/api/users').send(newUser)
    expect(result.status).toBe(400)
    expect(result.body.error).toBe('Password should be at least 3 characters long')

  })

  test('username is required', async () => {

    const newUser = {
      name: 'Markus',
      password: 'littlePony'
    }

    const result = await api.post('/api/users').send(newUser)
    expect(result.status).toBe(400)
    expect(result.body.error).toBe('User validation failed: username: Path `username` is required.')

  })

  test('username has to be at least 3 characters long', async () => {

    const newUser = {
      username: 'Ma',
      name: 'Markus',
      password: 'littlePony'
    }

    const result = await api.post('/api/users').send(newUser)
    expect(result.status).toBe(400)
    expect(result.body.error).toBe(`User validation failed: username: Path \`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length (3).`)

  })

  test('username has to be unique', async () => {

    const firstUser = {
      username: 'Markus',
      name: 'Markus',
      password: 'littlePony'
    }

    const postFirstUser = await api.post('/api/users').send(firstUser)
    expect(postFirstUser.status).toBe(200)
    const postSencondUser = await api.post('/api/users').send(firstUser)

    expect(postSencondUser.body.error).toBe(`User validation failed: username: Error, expected \`username\` to be unique. Value: \`${firstUser.username}\``)

  })
})

afterAll(() => {
  mongoose.connection.close()
})