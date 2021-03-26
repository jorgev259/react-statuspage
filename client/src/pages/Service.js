import { gql, useQuery } from '@apollo/client'
import { Col, Row } from 'react-bootstrap'
import { SiteRow } from './helpers'

const serviceQuery = gql`
  query Services($id: ID!) {
    service(id: $id) {
      id
      name
      url
      order
      good

      uptimeDays(days: 90) {
        day
        uptime
      }

      uptime1: uptime(days: 1)
      uptime7: uptime(days: 7)
      uptime30: uptime(days: 30)
      uptime90: uptime(days: 90)

      response: responseTime(days: 2){
        avg
        min
        max
      }
    }
  }
`

export default function Home (props) {
  const { data } = useQuery(serviceQuery, { variables: { id: props.id } })

  return (
    <>
      <h4>Uptime Last 90 days</h4>
      <Row className='mainBox'>
        <Col>
          {data && <SiteRow key={data.service.id} service={data.service} first last />}
        </Col>
      </Row>

      <Overall data={data} />
      <ResponseTime data={data} />
    </>
  )
}

function Overall (props) {
  const { data } = props

  return (
    <>
      <h4 className='mt-5'>Overall Uptime</h4>
      <Row className='mainBox overall'>
        <Col>
          <Row className='number'>
            <Col>
              {data && data.service.uptime1.toFixed(3)}%
            </Col>
          </Row>
          <Row className='title'>
            <Col>
              Last 24 hours
            </Col>
          </Row>
        </Col>
        <Col>
          <Row className='number'>
            <Col>
              {data && data.service.uptime7.toFixed(3)}%
            </Col>
          </Row>
          <Row className='title'>
            <Col>
              Last 7 days
            </Col>
          </Row>
        </Col>
        <Col>
          <Row className='number'>
            <Col>
              {data && data.service.uptime30.toFixed(3)}%
            </Col>
          </Row>
          <Row className='title'>
            <Col>
              Last 30 days
            </Col>
          </Row>
        </Col>
        <Col>
          <Row className='number'>
            <Col>
              {data && data.service.uptime90.toFixed(3)}%
            </Col>
          </Row>
          <Row className='title'>
            <Col>
              Last 90 days
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

function ResponseTime (props) {
  const { data } = props
  return (
    <>
      <h4 className='mt-5'>Response Time Last 2 days </h4>
      <Row className='mainBox overall'>
        <Col style={{ border: 'none' }}>
          <Row>
            <Col>
              <Row className='number'>
                <Col>
                  {data && data.service.response.avg.toFixed(2)}ms
                </Col>
              </Row>
              <Row className='title'>
                <Col>
                  Avg. response time
                </Col>
              </Row>
            </Col>
            <Col>
              <Row className='number'>
                <Col>
                  {data && data.service.response.max.toFixed(2)}ms
                </Col>
              </Row>
              <Row className='title'>
                <Col>
                  Max. response time
                </Col>
              </Row>
            </Col>
            <Col>
              <Row className='number'>
                <Col>
                  {data && data.service.response.min.toFixed(2)}ms
                </Col>
              </Row>
              <Row className='title'>
                <Col>
                  Min. response time
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}
