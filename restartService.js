const child = require('child_process')

exports.restartService = function restartService(serviceName) {
    child.exec('net stop ' + serviceName, function(err, stopOut, stopErr) {
        if (err) {
            console.log(err)
        } else {
            console.log(stopOut, stopErr)
            child.exec('net start ' + serviceName, function(error, startOut, startErr) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(startOut, startErr)
                }
            })
        }
    })
}