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
