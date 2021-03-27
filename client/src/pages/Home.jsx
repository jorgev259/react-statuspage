import { gql, useQuery } from '@apollo/client'
import { Col, Row } from 'react-bootstrap'
import { SiteRow } from './helpers'
import classnames from 'classnames'

const servicesQuery = gql`
  query Services {
    services {
      id
      name
      url
      order
      state

      uptimeDays(days: 90) {
        date
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

  const allGood = data && data.services.every(r => r.state)
  const allBad = data && data.services.every(r => !r.state)

  return (
    <>
      <Row className={classnames('mainBox', { yellow: !allBad && !allGood, red: allBad, lightgreen: allGood })}>
        <Col className='d-flex align-items-center'>
          <div className='status mr-2' style={{ width: '20px', height: '20px' }} />
          <h2 className='my-auto' style={{ fontWeight: 'bold' }}>
            {!allBad && !allGood
              ? 'Some systems down'
              : (
                  allGood ? 'All systems operational' : 'All systems down'
                )}
          </h2>
        </Col>
      </Row>

      <Row className='mt-5'><h4>Services</h4></Row>
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
              {data && data.uptime7.toFixed(3)}%
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
              {data && data.uptime30.toFixed(3)}%
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
              {data && data.uptime90.toFixed(3)}%
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
