const xl = require('excel4node')
const execSQLProc = require('./sql').execSQLProc

exports.generateReport = function (procName, params, response) {
    execSQLProc(procName, params, function (data, err) {
        if (err) {
            response.writeHead(200, { 'Content-Type': 'application/json' })
            response.write(JSON.stringify([
                { err },
            ]))
            response.end()
        }
        else {
            var fName = 'commissions.xlsx'
            return new Promise(resolve => {
                // setup workbook and sheet
                var wb = new xl.Workbook();
                var options = {
                    pageSetup: {
                        fitToWidth: 1
                    }
                }
                var ws = wb.addWorksheet('Report', options);
                // var numFormat = { numberFormat: '_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)' }
                // var numTotFormat = { font: { bold: true }, numberFormat: '_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)' }
                // var heading = { font: { bold: true, size: 18, }, alignment: { horizontal: 'center', }, }

                // Add a title rows
                let r = 1
                let c = 1
                
                // add data from json
                for (let i = 0; i < data.recordset.length; i++) {
                    if (i === 0) {
                        Object.keys(data.recordset[i]).forEach(x => {
                            ws.cell(r, c).string(x).style({ font: { bold: true, underline: true }, alignment: { horizontal: 'right', } })
                            c += 1
                        })
                        r += 1
                        c = 1
                    }
                    Object.keys(data.recordset[i]).forEach(x => {
                        let NumberFields = ['WeightLbs', 'VerCost', 'Received', 'SalePrice', 'SaleAmount', 'GrossProfit', 'Overhead', 'InvoiceCharge', 'Profit'
                            , 'POCost', 'TruckCost', 'DeliveryCost', 'DropCost', 'StorageCost', 'AllInCost', 'StorageExp', 'ReleaseExp', 'TallyExp', 'DeliveryExp'
                            , 'OtherExp', 'OHDLot', 'LotQuantity', 'SageGP', 'SellCost', 'ExtraCost']
                        if (data.recordset[i][x] == null) { ws.cell(r, c).string('') }
                        else if (x.includes('Date')) {
                            var d= new Date(data.recordset[i][x])
                            d.setDate(d.getDate() + 1)
                            ws.cell(r, c).date(d.toLocaleDateString()).style({ numberFormat: 'm/d/yyyy' })
                        }
                        else if (NumberFields.includes(x)) { ws.cell(r, c).number(data.recordset[i][x]).style({ numberFormat: '0.00' }) }
                        else { ws.cell(r, c).string(data.recordset[i][x].toString()) }
                        c += 1
                    })
                    r += 1
                    c = 1
                }

                resolve(wb)
            }).then(file => {
                file.write(fName, response);
            })
        }
    })
}