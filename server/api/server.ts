import App from '@/pages/_app';
import express, {Express} from 'express';
import { appendFile } from 'fs';

class APIServer {
	private APIServer: Express;
	private PORT: number;

	constructor(port: number) {
		this.APIServer = express();
		this.PORT = port;
	}

	run(): void {
		this.APIServer.use(express.json()); // allow to accept data in JSON format
		this.APIServer.use(express.urlencoded({extended: true})); // URL-encoded data for dealing with forms
        
        // auth services 

        // user services
        this.APIServer.use('/users', )

	}
}
