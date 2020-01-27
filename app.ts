import express from 'express';
import router from "./router"
import {NotAcceptable} from './errors/Server/NotAcceptable';
import {DatabaseConnection} from './databaseConnection';
import {Express} from 'express-serve-static-core';

const db: DatabaseConnection = new DatabaseConnection();
const app: Express = express()
app.use(express.json())
app.use(router);

app.get('/', (request, response) => {
    response.format({
        html: () => {
            response.redirect('/games')
        },
        json: () => {
            response.send(NotAcceptable)
        }
    })
});

app.get('/*', (request, response) => {
    response.sendFile(`${__dirname}/../assets/${request.path}`)
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})