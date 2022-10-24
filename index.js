const Axios = require('./services/axios')
const Publisher = require('./services/publisher')
const cron = require('node-cron')
const CONSTANTS = require('./utils/constants')

async function runApp () {
  const axios = new Axios(
    CONSTANTS.BASE_URL,
    CONSTANTS.TOKEN
  )

  const publisher = new Publisher(CONSTANTS.PUBLISHER_EXCHANGE_KEY)
  const connection = await publisher.connect()
  const channel = await publisher.createChannel(connection)

  const instance = axios.getInstance()

  const response = await instance.post('/login/autenticar')
  axios.cookieCredentialsHeader = response.headers.get('set-cookie')
  
  instance.get('posicao/').then(response => {
    publisher.sendMessage(channel, JSON.stringify(response.data))
  })

  //    *         *      *          *           *            *
  // SECONDS, MINUTES, HOURS, DAYS OF MOUNTH, MONTH and DAYS OF WEEK.

  const getBussesByTime = cron.schedule(`*/${CONSTANTS.RUN_EVERY_X_SECONDS} * * * * *`, () => {
    instance.get('posicao/').then(response => {
      publisher.sendMessage(channel, JSON.stringify(response.data))
    })
  })

  getBussesByTime.start()
}

runApp()
