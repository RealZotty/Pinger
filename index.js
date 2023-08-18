const { mail } = require('./mailer')
const { tcpPingPort } = require('tcp-ping-port');
const winston = require('winston')
const CronJob = require('cron').CronJob;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'MM-DD-YYYY HH:mm:ss',
        }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'ping.log'})
    ],
})

const { hosts, ports } = require('./config.json')

const job = new CronJob(
    '*/30 * * * *',
    function() {
        hosts.map((x) => {
            ports.map((z) => {
                tcpPingPort(x, z).then(res => {
                    if(res.online === false) {
                        logger.log({
                            level: 'error',
                            port: z,
                            host: x,
                            online: res.online,
                        })
                        let msg = {
                            subject: `${x}:${z} is offline.`,
                            msg: `Rew1nd Pinger has detected that host ${x} on port ${z} is offline.`
                        }
                        mail(msg)
                    } else if(res.online === true) {
                        logger.log({
                            level: 'info',
                            port: z,
                            host: x,
                            online: res.online,
                        })
                    }
                })
            })
        })
    },
    null,
	true,
	'America/New_York'
)

job.start()