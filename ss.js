const port = 4001;
const express = require('express');
const https = require('https')
const cors = require('cors');
const fs = require('fs');
const {Server} = require('socket.io');
const {exec} = require('child_process');

let sslConfig = {
    'key': fs.readFileSync('ss.key'),
    'cert': fs.readFileSync('ss.crt')
}

let corsConfig = {
    origin: "*",
    methods: "GET,POST",
    credential: true
}

const app = express();
app.use(cors(corsConfig));
app.use(express.static('public'));
const serv = https.createServer(sslConfig, app);



serv.listen(port, ()=>{
    console.log("https://localhost:"+port);
  
});

const io = new Server(serv, {
    cors: corsConfig
});

io.on('connection', klient=>{
        klient.on('polecenie', (p1, p2)=>{

        })

        klient.emit('polecenieinne', "ala ma kota");
})

app.get('/netstat', (req, res)=>{

    exec('wmic USERACCOUNT get name, disabled, status', (err, odp, odperr)=>{
        res.send(odp);
    })

})

