const mysql = require("mysql2");

class BaseModel
{
    columns = '*';

    table = '';

    operation ='SELECT ';

    whereConditions = [];

    orWhereConditions = [];

    constructor(table) {
        this.table = table;
    }

    async first() {
        let data = await this.get();
        return data.length ? data[0] : null;
    }

    async value(column) {
        let data = await this.select(column).first();
        return data ? data.column : null;
    }

    async pluckToArray(column){
        const res = [];
        let data = await this.select(column).get();
        data.forEach((item) => {
            res.push(item[column])
        })

        return res;
    }
    select(columns) {
        if (Array.isArray(columns)) {
            this.columns = columns.join(', ');
        } else if (typeof columns === 'string') {
            this.columns = columns;
        }
        return this;
    }
    where() {
        let value;
        let operator;
        const column = arguments[0];
        if (arguments.length === 2 ) {
            operator = '=';
            value = arguments[1];
        } else if (arguments.length === 3) {
            operator = arguments[1];
            value = arguments[2];
        }

        let clause = this.whereConditions.length === 0 ? 'WHERE ' : 'AND ';

        this.saveConditions(clause, column, operator, value)

        return this;
    }

     orWhere() {
        let value;
        let operator;
        const column = arguments[0];
        if (arguments.length === 2 ) {
            operator = '=';
            value = arguments[1];
        } else if (arguments.length === 3) {
            operator = arguments[1];
            value = arguments[2];
        }

        let clause = this.whereConditions.length ? 'OR ' : 'AND ';

        this.saveConditions(clause, column, operator, value)

        return this;
    }

    toSql() {
        return this.buildSelectQuery();
    };

    buildSelectQuery () {
        let query = 'SELECT '+this.columns+' FROM `'+this.table+'` ';

        this.whereConditions.forEach(handler => {
            query = query + '' + handler['0'] + '' + '`'+ handler[1] + '` '+ handler[2] + ' "' + handler[3] +'" ';
        })

        return query;

    }
    saveConditions() {
        this.whereConditions.push(arguments)
    }
    async get() {
        try {
            return await this.execute(this.toSql());
        } catch (error) {
            throw error;
        }
    }
    async execute(query) {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection({
                host : 'localhost',
                user : 'root',
                password : '9090',
                database : 'next'
            });

            connection.connect((err) => {
                if(err) reject(err);
            })

            connection.execute(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            })

            connection.end();
        })
    }
}



module.exports = BaseModel;