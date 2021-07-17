const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { loadFilesSync } = require('@graphql-tools/load-files')
const { mergeTypeDefs } = require('@graphql-tools/merge')
const cookieParser = require('cookie-parser')

require('dotenv').config({ path: '../.env' })
const db = require('./db/startSequelize')

const env = process.env.REACT_APP_ENV || 'production'
const jwt = require('express-jwt')
const port = process.env.PORT || 3005

const server = new ApolloServer({
  uploads: false,
  typeDefs: mergeTypeDefs(loadFilesSync('./graphql/schemas')),
  resolvers: require('./graphql/resolvers'),
  context: ({ req, res }) => ({
    db: db,
    req,
    res,
    user: req.user || null
  }),
  playground: env === 'development' && { endpoint: `http://localhost:${port}/graphql` }
})

const app = express()
app.use(cookieParser())
app.use(
  jwt({
    cache: true,
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false
  })
)

if (env === 'development') {
  app.use(express.static('../dist', { index: false }))
}

// require('./auth')(app, db)

server.applyMiddleware({
  app, path: '/api'
})

const seqConfig = {}
if (process.env.SEQ_SYNC) seqConfig[process.env.SEQ_SYNC] = true

db.sync(seqConfig).then(async () => {
  // require('./requirements')(db)
  // require('./embeds')(app, db)
  require('./startMonitor')(db)

  const listener = app.listen({ port }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${listener.address().port}${
        server.graphqlPath
      }`
    )
  )
})
