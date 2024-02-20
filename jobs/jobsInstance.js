import Bree from 'bree'

//@desc define instance bree - scheduler
const jobInstance = new Bree({
  jobs: [
    {
      name: 'sendMessage',
      cron: '* * * * *',
      worker: {
        workerData: {
          description: 'This job will send emails.',
        },
      },
      timeout: 30000,
      retries: 5,
      // onError: (error) => {
      //   console.error(`schedule is error, message :  ${error.message}`)
      // },
      // onComplete: () => {
      //   console.log(`scheduler is complete`)
      // },
    },
  ],
})

export default jobInstance
