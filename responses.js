const execSQLProc = require('./sql').execSQLProc
const getParamsInfo = require('./sql').getParamsInfo
const generateReport = require('./xlFile').generateReport

exports.getResponse = function getResponse(request, response) {
    let paramStr = null
    let procName = null
    if (request.url.startsWith('/commissionReceipts/')) {
        paramStr = request.url.replace('/commissionReceipts/', '')
        procName = 'pCommissions_RecievedLots'
        execSQLProc(procName, getParamsInfo(procName, paramStr), response)
    } else if (request.url.startsWith('/commissionPurchases/')) {
        paramStr = request.url.replace('/commissionPurchases/', '')
        procName = 'pCommissions_PurchaseLots'
        execSQLProc(procName, getParamsInfo(procName, paramStr), response)
    } else if (request.url.startsWith('/commissionConfirmPO/')) {
        paramStr = request.url.replace('/commissionConfirmPO/', '')
        procName = 'pCommissions_ConfirmPO'
        execSQLProc(procName, getParamsInfo(procName, paramStr), response)
    } else if (request.url.startsWith('/report')) {
        let paramStr = request.url.replace('/report/', '')
        // let params = paramStr.split('+')
        let procName = 'pCommissions_Report'
        generateReport(procName, getParamsInfo(procName, paramStr), response)
    } else {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.write(JSON.stringify([
            { url: '/commissionReceipts', operation: 'POST', description: 'Returns Receipts for commissions for the dates requested' },
            { url: '/commissionPurchases', operation: 'POST', description: 'Returns Purchases/Adjustments for commissions for the receipt selected' },
        ]))
        response.end()
    }
}

exports.postResponse = function postResponse(request, response) {
    let requestBody = ''
    request.on('data', function (data) {
        requestBody += data
    })
    request.on('end', function () {
        let params = []
        if (requestBody) {
            params = JSON.parse(requestBody)
        }
        let procName = null
        if (request.url.startsWith('/report')) {
            paramStr = request.url.replace('/report', '')
            procName = 'pCommissions_Report'
            generateReport(procName, getParamsInfo(procName, paramStr), response)
        } else {
            switch (request.url) {
                case '/commissionReceipts':
                    //execSQLProc('pCommissions_RecievedLots', params, response)
                    procName = 'pCommissions_RecievedLots'
                    break
                case '/commissionPurchases':
                    //execSQLProc('pCommissions_PurchaseLots', params, response)
                    procName = 'pCommissions_PurchaseLots'
                    break
                case '/commissionLotInfo':
                    //execSQLProc('pCommissions_LotInfo', params, response)
                    procName = 'pCommissions_LotInfo'
                    break
                case '/commissionConfirmPO':
                    //execSQLProc('pCommissions_ConfirmPO', params, response)
                    procName = 'pCommissions_ConfirmPO'
                    break
                case '/commissionSalespersons':
                    //execSQLProc('pCommissions_Salespersons', params, response)
                    procName = 'pCommissions_Salespersons'
                    break
                case '/commissionDefaults':
                    //execSQLProc('pCommissions_Defaults', params, response)
                    procName = 'pCommissions_Defaults'
                    break
                case '/commissionUpdateRecExp':
                    //execSQLProc('pCommissions_UpdateRecExps', params, response)
                    procName = 'pCommissions_UpdateRecExps'
                    break
                case '/pCommissionsWhsDefaults':
                    //execSQLProc('pCommissions_WhsDefaults', params, response)
                    procName = 'pCommissions_WhsDefaults'
                    break
                case '/commissionInvoice':
                    procName = 'pCommissions_Invoice'
                    break
                case '/commissionsInvInfo':
                    procName = 'pCommissions_InvInfo'
                    break
                case '/commissionsUpdateInvExp':
                    procName = 'pCommissions_UpdateInvExps'
                    break
                case '/commissionConfirmInv':
                    procName = 'pCommissions_ConfirmInv'
                    break
                default:
                    response.writeHead(200, { 'Content-Type': 'application/json' })
                    response.write(JSON.stringify([
                        { url: '/commissionReceipts', operation: 'POST', description: 'Returns Receipts for commissions for the dates requested' },
                    ]))
                    response.end()
                    break
            }
            if (procName) {
                execSQLProc(procName, params, response)
            }
        }
    })
}