import express from 'express';
import router from "./router"
import {NotAcceptable} from './errors/Server/NotAcceptable';
import {DatabaseConnection} from './databaseConnection';
import {Express} from 'express-serve-static-core';
import methodOverride from 'method-override'

const db: DatabaseConnection = new DatabaseConnection();
const app: Express = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(router);
app.set('view engine', 'pug');
app.use(express.static('C:/Users/flori/Desktop/dart_game/assets'));
app.use(methodOverride('_method'))

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