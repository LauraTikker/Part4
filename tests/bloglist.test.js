const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('blog tests', () =>    {
  test('sum of blog likes when there are more than one component', () =>   {
    const blogs = [
      {
        title: String,
        author: String,
        url: String,
        likes: 34
      },
      {
        title: String,
        author: String,
        url: String,
        likes: 12
      }
    ]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(46)
  })

  test('sum of blog likes when there is only one component', () =>   {
    const blogs = [
      {
        title: String,
        author: String,
        url: String,
        likes: 42
      }]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(42)
  })

  test('should return 0, when the list is empty', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })
})

describe('blog post with most likes', () => {
  test('blog post with most likes',() => {
    const listWithMultipleBlogPosts = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 12,
        __v: 0
      },
      {
        id: '5a42992aa71b54a7889676234d17f8',
        title: 'Programming in Java',
        author: 'Peter Downsend',
        url: 'http://www.javaprogramming.html',
        likes: 79,
        __v: 0
      },
      {
        id: '5a422aa71b54a676234d17f8',
        title: 'Programming in Javascript',
        author: 'Eric Clapton',
        url: 'http://www.programming.eu',
        likes: 300,
        __v: 0
      }
    ]

    const result = listHelper.favoriteBlog(listWithMultipleBlogPosts)

    expect(result).toEqual({
      title: 'Programming in Javascript',
      author: 'Eric Clapton',
      likes: 300
    })
  })
})

describe('most popular author', () => {
  test('most popular author', () => {
    const listWithMultipleBlogPosts = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 12,
        __v: 0
      },
      {
        id: '5a42992aa71b54a7889676234d17f8',
        title: 'Programming in Java',
        author: 'Peter Downsend',
        url: 'http://www.javaprogramming.html',
        likes: 79,
        __v: 0
      },
      {
        id: '5a422aa71b54a676234d17f8',
        title: 'Programming in Javascript',
        author: 'Peter Downsend',
        url: 'http://www.programming.eu',
        likes: 300,
        __v: 0
      }
    ]

    const result = listHelper.mostBlogs(listWithMultipleBlogPosts)
    expect(result).toEqual({ author: 'Peter Downsend', blogs: 2 })
  })
})

describe('author with most likes', () => {
  test('author with most likes', () => {
    const listWithMultipleBlogPosts = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 12,
        __v: 0
      },
      {
        id: '5a42992aa71b54a7889676234d17f8',
        title: 'Programming in Java',
        author: 'Peter Downsend',
        url: 'http://www.javaprogramming.html',
        likes: 79,
        __v: 0
      },
      {
        id: '5a422aa71b54a676234d17f8',
        title: 'Programming in Javascript',
        author: 'Peter Downsend',
        url: 'http://www.programming.eu',
        likes: 300,
        __v: 0
      }
    ]

    const result = listHelper.mostLikes(listWithMultipleBlogPosts)
    expect(result).toEqual({ author: 'Peter Downsend', likes: 379 })
  })
})

