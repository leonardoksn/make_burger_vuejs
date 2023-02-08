
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import 'express-async-errors';

import sqlite from './database/db-config.js'
import { IConsultsOrder, IIngredients, IOrder } from './interfaces/index.js';
import { SearchProperty } from './utils/search-property-index.js';
dotenv.config();

const app = express();
app.use(express.json())

app.use(
    cors({
        credentials: true,
        methods: '*',
        origin: true,
    }),
);


const { PORT } = process.env
// respond with "hello world" when a GET request is made to the homepage
app.get('/ingredients', async function (req, res) {

    const db = new sqlite()

    await db.connectDb()

    const results: IIngredients[] = await db.consult("SELECT * FROM INGREDIENTS");

    const keys = [...new Set(results.map(item => item.ingredient_name.toLocaleLowerCase()))]
    const model = keys.map((item => {
        return {
            [item]:
                results
                    .filter(x => x.ingredient_name.toLocaleLowerCase() === item)
                    .map((y) => {
                        return {
                            id: y.ingredient_id,
                            type: y.ingredient_type,
                        }
                    }),
            name: item
        }
    }
    ))

    const ingredients: any = {}

    keys.forEach((k) => {
        ingredients[k] = (model.find(item => k === item.name) as any)[k];
    })

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
app.patch('/burgers/:id', async function (req, res) {

    try {

        const { id } = req.params;
        const { status } = req.body

        if (!id) {
            return res.status(400).send({ message: 'Parâmetros inválidos!' })
        }
        const db = new sqlite()

        await db.connectDb()

        const results = await db.insert(`
        update 
        "BURGERS" 
      set 
        status = ?
      where 
        id = ?
    `, [status, id]);

        if (results.changes) {
            return res.send({ status: "success", message: "Pedido realizado com sucesso!" });
        }
        return res.status(400).send({ status: "failed", message: "Erro ao realizar o pedido" });

    } catch (e) {
        console.log(e)
        return res.status(400).send({ message: 'Erro ao realizar o pedido' })

    }
});// GET method route
app.delete('/burgers/:id', async function (req, res) {

 
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'Parâmetros inválidos!' })
        }
        const db = new sqlite()

        await db.connectDb()

        const results = await db.insert(`
        delete from 
          "BURGERS" 
        where 
          id = ?
    `, [id]);

        if (results.changes) {
            return res.send({ status: "success", message: "Pedido realizado com sucesso!" });
        }
        return res.status(400).send({ status: "failed", message: "Erro ao realizar o pedido" });

    } catch (e) {
        console.log(e)
        return res.status(400).send({ message: 'Erro ao realizar o pedido' })

    }
});// GET method route
app.post('/burger', async function (req, res) {

    try {


        const { name, meat, bread, opcionais, status } = req.body;

        if (!name || !meat || !bread || !opcionais || !status) {
            return res.status(400).send({ message: 'Falta parâmetros' })
        }
        const db = new sqlite()

        await db.connectDb()

        const results = await db.insert(`
    insert into 
  "BURGERS" (
    client_name, 
    meat, 
    bread, 
    status
  )
values
  (
    ?, 
    ?, 
    ?, 
    ?
  )
    `, [name, meat, bread, status]);

        if (results.changes) {
            results.lastID

            const promises = opcionais.map((item: string) =>
                db.insert(`
            insert into 
            "OPTIONAL_INGREDIENTS" (
              ingredient, 
              order_id
            )
          values
            (
              ?, 
             ?
            );
            `, [item, results.lastID])
            )

            const responses = await Promise.allSettled(promises)
            const success = responses.every(item => item.status === 'fulfilled')
            if (success) {
                return res.send({ status: "success", message: "Pedido realizado com sucesso!" });
            }
            return res.status(400).send({ status: "failed", message: "Erro ao realizar o pedido" });


        }
    } catch (e) {
        console.log(e)
        return res.status(400).send({ message: 'Erro ao realizar o pedido' })

    }
});// GET method route


// POST method route

app.listen(PORT, () => {
    console.log(`[HTTP] Server online in http://localhost:${PORT}`)
})


