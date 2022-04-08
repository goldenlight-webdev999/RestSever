const sql = require('mssql')
const config = require('./config').SqlConfig

exports.getParamsInfo = function getParamsInfo(procName, paramStr) {
    let paramValues = paramStr.split('?')
    let params = null
    switch (procName) {
        case 'pCommissions_RecievedLots':
            params = [
                {
                    paramName: 'fDate',
                    paramType: 'date',
                    paramValue: paramValues[0]
                },
                {
                    paramName: 'tDate',
                    paramType: 'date',
                    paramValue: paramValues[1]
                }
            ]
            break
        case 'pCommissions_PurchaseLots':
            params = [
                {
                    paramName: 'LotSerial',
                    paramType: 'varchar',
                    paramLength: 15,
                    paramValue: paramValues[0]
                },
                {
                    paramName: 'ItemCode',
                    paramType: 'varchar',
                    paramLength: 30,
                    paramValue: paramValues[0]
                },
                {
                    paramName: 'Whs',
                    paramType: 'varchar',
                    paramLength: 3,
                    paramValue: paramValues[2]
                }
            ]
            break
        case 'pCommissions_ConfirmPO':
            params = [
                {
                    paramName: 'LotSerialNo',
                    paramType: 'varchar',
                    paramLength: 15,
                    paramValue: paramValues[0]
                },
                {
                    paramName: 'ItemCode',
                    paramType: 'varchar',
                    paramLength: 30,
                    paramValue: paramValues[1]
                },
                {
                    paramName: 'Warehouse',
                    paramType: 'varchar',
                    paramLength: 3,
                    paramValue: paramValues[2]
                },
                {
                    paramName: 'Confirm',
                    paramType: 'varchar',
                    paramLength: 1,
                    paramValue: () => paramValues[3]
                },
                {
                    paramName: 'RowsUpdated',
                    paramType: 'int',
                    paramDirection: 'OUTPUT'
                }
            ]
            //console.log(params)
            break
        case 'pCommissions_Report':
            params = [
                {
                    paramName: 'sDate',
                    paramType: 'date',
                    paramValue: paramValues[0]
                },
                {
                    paramName: 'eDate',
                    paramType: 'date',
                    paramValue: paramValues[1]
                }
            ]
            break
        default:
            break
    }
    return params
}

exports.execSQLProc = function execSQLProc(procName, params, response) {
    const conn = new sql.ConnectionPool(config)
    conn.connect().then(function () {
        const request = new sql.Request(conn)
        if (params) {
            params.map(p => {
                switch (p.paramDirection) {
                    case 'OUTPUT':
                        if (p.paramType === 'varchar') {
                            return request.output(p.paramName, sql.VarChar(p.paramLength))
                        } else if (p.paramType === 'date') {
                            return request.output(p.paramName, sql.Date)
                        } else if (p.paramType === 'int') {
                            return request.output(p.paramName, sql.Int)
                        } else if (p.paramType === 'decimal') {
                            return request.input(p.paramName, sql.Decimal(p.paramPrecision, p.paramScale), p.paramValue)
                        }
                        break
                    default:
                        if (p.paramType === 'varchar') {
                            return request.input(p.paramName, sql.VarChar(p.paramLength), p.paramValue)
                        } else if (p.paramType === 'date') {
                            return request.input(p.paramName, sql.Date, p.paramValue)
                        } else if (p.paramType === 'int') {
                            return request.input(p.paramName, sql.Int, p.paramValue)
                        } else if (p.paramType === 'decimal') {
                            return request.input(p.paramName, sql.Decimal(p.paramPrecision, p.paramScale), p.paramValue)
                        }
                        break
                }
            })
        }
        request.execute(procName).then(data => {
            if (procName == 'pCommissions_Report') {
                response(data)
            } else {
                response.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" })
                response.write(JSON.stringify(data))
                response.end()
            }
        }).catch(err => {
            if (procName == 'pCommissions_Report') {
                console.log(err)
            } else {
                //console.log('error reading data')
                response.writeHead(500, 'Internal Error Occured', { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" })
                response.write(JSON.stringify({ data: '500: ' + err }))
                response.end()
            }
        })
    }).catch(function (err) {
        if (procName == 'pCommissions_Report') {
            response(null, err)
        } else {
            //console.log('connection error')
            response.writeHead(500, 'Internal Error Occured', { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" })
            response.write(JSON.stringify({ data: '500: ' + err }))
            response.end()
        }
    })
        .then(() => {
            sql.close()
        })
}