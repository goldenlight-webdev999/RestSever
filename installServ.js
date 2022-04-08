var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'RestServer',
  description: 'Node.js web server for SQL with REST APIn for Commissions program',
  script: 'D:\\Sage\\Custom Modules\\RestServer\\app.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=102400'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
  console.log('Install complete.');
  console.log('The service exists: ',svc.exists);
});

svc.install();