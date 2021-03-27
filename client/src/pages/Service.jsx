import { gql, useQuery } from '@apollo/client'
import { Col, Row } from 'react-bootstrap'
import { SiteRow } from './helpers'
import Loader from 'react-loaders'

const serviceQuery = gql`
  query Services($id: ID!) {
    service(id: $id) {
      id
      name
      url
      order
      state

      uptimeDays(days: 90) {
        date
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
  const { data, loading } = useQuery(serviceQuery, { variables: { id: props.id } })

  return (
    <>
      <h4>Uptime Last 90 days</h4>
      <Row className='mainBox'>
        {loading
          ? <Col className='d-flex justify-content-center'><Loader type='pacman' active /></Col>
          : (
            <Col>
              {data && <SiteRow key={data.service.id} service={data.service} first last />}
            </Col>
            )}
      </Row>

      <Overall data={data} loading={loading} />
      <ResponseTime data={data} loading={loading} />
    </>
  )
}

function Overall (props) {
  const { data, loading } = props

  return (
    <>
      <h4 className='mt-5'>Overall Uptime</h4>
      <Row className='mainBox overall'>
        {loading
          ? <Col className='d-flex justify-content-center'><Loader type='pacman' active /></Col>
          : (
            <>
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
            </>
            )}
      </Row>
    </>
  )
}

function ResponseTime (props) {
  const { data, loading } = props
  return (
    <>
      <h4 className='mt-5'>Response Time Last 2 days </h4>
      <Row className='mainBox overall'>
        <Col style={{ border: 'none' }}>
          <Row>
            {loading
              ? <Col className='d-flex justify-content-center'><Loader type='pacman' active /></Col>
              : (
                <>
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
                </>
                )}
          </Row>
        </Col>
      </Row>
    </>
  )
}
