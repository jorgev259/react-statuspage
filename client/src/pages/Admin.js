
import { useMutation, gql } from '@apollo/client'
import { toast } from 'react-toastify'
import { Col, Form, Button } from 'react-bootstrap'
import serialize from 'form-serialize'

const servicesMutation = gql`
  mutation createService($name: String!, $url: String!, $interval: Float!, $timeout: Float!) {
    createService(name: $name, url: $url, interval: $interval, timeout: $timeout){
      name
    }
  }
`

export default function Admin () {
  const [mutate] = useMutation(servicesMutation)
  function handleSubmitForm (e) {
    const variables = serialize(e.target, { hash: true })
    variables.interval = parseFloat(variables.interval)
    variables.timeout = parseFloat(variables.timeout)

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
        <Col xs='12' md='auto'>
          <Form.Group>
            <Form.Label className='mr-2'>Name:</Form.Label>
            <Form.Control type='text' name='name' required />
          </Form.Group>
        </Col>
        <Col xs='12' md='auto'>
          <Form.Group>
            <Form.Label className='mr-2'>Url:</Form.Label>
            <Form.Control type='text' name='url' required />
          </Form.Group>
        </Col>
      </Form.Row>

      <Form.Row className='w-100 pb-3'>
        <Col xs='12' md='auto'>
          <Form.Group>
            <Form.Label className='mr-2'>Interval:</Form.Label>
            <Form.Control type='number' min={0} defaultValue={5000} name='interval' required />
          </Form.Group>
        </Col>
        <Col xs='12' md='auto'>
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
