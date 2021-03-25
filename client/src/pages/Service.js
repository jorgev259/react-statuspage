import { gql, useQuery } from '@apollo/client'
import classnames from 'classnames'
import { Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap'
// import { A } from 'hookrouter'

import getColor from './helpers'

const serviceQuery = gql`
  query Services($id: ID!) {
    service(id: $id) {
      id
      name
      url
      order

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

function SiteRow ({ first, last, service }) {
  const { uptimeDays } = service

  const values = uptimeDays.map(r => r.uptime)
  const avg = values.reduce((p, c) => p + c, 0) / values.length

  return (
    <Row className={classnames('infoRow', { first, 'pt-4': !first, 'pb-4': !last })}>
      <Col>
        <Row className='info'>
          <Col className='pl-0'>
            <span className={getColor(avg)}>{avg.toFixed(2)}%</span>
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
