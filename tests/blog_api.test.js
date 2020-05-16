const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/users')
const initialBloglist = require('./initialBlogList')
const api = supertest(app)

beforeEach( async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  const initalBlogPosts = initialBloglist.map(blog => new Blog(blog))
  const promiseArray = initalBlogPosts.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('getting the blog posts', () => {
  test('blogs are returned as a json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct amount of blog posts are returned', async () => {
    const response = await api.get('/api/blogs')
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(initialBloglist.length)
  })
})


describe('posting the blog posts', () => {
  test('new blog post is saved and returned as json', async () => {

    const newUser = {
      username: 'TestUser',
      name: 'Test User',
      password: '1234112534543'
    }
    await api.post('/api/users').send(newUser)

    const tokenResponse = await api.post('/api/login').send({ username: newUser.username, password: newUser.password })

    let newBlogPost =
    {
      title: 'Animals',
      author: 'Greg Wolf',
      url: 'www.animals.fi',
      likes: 78,
    }

    const response = await api.post('/api/blogs').auth(tokenResponse.body.token, { type: 'bearer' }).send(newBlogPost).expect('Content-Type', /application\/json/)

    expect(response.status).toBe(201)

    const blogPosts = await api.get('/api/blogs')

    expect(blogPosts.body).toHaveLength(initialBloglist.length + 1)
  })

  test('posting blog posts is unsuccessful when token is missing', async () => {

    let newBlogPost =
    {
      title: 'Animals',
      author: 'Greg Wolf',
      url: 'www.animals.fi',
      likes: 78,
    }

    const response = await api.post('/api/blogs').auth('344545', { type: 'bearer' }).send(newBlogPost).expect('Content-Type', /application\/json/)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('invalid token')
  })
})

describe('blog posts should have correct properties', () => {
  test('post objects should have the property named id', async () => {

    const result = await api.get('/api/blogs')
    expect(result.body[0].id).toBeDefined()
  })

  test('when likes property is missing it is saved as 0', async () => {

    const newUser = {
      username: 'TestUser',
      name: 'Test User',
      password: '1234112534543'
    }
    await api.post('/api/users').send(newUser)

    const tokenResponse = await api.post('/api/login').send({ username: newUser.username, password: newUser.password })

    let newBlogPost =
    {
      title: 'BoardGames',
      author: 'Fred Board',
      url: 'www.broadgames.fi',
    }

    const response = await api.post('/api/blogs').auth(tokenResponse.body.token, { type: 'bearer' }).send(newBlogPost).expect('Content-Type', /application\/json/)
    expect(response.body.likes).toBe(0)
  })

  test('when title property the api answers with 400', async () => {

    let newBlogPost =
    {
      author: 'Fred Board',
      url: 'www.broadgames.fi',
      likes: 1234
    }

    const response = await api.post('/api/blogs').send(newBlogPost)
    expect(response.status).toBe(400)
  })

  test('when url property the api answers with 400', async () => {

    let newBlogPost =
    {
      title: 'BoardGames',
      author: 'Fred Board',
      likes: 1234
    }

    const response = await api.post('/api/blogs').send(newBlogPost)
    expect(response.status).toBe(400)
  })
})

describe('deleting blog post', () => {
  test('should respond with the statuscode 204 and remove one post', async () => {

    const newUser = {
      username: 'TestUser',
      name: 'Test User',
      password: '1234112534543'
    }
    await api.post('/api/users').send(newUser)

    const tokenResponse = await api.post('/api/login').send({ username: newUser.username, password: newUser.password })

    let newBlogPost =
    {
      title: 'BoardGames',
      author: 'Fred Board',
      url: 'www.broadgames.fi',
    }

    const response = await api.post('/api/blogs').auth(tokenResponse.body.token, { type: 'bearer' }).send(newBlogPost).expect('Content-Type', /application\/json/)

    const deleteResponse = await api.delete(`/api/blogs/${response.body.id}`).auth(tokenResponse.body.token, { type: 'bearer' })

    expect(deleteResponse.status).toBe(204)

    const getResponse2 = await api.get('/api/users')

    expect(getResponse2.body[0].blogs).toHaveLength(0)
  })

  test('should respond with invalid token', async () => {

    const newUser = {
      username: 'TestUser',
      name: 'Test User',
      password: '1234112534543'
    }
    await api.post('/api/users').send(newUser)

    const tokenResponse = await api.post('/api/login').send({ username: newUser.username, password: newUser.password })

    let newBlogPost =
    {
      title: 'BoardGames',
      author: 'Fred Board',
      url: 'www.broadgames.fi',
    }

    const response = await api.post('/api/blogs').auth(tokenResponse.body.token, { type: 'bearer' }).send(newBlogPost).expect('Content-Type', /application\/json/)
    const deleteResponse = await api.delete(`/api/blogs/${response.body.id}`).auth(tokenResponse.body.token, { type: 'basic' })

    expect(deleteResponse.status).toBe(401)
    expect(deleteResponse.body.error).toBe('invalid token')
  })
})

describe('updating blog post', () => {
  test('should respond with the statuscode 200 and update post', async () => {

    const responseFromGet = await api.get('/api/blogs')

    const blogPosts = responseFromGet.body

    const newBlogPost = {
      likes: 100
    }

    const responseFromUpdate = await api.put(`/api/blogs/${blogPosts[0].id}`).send(newBlogPost)

    expect(responseFromUpdate.status).toBe(200)

    const responseFromGet2 = await api.get('/api/blogs')

    expect(responseFromGet2.body[0].likes).toBe(100)
  })
})

afterAll(() => {
  mongoose.connection.close()
})