
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
export default class Sqlite {
    async createDbConnection(filename: string) {
        return open({
            filename,
            driver: sqlite3.Database
        });
    }
    async connectDb() {
        sqlite3.verbose()
        return await this.createDbConnection('./src/database/database.sqlite');

    }

    async consult(sql: string, binds: any[] = []) {

        const db = await this.connectDb();

        const rows = await db.all(sql, binds);

        return rows
    }


    async insert(sql: string, binds: any[] = []) {


        const db = await this.connectDb()
        const rows = db.run(sql, binds);

        return rows;
    }

}

