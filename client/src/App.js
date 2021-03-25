
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.min.css'
import './css/global.scss'

import { useRoutes } from 'hookrouter'
import { ToastContainer } from 'react-toastify'
import Cookies from 'js-cookie'
import { HttpLink, ApolloLink, ApolloProvider, ApolloClient, InMemoryCache, from, useQuery, gql } from '@apollo/client'

import Home from './pages/Home'
import Admin from './pages/Admin'
import Service from './pages/Service'

import UserContext from './UserContext'
import { Container, Row, Col } from 'react-bootstrap'

const routes = {
  '/': () => <Home />,
  '/service/:id': ({ id }) => <Service id={id} />,
  '/admin': () => <Admin />
}

const httpLink = new HttpLink({ uri: '/api' })
const authLink = new ApolloLink((operation, forward) => {
  const token = Cookies.get('token')
  if (token) operation.setContext({ headers: { authorization: token } })

  return forward(operation)
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authLink, httpLink])
})

function AppWrapper () {
  const context = { }

  return (
    <ApolloProvider client={client}>
      <UserContext.Provider value={context}>
        <App />
      </UserContext.Provider>
    </ApolloProvider>
  )
}

function App () {
  const { data } = useQuery(gql`query Title{ title }`)
  const routeResult = useRoutes(routes)

  return (
    <>
      <ToastContainer newestOnTop />
      <Container>
        <Row className='my-4 py-2'>
          <Col>
            <h1 className='title'>{data ? data.title : ''}</h1>
          </Col>
        </Row>
        {routeResult || <div />}
      </Container>
    </>
  )
}

export default AppWrapper
