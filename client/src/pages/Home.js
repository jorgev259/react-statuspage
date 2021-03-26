import { gql, useQuery } from '@apollo/client'
import { Col, Row } from 'react-bootstrap'
import { SiteRow } from './helpers'

const servicesQuery = gql`
  query Services {
    services {
      id
      name
      url
      order
      good

      uptimeDays(days: 90) {
        day
        uptime
      }
    }
  }
`

const overallQuery = gql`
  query Overall {
    uptime1: uptime(days: 1)
    uptime7: uptime(days: 7)
    uptime30: uptime(days: 30)
    uptime90: uptime(days: 90)
  }
`

export default function Home () {
  const { data } = useQuery(servicesQuery)

  return (
    <>
      <Row><h4>Services</h4></Row>
      <Row className='mainBox'>
        <Col>
          {data && data.services.map((service, i) => (
            <SiteRow key={service.id} service={service} first={i === 0} last={i === data.services.length - 1} nameFlag />
          ))}
        </Col>
      </Row>

      <Overall />
    </>
  )
}

function Overall () {
  const { data } = useQuery(overallQuery)

  return (
    <>
      <Row><h4 className='mt-5'>Overall Uptime</h4></Row>
      <Row className='mainBox overall'>
        <Col>
          <Row className='number'>
            <Col>
              {data && data.uptime1.toFixed(3)}%
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
              {data && data.uptime7.toFixed(3)}
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
              {data && data.uptime30.toFixed(3)}
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
              {data && data.uptime90.toFixed(3)}
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
