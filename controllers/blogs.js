const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/users')
const jwt = require('jsonwebtoken')


blogRouter.get('/blogs', async (request, response) => {
  const result = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(result.map(blog => blog.toJSON()))
})

blogRouter.post('/blogs', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    response.status(400).end()
  } else {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (user !== null) {
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes ? body.likes : 0,
        user: user._id
      })

      const result = await blog.save()
      user.blogs = user.blogs.concat(result._id)
      await user.save()

      response.status(201).json(result.toJSON())
    }

    response.status(404).json({ error: 'User not found' })
  }
})

blogRouter.delete('/blogs/:id' , async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else {

    const user = await User.findById(decodedToken.id)

    if (user !== null)  {

      const foundBlog = await Blog.findById(request.params.id)
      if (foundBlog && foundBlog.user.toString() === user._id.toString()) {
        const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
        response.status(204).json(deletedBlog.toJSON()).end()
      } else {
        response.status(404).end()
      }
    }
  }
})

blogRouter.put('/blogs/:id' , async (request, response) => {
  const body = request.body

  const blogPost = {
    likes: body.likes
  }

  const result = await Blog.findByIdAndUpdate(request.params.id, blogPost, { new: true })

  if (result) {
    response.status(200).json(result.toJSON()).end()
  } else {
    response.status(404).end()
  }
})

module.exports = blogRouter