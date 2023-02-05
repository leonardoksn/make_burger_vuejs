import { IConsultsOrder } from "../interfaces";

const SearchProperty = (results: IConsultsOrder[],id : number) => {
    return results.find(item => item.id === id) as IConsultsOrder
}

export {SearchProperty}