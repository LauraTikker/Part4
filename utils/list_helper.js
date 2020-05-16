const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {

  const likeCounter = (sum, blog) =>  {
    return sum + blog.likes
  }

  return blogs.reduce(likeCounter, 0)
}

const favoriteBlog = (blogs) =>  {

  const likeValues = blogs.map(blog => blog.likes)
  const favoriteBlog = blogs.find(blog => blog.likes === Math.max(...likeValues))

  delete favoriteBlog.id
  delete favoriteBlog.url
  delete favoriteBlog.__v

  return favoriteBlog
}

const mostBlogs = (blogs) =>  {

  const completeAuthorsList = blogs.map(blog => blog.author)

  let uniqueAuthorsList = []

  completeAuthorsList.forEach(author => uniqueAuthorsList.includes(author) ? {} : uniqueAuthorsList.push(author))

  let authorsWithBlogCount = []

  uniqueAuthorsList.forEach(author => {
    const count = blogs.filter(blog => blog.author === author).length
    const object = {
      author : author,
      blogs : count
    }
    authorsWithBlogCount.push(object)
  })

  const listOfBlogCounts = authorsWithBlogCount.map(blogs => blogs.blogs)

  return authorsWithBlogCount.find(author => author.blogs === Math.max(...listOfBlogCounts))
}

const mostLikes = (blogs) => {

  const completeAuthorsList = blogs.map(blog => blog.author)

  let uniqueAuthorsList = []

  completeAuthorsList.forEach(author => uniqueAuthorsList.includes(author) ? {} : uniqueAuthorsList.push(author))

  let authorsWithLikesCount = []

  uniqueAuthorsList.forEach(author => {
    const blogsOfAuthor = blogs.filter(blog => blog.author === author)
    const likes = totalLikes(blogsOfAuthor)

    const object = {
      author : author,
      likes : likes
    }
    authorsWithLikesCount.push(object)
  })

  const listOfLikesCounts = authorsWithLikesCount.map(blogs => blogs.likes)

  return authorsWithLikesCount.find(author => author.likes === Math.max(...listOfLikesCounts))
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}