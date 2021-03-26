import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Interval, DateTime } from 'luxon'
import classnames from 'classnames'
import { A } from 'hookrouter'

export default function getColor (value) {
  let color = ''

  if (value !== null) {
    color = 'green'
    if (value < 99) color = 'lightgreen'
    if (value < 95) color = 'yellow'
    if (value < 90) color = 'red'
  }
  return color
}

function days (interval) {
  let day = interval.start.startOf('day')
  const end = interval.end.endOf('day')
  const result = []

  while (day < end) {
    result.push(day.toISODate())
    day = day.plus({ days: 1 })
  }

  return result
}

export function SiteRow ({ first, last, service, nameFlag = false }) {
  const { name, uptimeDays, good } = service

  const values = uptimeDays.map(r => r.uptime)
  const avg = values.reduce((p, c) => p + c, 0) / values.length

  const daysArray = days(Interval.fromDateTimes(DateTime.now().minus({ days: 89 }), DateTime.now()))

  return (
    <Row className={classnames('infoRow', { first, 'pt-4': !first, 'pb-4': !last })}>
      <Col>
        <Row className='info'>
          <Col className='pl-0'>
            {nameFlag && (
              <>
                <A href={`/service/${service.id}`}><span style={{ color: 'white' }}>{name}</span></A>
                <span className='mx-1'>|</span>
              </>
            )}
            <span className={getColor(avg)}>{avg.toFixed(2)}%</span>
          </Col>
          <Col xs='auto' className={classnames('d-flex align-items-center pr-0', { lightgreen: good, red: !good })}>
            <div className='status mx-1' style={{ width: '20px', height: '20px' }} />
            <span>{good ? 'Operational' : 'Down'}</span>
          </Col>
        </Row>
        <Row className='flex-nowrap mt-3 justify-content-end'>
          {daysArray.map(date => {
            const row = uptimeDays.find(r => r.day === date)
            return <Tick key={date} day={date} value={row ? row.uptime : null} />
          })}
        </Row>
      </Col>
    </Row>
  )
}

export function Tick ({ value, day }) {
  const color = getColor(value)

  return (
    <OverlayTrigger
      placement='top'
      overlay={
        <Tooltip>
          {day}
          <br />
          {value ? value.toFixed(2) : ''}%
        </Tooltip>
      }
    >
      <Col className='tick px-0'>
        <div className={color} />
      </Col>
    </OverlayTrigger>
  )
}
