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

klienci = [];

serv.listen(port, ()=>{
    console.log("https://localhost:"+port);
  
});

const io = new Server(serv, {
    cors: corsConfig
});

io.on('connection', klient=>{
        klient.on('polecenie', (p1, p2)=>{

        })

        // dodaj polecenie w socketio
        klient.on('disconnect', ()=>{
             let x = klienci.filter((v)=>v.id==klient.id)[0];
                if(x){
                    x.active = false;
                    x.time = Date.now().getTime()+300000;
                }

            console.log("rozłączono", klient.id);
            io.emit('klients', klienci);
        })

        klient.on('klik', (id)=>{

            let x = klienci.filter((v)=>v.id==id)[0];
            if(x){
                x.kliki++;
            }
            io.emit('klients', klienci);
        });

        klient.on('klucz', (id)=>{
          let x = klienci.filter((v)=>v.id==id)[0];
          if(x){
            x.sockerid = klient.id;
            x.active = true;
            x.Date = 0;
          } else
          klienci.push({id: id, socketid: klient.id, kliki: 0, active: true, time:0});  
          io.emit('klients', klienci);     
        });

        klient.emit('polecenieinne', "ala ma kota");
})

app.get('/netstat', (req, res)=>{

    exec('wmic USERACCOUNT get name, disabled, status', (err, odp, odperr)=>{
        res.send(odp);
    })

})

