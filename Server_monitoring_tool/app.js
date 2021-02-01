const express = require('express');
const app = express();
const  {networkInterfaces}  = require('os');

app.set('view engine', 'ejs');
app.use(express.static('public'));
var port;
var platform,nof,ldavg,totmem,freemem,memusage,memper;
server = app.listen(3009, function () {
    console.log('****************************Server port********************************************\n');
    port=server.address().port;
    console.log(port);
    console.log("\n")
});


console.log('****************************************************************************************');
console.log('                                SERVER MONITORING TOOL                                  ');
console.log('****************************************************************************************\n');
var request=[];
var arr=[];
var start = new Date();




const nets = networkInterfaces();
const results = Object.create(null); // or just '{}', an empty object

for (const name of Object.keys(nets)) {
	for (const net of nets[name]) {
		// skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
		if (net.family === 'IPv4' && !net.internal) {
			if (!results[name]) {
				results[name] = [];
			}

			results[name].push(net.address);
		}
	}
}


console.log("***************************IP Address of Server****************************************\n");
console.log(results);
console.log("\n")

var os=require('os')
var hostname = os.hostname();
console.log('*******************************Connected Host******************************************\n');
console.log(hostname);
console.log('\n');
console.log('***********************************Memory Usage****************************************\n');
var osutils = require('os-utils');

server.bytesReceived = 0;
server.bytesSent = 0;
var units = ['B', 'kB', 'MB', 'TB'];
function simplifiedUnits(input) {
	var unit = units[0];
	var i = 0;
	while (input > 1024 && ++i) {
		unit = units[i];
		input /= 1024;
	}
	return Math.round(input) + ' ' + unit;
}
// var time = process.hrtime();
// var diff = process.hrtime(time)[0] + process.hrtime(time)[1] / 1000000000;
// var bpsSent = Math.round(server.bytesSent / diff) || 0;
// var bpsReceived = Math.round(server.bytesReceived / diff) || 0;
platform = osutils.platform();
console.log('Platform: ' + osutils.platform());
nof = osutils.cpuCount();
console.log('Number of CPUs: ' + osutils.cpuCount());
ldavg = osutils.loadavg(5);
console.log('Load Average (5m): ' + osutils.loadavg(5));
totmem = osutils.totalmem();
console.log('Total Memory: ' + osutils.totalmem() + 'MB');
freemem = osutils.freemem();
console.log('Free Memory: ' + osutils.freemem() + 'MB');
var m = osutils.totalmem() - osutils.freemem();
memusage=m;
console.log('Memory usage: ' + m + 'MB');
memper = osutils.freememPercentage();
console.log('Free Memory (%): ' + osutils.freememPercentage());

console.log('***********************************Server Bandwidth*************************************\n');
var uptime = Math.round(process.uptime());
console.log('Uptime: %ds', Math.round(process.uptime()));
var In = simplifiedUnits(server.bytesReceived);
console.log('In: %s (%s/s)', simplifiedUnits(server.bytesReceived), simplifiedUnits(bpsReceived));
var Out = simplifiedUnits(server.bytesSent);
console.log('Out: %s (%s/s)', simplifiedUnits(server.bytesSent), simplifiedUnits(bpsSent));
console.log("\n");


app.get('/', (req, res, next) => {
	request = req;
	var a = new Date();
	var temp = a - start;
	a = start;
	arr.push(temp);
	console.log('*******************************Server Latency**************************************\n');
	console.log(temp + 'ms');
	console.log('*************************************************************************************');
	var len = arr.length;
	var sum = 0;
	for (var i = 0; i < len; i++) {
		sum = sum + arr[i];
	}
	sum = sum / len;
	console.log('**************************Average Response Time************************************\n');
	console.log(sum);
    console.log('*************************************************************************************');
    
	res.render('Project', { up:uptime,In:In,Out:Out,latency:temp,avglatency:sum,portnum: port, hostname: hostname ,platform: platform,nof:nof,ldavg:ldavg,totmem:totmem,freemem:freemem,memusage:memusage,memper:memper});
});
//bandwidth


