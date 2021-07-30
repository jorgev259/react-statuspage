
import { useMutation, gql } from '@apollo/client'
import { toast } from 'react-toastify'
import { Col, Form, Button, Row, FormGroup } from 'react-bootstrap'
import serialize from 'form-serialize'
import Cookies from 'js-cookie'
import { useState } from 'react'

const servicesMutation = gql`
  mutation createService($name: String!, $url: String!, $interval: Float!, $timeout: Float!, $ping: Boolean!) {
    createService(name: $name, url: $url, interval: $interval, timeout: $timeout, ping: $ping){
      name
    }
  }
`

export default function Admin () {
  const [logged, setLogged] = useState(false)
  return logged ? <AdminForm /> : <LoginForm setLogged={setLogged} />
}

function LoginForm ({ setLogged }) {
  const query = gql`
  mutation Login($key: String!){
    login(key: $key)
  }
`
  const [login, { loading }] = useMutation(query)
  const loader = ''

  function submit (e) {
    e.persist()
    e.preventDefault()
    const variables = serialize(e.target, { hash: true })

    login({ variables }).then(result => {
      toast.success('Logged in succesfully!')
      Cookies.set('token', result.data.login, { sameSite: 'Lax' })
      setLogged(true)
    }).catch(error => {
      console.log(error)
      toast.error(error.graphQLErrors[0].message, { autoclose: false })
    })
  }

  return (
    <Form onSubmit={submit}>
      <Row>
        <Col md={4} className='mx-auto'>
          <Row>
            <Col>
              <FormGroup>
                <label htmlFor='key'>Access Key:</label>
                <input className='ml-2' required type='password' name='key' />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col>
              <Button type='submit' className='w-100' color='primary'>{loading ? <img src={loader} alt='loading' /> : 'Login'}</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  )
}

function AdminForm () {
  const [mutate] = useMutation(servicesMutation)
  function handleSubmitForm (e) {
    const variables = serialize(e.target, { hash: true })
    variables.interval = parseFloat(variables.interval)
    variables.timeout = parseFloat(variables.timeout)
    variables.ping = variables.ping === 'on'

    mutate({ variables }).then(result => {
      toast.success(`Added service "${result.data.createService.name}" succesfully!`)
      e.target.reset()
    }).catch(err => {
      console.log(err)
      toast.error(err.message, { autoclose: false })
    })

    e.preventDefault()
    e.persist()
  }

  return (
    <Form inline className='mainBox p-4' onSubmit={handleSubmitForm}>
      <Form.Row className='w-100 pb-3'>
        <Col xs='12' md='4'>
          <Form.Group>
            <Form.Label className='mr-2'>Name:</Form.Label>
            <Form.Control type='text' name='name' required />
          </Form.Group>
        </Col>
        <Col xs='12' md='4'>
          <Form.Group>
            <Form.Label className='mr-2'>Url:</Form.Label>
            <Form.Control type='text' name='url' required />
          </Form.Group>
        </Col>
        <Col xs='12' md='4'>
          <Form.Group>
            <Form.Label className='mr-2'>Ping mode:</Form.Label>
            <Form.Control type='checkbox' name='ping' />
          </Form.Group>
        </Col>
      </Form.Row>

      <Form.Row className='w-100 pb-3'>
        <Col xs='12' md='4'>
          <Form.Group>
            <Form.Label className='mr-2'>Interval:</Form.Label>
            <Form.Control type='number' min={0} defaultValue={5000} name='interval' required />
          </Form.Group>
        </Col>
        <Col xs='12' md='4'>
          <Form.Group>
            <Form.Label className='mr-2'>Timeout:</Form.Label>
            <Form.Control type='number' min={0} defaultValue={3000} name='timeout' required />
          </Form.Group>
        </Col>
        <Col xs='auto'>
          <Button type='submit'>
            Add Service
          </Button>
        </Col>
      </Form.Row>
    </Form>
  )
}
