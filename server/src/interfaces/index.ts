interface IBurgers {
    id: number;
    client_name: string;
    meat: string;
    bread: string;
    status: string;
}

interface IIngredients {
    id: number;
    ingredient_name: string;
    ingredient_type: string;
    ingredient_id: string;
}

interface IOptionalIngredients {
    id: number;
    ingredient: string;
    order_id: number;
}
interface IOrder extends IBurgers {
    ingredients: string[]

}

interface IConsultsOrder extends IBurgers {
    ingredient: string
}
export type { IBurgers, IIngredients, IOptionalIngredients, IOrder, IConsultsOrder }