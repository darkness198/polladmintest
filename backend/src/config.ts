import { ConnectionOptions, Connection, createConnection, getConnection } from "typeorm";
import 'reflect-metadata';
import { triggerAsyncId } from "async_hooks";

export const prod = process.env.NODE_ENV === 'production';



export const config: ConnectionOptions = {
    "type": "postgres",
    "host": "127.0.0.1",
    "port": 54320,
    "username": "postgres",
    "password": "password",
    "database": "testdb4",
    synchronize: true,
    logging: false,
    entities: [
       'dist/entity/**/*.js',
       'dist/entity/*.js'
    ],
 }



export const connect = async (): Promise<Connection> => {

    let connection: Connection = undefined;

    return new Promise(async (resolve, reject) => {

        let attempts = 0;

        while(attempts < 5 && connection === undefined) {    
            console.log('attempt # ' + attempts);        
            try {
                
                connection = await createConnection(config);
            } catch(err) {
                
            }
            console.log('isConnected', Boolean(connection))
            attempts++;
        }
        if(connection) {
            resolve(connection);
        } 
        resolve(undefined);
    })

    


}