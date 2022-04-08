const http = require('http')
const schedule = require('node-schedule')
const getResponse = require('./responses').getResponse
const postResponse = require('./responses').postResponse
// const restartService = require('./restartService').restartService

http.createServer(function (request, response) {
    switch (request.method) {
        case 'OPTIONS':
            response.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" })
            response.end()
            break;
        case 'GET':
            getResponse(request, response)
            break;
        case 'POST':
            postResponse(request, response)
            break;
    }
}).listen(9001, function () {
    console.log('listening on 9001')
})

// const restartServices = schedule.scheduleJob('0 0 4 * * *', function (fireTime) {
//     console.log(fireTime)
//     restartService('sqlrestserver.exe')
//     restartService('MSSQL$SAGE2020')
// })