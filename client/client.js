const zeromq = require('zeromq');

export class ClientServer{
    
    constructor(port){
        
        this.startClient(port);
        this.simulos = [];
        this.serverShuttingDown = false;
    }

    ab2str(buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }

    async startClient(port){
        console.log('connecting to python server...')
        this.socket = new zeromq.Request();
        this.socket.connect('tcp://127.0.0.1:' + port.toString());
        await this.socket.send('CLIENT_ONLINE');
        console.log('testing connection...')
        var [result] = this.ab2str(await this.socket.receive());
            //TODO: add error handling here
        console.log(result);
        if (result == 'CONNECTION_SUCCESSFUL'){console.log('connected to server.')}
    }

    async startSimulo(path){
        var newSimuloCreated = false;

        await this.socket.send('NEW_SIMULO:' + path);
        console.log('starting new simulo from path:' + path)
        
        var [result] = this.ab2str(await this.socket.receive());

        //TODO: add error handling here for invalid names?

        if (result.includes('NEW_SIMULO_NAME:')){
            console.log(result);
            var simuloName = result.split(':');
            this.simulos.push(simuloName);
            newSimuloCreated = true;
        }
    }

    async disconnectServer(){ //not called yet... need to find where/when/how to execute
        console.log('client closing.')
        await this.socket.send('CLIENT_OFFLINE');
        var [result] = this.ab2str(await this.socket.receive());
        if (result.includes('SERVER_SHUTTING_DOWN:')){
            this.serverShuttingDown = true;
        }
    }
}