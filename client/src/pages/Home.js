import { gql, useQuery } from '@apollo/client'
import classnames from 'classnames'
import { Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { A } from 'hookrouter'

const servicesQuery = gql`
  query Services {
    services {
      id
      name
      url
      order

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
      <h4>Uptime Last 90 days</h4>
      <Row className='mainBox'>
        <Col>
          {data && data.services.map((service, i) => (
            <SiteRow key={service.id} service={service} first={i === 0} last={i === data.services.length - 1} />
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
      <h4 className='mt-5'>Overall Uptime</h4>
      <Row className='mainBox overall' style={{ marginBottom: '200px' }}>
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

function getColor (value) {
  let color = ''

  if (value !== null) {
    color = 'green'
    if (value < 99) color = 'lightgreen'
    if (value < 95) color = 'yellow'
    if (value < 90) color = 'red'
  }
  return color
}

function SiteRow ({ first, last, service }) {
  const { name, uptimeDays } = service

  const values = uptimeDays.map(r => r.uptime)
  const avg = values.reduce((p, c) => p + c, 0) / values.length

  return (
    <Row className={classnames('infoRow', { first, 'pt-4': !first, 'pb-4': !last })}>
      <Col>
        <Row className='info'>
          <Col className='pl-0'>
            <A href={`/service/${service.id}`}><span style={{ color: 'white' }}>{name}</span></A>
            <span className='mx-1'>|</span>
            <span className={getColor(avg)}>{avg.toFixed(2)}%</span>
          </Col>
          <Col xs='auto pr-0 lightgreen'>
            <span>Operational</span>
          </Col>
        </Row>
        <Row className='flex-nowrap mt-3 justify-content-end'>
          {uptimeDays.map(r => <Tick key={r.day} day={r.day} value={r.uptime} />)}
        </Row>
      </Col>
    </Row>
  )
}

function Tick (props) {
  const value = props.value
  const color = getColor(value)

  return (
    <OverlayTrigger
      placement='top'
      overlay={
        <Tooltip>
          {props.day}
          <br />
          {value.toFixed(2)}%
        </Tooltip>
      }
    >
      <Col className='tick px-0'>
        <div className={color} />
      </Col>
    </OverlayTrigger>
  )
}
