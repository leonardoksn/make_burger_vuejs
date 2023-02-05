
import express from 'express'
import dotenv from 'dotenv'
import sqlite from './database/db-config.js'
import { IConsultsOrder, IIngredients, IOrder } from './interfaces/index.js';
import { SearchProperty } from './utils/search-property-index.js';
dotenv.config();

const app = express();

const { PORT } = process.env
// respond with "hello world" when a GET request is made to the homepage
app.get('/ingredients', async function (req, res) {

    const db = new sqlite()

    await db.connectDb()

    const results: IIngredients[] = await db.consult("SELECT * FROM INGREDIENTS");

    const ingredients = [...new Set(results.map(item => item.ingredient_name))].map((item => {
        return {
            [item.toLocaleLowerCase()]:
                results
                    .filter(x => x.ingredient_name === item)
                    .map((y) => {
                        return {
                            id: y.ingredient_id,
                            type: y.ingredient_type
                        }
                    })
        }
    }
    ))

    res.send(ingredients);
});// GET method route
app.get('/burgers', async function (req, res) {

    const db = new sqlite()

    await db.connectDb()

    const results: IConsultsOrder[] = await db.consult("SELECT a.id,a.client_name,a.meat,a.bread,a.status,b.ingredient FROM BURGERS A LEFT JOIN OPTIONAL_INGREDIENTS B WHERE A.id = B.order_id");
    const properties: ['client_name', 'meat', 'bread', 'status'] = ['client_name', 'meat', 'bread', 'status']

    const burgers: IOrder[] = [...new Set(results.map((item) => item.id))]

        .map((id) => {
            const data = {} as Omit<IOrder, 'id'>;

            properties.forEach(item => { data[item] = SearchProperty(results, id)[item] });

            return {
                id,
                ...data,
                ingredients: results.filter((item) => item.id === id).map(item => item.ingredient),
            }
        })

    res.send(burgers);
});// GET method route
app.get('/status', async function (req, res) {

    const db = new sqlite()

    await db.connectDb()

    const status: IConsultsOrder[] = await db.consult("SELECT * FROM STATUS");


    res.send(status);
});// GET method route


// POST method route

app.listen(PORT, () => {
    console.log(`[HTTP] Server online in http://localhost:${PORT}`)
})


