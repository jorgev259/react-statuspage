
import { useMutation, gql, useQuery } from '@apollo/client'
import { toast } from 'react-toastify'
import { Col, Form, Button, Row, FormGroup } from 'react-bootstrap'
import serialize from 'form-serialize'
import Cookies from 'js-cookie'
import { useEffect, useState, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const servicesMutation = gql`
  mutation createService($name: String!, $url: String!, $interval: Float!, $timeout: Float!, $ping: Boolean!) {
    createService(name: $name, url: $url, interval: $interval, timeout: $timeout, ping: $ping){
      name
    }
  }
`

const updateMutation = gql`
  mutation updateService($id: ID!, $options: ServiceUpdateOptions!) {
    updateService(id:$id, options: $options){
      id
      name
    }
  }
`

const orderMutation = gql`
  mutation updateOrder($id: ID!, $destination: Int!) {
    updateOrder(id:$id, destination: $destination)
  }
`

const servicesQuery = gql`
  query Services {
    services {
      id
      name
      url
      interval
      timeout
      order
      ping
      state
    }
  }
`

export default function Admin () {
  const [logged, setLogged] = useState(false)
  const { data, refetch } = useQuery(servicesQuery, { fetchPolicy: 'network-only' })
  const props = { data, refetch }

  if (!logged) return <LoginForm setLogged={setLogged} />

  return (
    <>
      <AdminForm />
      {data && (
        <>
          <EditService {...props} />
          <EditOrder {...props} />
        </>
      )}
    </>
  )
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

function EditService ({ data, refetch }) {
  const [mutate] = useMutation(updateMutation)
  const services = [...data.services].sort((a, b) => a.id - b.id)
  const [item, setItem] = useState(services[0])
  const formRef = useRef(null)

  useEffect(() => formRef.current.reset(), [item])

  function handleSubmitForm (e) {
    e.preventDefault()
    e.persist()

    const variables = serialize(e.target, { hash: true })
    variables.interval = parseFloat(variables.interval)
    variables.timeout = parseFloat(variables.timeout)
    variables.ping = variables.ping === 'on'

    for (const key of Object.keys(variables)) {
      if (item[key] === variables[key]) delete variables[key]
    }

    if (Object.keys(variables).length === 0) return

    mutate({ variables: { id: item.id, options: variables } }).then(result => {
      toast.success(`Updated service "${result.data.updateService.name}" succesfully!`)
      e.target.reset()
      setTimeout(() => refetch(), 10 * 1000)
    }).catch(err => {
      console.log(err)
      toast.error(err.message, { autoclose: false })
    })
  }

  return (
    <div className='mainBox p-4 mt-3'>
      <Form.Row className='w-100'>
        <Col xs='12'>
          <Form.Group>
            <Form.Control as='select' onChange={ev => setItem(services.find(s => s.id === ev.target.value))}>
              {services.map(s => <option key={s.id} value={s.id}>{`(${s.id}) ${s.name}`}</option>)}
            </Form.Control>
          </Form.Group>
        </Col>
      </Form.Row>

      <Form inline className='mt-2' onSubmit={handleSubmitForm} ref={formRef}>
        <Form.Row className='w-100 pb-3'>
          <Col xs='12' md='4'>
            <Form.Group>
              <Form.Label className='mr-2'>Name:</Form.Label>
              <Form.Control type='text' name='name' required defaultValue={item.name} />
            </Form.Group>
          </Col>
          <Col xs='12' md='4'>
            <Form.Group>
              <Form.Label className='mr-2'>Url:</Form.Label>
              <Form.Control type='text' name='url' required defaultValue={item.url} />
            </Form.Group>
          </Col>
          <Col xs='12' md='4'>
            <Form.Group>
              <Form.Label className='mr-2'>Ping mode:</Form.Label>
              <Form.Control type='checkbox' name='ping' defaultChecked={item.ping} />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row className='w-100'>
          <Col xs='12' md='4'>
            <Form.Group>
              <Form.Label className='mr-2'>Interval:</Form.Label>
              <Form.Control type='number' min={0} name='interval' required defaultValue={item.interval} />
            </Form.Group>
          </Col>
          <Col xs='12' md='4'>
            <Form.Group>
              <Form.Label className='mr-2'>Timeout:</Form.Label>
              <Form.Control type='number' min={0} name='timeout' required defaultValue={item.timeout} />
            </Form.Group>
          </Col>
          <Col xs='auto'>
            <Button type='submit'>
              Update Service
            </Button>
          </Col>
        </Form.Row>
      </Form>
    </div>
  )
}

function EditOrder ({ data, refetch }) {
  const [update] = useMutation(orderMutation)
  const services = [...data.services].sort((a, b) => a.order - b.order)

  const grid = 8

  const getItemStyle = (isDragging, draggableStyle) => ({
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    ...draggableStyle
  })

  const getListStyle = isDraggingOver => ({ padding: grid })

  function onDragEnd (result) {
    if (!result.destination) return
    update({ variables: { id: result.draggableId, destination: result.destination.index } })
      .then(() => toast.success('Update succesful!'))
      .catch(error => {
        console.log(error)
        toast.error('Update failed')
      })
      .finally(refetch)
  }

  return (
    <div className='row mainBox py-0 px-0 mt-3'>
      <div className='col px-0'>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='droppable'>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps || {}}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {services.map(s => (
                  <Draggable key={s.id} draggableId={s.id} index={s.order}>
                    {(provided, snapshot) => (
                      <div
                        className='w-100 py-3 px-4 orderRow' key={s.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps ? provided.draggableProps.style : {}
                        )}
                      >
                        <h5 className='d-inline align-middle'>{s.name}</h5>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}
