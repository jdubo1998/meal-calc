import * as SQLite from 'expo-sqlite';
import { Milk, ProteinPowder, ReceiptMilk, LogMilk, Bacon, ReceiptProteinPowder, LogBacon } from '../../test/Testitems';

export const fatGoal = 55;
export const carbGoal = 145;
export const protGoal = 150;

export interface Item {
    id: number | null,
    name: string,
    brand: string | null,
    pantry_id: number | null,
    unit_type: number,
    serv_qty: number | null,
    serv_unit: string | null,
    serv_off: number,
    serv_crit: number | null,
    weight_qty: number | null,
    weight_unit: string | null,
    weight_off: number,
    weight_crit: number | null,
    vol_qty: number | null,
    vol_unit: string | null,
    vol_off: number,
    vol_crit: number | null,
    cals: number,
    prot: number,
    carbs: number,
    fats: number,
    sat_fat: number,
    cholest: number,
    sodium: number,
    fiber: number,
    sugar: number
}

export interface LogItem {
    id: number | null,
    source: number,
    item_id: number,
    qty: number,
    unit: string | null,
    meal: number | null,
    date_ns: number
}

export interface Receipt {
    id: number | null,
    source: number,
    store: string,
    item_id: number,
    qty: number,    
    unit: string,
    price: number,
    tax_mult: number,
    date_ms: number
}

export interface Pantry {
    id: number | null,
	name: string
}

const dateMs = (dateNs: number) => {
    return Number(dateNs);
}

class DataManager {
    public readonly db: SQLite.SQLiteDatabase;
    public static instance: DataManager;

    private constructor() {
        // this.db = SQLite.openDatabase('meal_calc');
        this.db = SQLite.openDatabaseSync('meal_calc', undefined);
    }

    public async createTables() {
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS "meal_log" (
                "id"	INTEGER NOT NULL DEFAULT -1,
                "source"	INTEGER NOT NULL,
                "item_id"	INTEGER NOT NULL DEFAULT -1,
                "qty"	REAL NOT NULL,
                "unit"	VARCHAR(20),
                "meal"	INTEGER,
                "date_ns"	INTEGER NOT NULL
            );
        `);
        console.log('Create meal_log Table');

        await this.db.runAsync(`
            CREATE TABLE IF NOT EXISTS "item" (
                "id"	INTEGER,
                "name"	VARCHAR(50) NOT NULL,
                "brand"	VARCHAR(50),
                "pantry_id"	INTEGER,
                "unit_type"	INTEGER NOT NULL DEFAULT 0,
                "serv_qty"	INTEGER,
                "serv_unit"	VARCHAR(20),
                "serv_off"	REAL DEFAULT 0,
                "serv_crit"	INTEGER,
                "weight_qty"	REAL,
                "weight_unit"	VARCHAR(20),
                "weight_off"	REAL DEFAULT 0,
                "weight_crit"	INTEGER,
                "vol_qty"	REAL,
                "vol_unit"	VARCHAR(20),
                "vol_off"	REAL DEFAULT 0,
                "vol_crit"	INTEGER,
                "cals"	REAL DEFAULT 0,
                "prot"	REAL DEFAULT 0,
                "carbs"	REAL DEFAULT 0,
                "fats"	REAL DEFAULT 0,
                "sat_fat"	REAL DEFAULT 0,
                "cholest"	REAL DEFAULT 0,
                "sodium"	REAL DEFAULT 0,
                "fiber"	REAL DEFAULT 0,
                "sugar"	REAL DEFAULT 0,
                PRIMARY KEY("id")
            );
        `);
        console.log('Create item Table');

        await this.db.runAsync(`
            CREATE TABLE IF NOT EXISTS "receipt" (
                "id"	INTEGER NOT NULL DEFAULT -1,
                "source"	INTEGER NOT NULL,
                "store"	VARCHAR(50),
                "item_id"	INTEGER NOT NULL,
                "qty"	REAL NOT NULL,
                "unit"	VARCHAR(20),
                "price"	REAL NOT NULL,
                "tax_mult"	INTEGER NOT NULL DEFAULT 1,
                "date_ms"	INTEGER NOT NULL
            );
        `);
        console.log('Create receipt Table');

        await this.db.runAsync(`
            CREATE TABLE IF NOT EXISTS "pantry" (
                "id"	INTEGER,
                "name"	VARCHAR(30),
                PRIMARY KEY("id")
            );
        `);
        console.log('Create pantry Table');

        console.log();
        console.log();
        console.log();
    }

    public async resetTestTables(table: string) {
        console.log('***   Resetting Tables   ***');

        console.log(`* Reset ${table} *`);
        await this.db.runAsync(`DROP TABLE IF EXISTS ${table}`);
        
        await this.createTables();

        if (table == 'item') {
            this.insertInto('item', Milk);
            this.insertInto('item', ProteinPowder);
            this.insertInto('item', Bacon);
        } else if (table == 'receipt') {
            this.insertInto('receipt', ReceiptMilk);
            this.insertInto('receipt', ReceiptProteinPowder);
        } else if (table == 'meal_log') {
            this.insertInto('meal_log', LogMilk);
            this.insertInto('meal_log', LogBacon);
        }
    }

    public async insertInto(table: string, obj: any) {
        var query = `INSERT INTO ${table} (`
        var columns = '';
        var values = '';

        for (const key in obj) {
            if (obj[key] != null) {
                columns += key + ', '
                if (typeof obj[key] == 'string') {
                    values += '"' + obj[key] + '", '
                } else {
                    values += obj[key] + ', '
                }
            }
        }

        query = `${query}${columns.substring(0, columns.length-2)}) VALUES (${values.substring(0, values.length-2)})`

        const result = await this.db.runAsync(query);
        console.log(result);
    }

    public async updateRecord(table: string, obj: any, id: number) {
        var query = `UPDATE ${table} SET `
        var updates = '';

        for (const key in obj) {
            if (obj[key] != null) {
                if (typeof obj[key] == 'string') {
                    updates += key + '="' + obj[key] + '", '
                } else {
                    updates += key + "=" + obj[key] + ', '
                }
            }
        }

        query = `${query}${updates.substring(0, updates.length-2)} WHERE id=${id}`;

        const result = await this.db.runAsync(query);
        console.log(result);
    }

    public async updateLogItem(oldItem: any, newItem: any) {
        var query = `UPDATE meal_log SET `
        var updates = '';

        for (const key in newItem) {
            if (newItem[key] != null) {
                if (typeof newItem[key] == 'string') {
                    updates += key + '="' + newItem[key] + '", '
                } else {
                    updates += key + "=" + newItem[key] + ', '
                }
            }
        }

        query = `${query}${updates.substring(0, updates.length-2)} WHERE id=${oldItem.id} AND item_id=${oldItem.item_id}`;

        const result = await this.db.runAsync(query);
        console.log(result);
    }

    public async printTable(table: string) {
        console.log('***   ' + table + '   ***');
        
        for await (const row of this.db.getEachAsync(`SELECT * FROM ${table}`)) {
            console.log(row);
        }

        console.log();
    }

    /**
     * @param item
     * 
     * Adds the given item to the meal_log table.
     */
    public async addItem(item: Item) {
        const query = `INSERT INTO item (
            name,
            brand,
            pantry_id,
            serv_qty,
            serv_unit,
            serv_off,
            serv_crit,
            weight_qty,
            weight_unit,
            weight_off,
            weight_crit,
            vol_qty,
            vol_unit,
            vol_off,
            vol_crit,
            cals,
            prot,
            carbs,
            fats,
            sat_fat,
            cholest,
            sodium,
            fiber,
            sugar
        ) VALUES (
            "${item.name}",
            "${item.brand}",
            ${item.pantry_id},
            ${item.serv_qty},
            "${item.serv_unit}",
            ${item.serv_off},
            ${item.serv_crit},
            ${item.weight_qty},
            "${item.weight_unit}",
            ${item.weight_off},
            ${item.weight_crit},
            ${item.vol_qty},
            "${item.vol_unit}",
            ${item.vol_off},
            ${item.vol_crit},
            ${item.cals},
            ${item.prot},
            ${item.carbs},
            ${item.fats},
            ${item.sat_fat},
            ${item.cholest},
            ${item.sodium},
            ${item.fiber},
            ${item.sugar}
        );`;
        const result = await this.db.execAsync(query);

        console.log(result);
    }

    /**
     * @param year The year of logged item.
     * @param month The month of logged item.
     * @param day The day of the logged item.
     * @param meal The meal type. (0 - Breakfast, 1 - Lunch, 2 - Dinner, 3 - Snack)
     * @returns A log ID for the meal item using the date and meal.
     */
    public logId(year: number, month: number, day: number, meal: number): number {
        return Number.parseInt(`${year}${`${month}`.padStart(2, '0')}${`${day}`.padStart(2, '0')}${meal}`);
    }

    /**
     * @param year The year of logged item.
     * @param month The month of logged item.
     * @param day The day of the logged item.
     * @returns The meal items logged for a given date.
     */
    public async getLogItemsDate(year: number, month: number, day: number) {
        const id1 = this.logId(year, month, day, 1);
        const id4 = this.logId(year, month, day, 4);

        const logQuery = `
            SELECT item.id, meal_log.meal, item.name, meal_log.qty, ROUND(receipt.price/receipt.qty, 2) as price, item.cals, item.carbs, item.fats, item.prot, meal_log.date_ns FROM meal_log
            JOIN item
            ON meal_log.item_id = item.id
            LEFT JOIN receipt
            ON receipt.item_id = item.id
            WHERE meal_log.id >= ${id1} AND meal_log.id <= ${id4};
        `

        const allRows = await this.db.getAllAsync(logQuery);
        return allRows;
    }

    /**
     * @param name The name of the logged item.
     * @param meal The meal type. (0 - Breakfast, 1 - Lunch, 2 - Dinner, 3 - Snack) 
     * @param cals The number of calories for that log item consumed.
     * @param dateNs The date the item was logged in nanoseconds.
     * @param source (0 - User Input, 1 - Google FIT)
     * @returns 
     */
    public async logItem(name: string, meal: number, cals: number, dateNs: number, source: number) {
        const month = new Date(dateNs/1000000).getMonth()+1;
        const day = new Date(dateNs/1000000).getDate();
        const year = new Date(dateNs/1000000).getFullYear();

        const id = this.logId(year, month, day, meal);

        /* Get the item id using the name of the item being logged. */
        const itemQuery = `SELECT * FROM item WHERE item.name="${name}"`;
        const itemResult: any = await this.db.getFirstAsync(itemQuery);

        // Return if the item does not exist.
        if (itemResult == null) {
            // TODO: Do something for when an item is not in the item catalog.
            console.log(`No Receipt: ${name}`);
            return;
        }

        // console.log(itemResult);

        const unit = itemResult.serv_unit != "null" ? itemResult.serv_unit : itemResult.vol_unit != "null"  ? itemResult.vol_unit : itemResult.weight_unit;

        const logItem: LogItem = {
            id: id,
            source: source,
            item_id: itemResult.id,
            qty: cals / itemResult.cals,
            unit: unit,
            meal: meal,
            date_ns: dateNs
        }

        /* Querry for checking if there was a duplicate log item for the given day and meal. */
        const dupeQuery = `
            SELECT meal_log.id, meal_log.item_id, meal_log.date_ns
            FROM meal_log
            JOIN item
            ON meal_log.item_id = item.id
            WHERE meal_log.item_id="${logItem.item_id}" AND meal_log.id=${id}
        `;
        const dupeResult: any = await this.db.getFirstAsync(dupeQuery);

        /* If there is a duplicate item. */
        if (dupeResult != null && logItem.date_ns > dupeResult.date_ns) {
            // TODO: More tests and uncomment.
            console.log(`Dupe Found: ${name}`);
            // this.updateLogItem(dupeResult, logItem);
            return;
        }

        console.log(`Insert: ${name}`);
        // this.insertInto('meal_log', logItem);
    }

    public boughtItem(itemName: any, pkg: any) {
        // this.dbTransaction('', [itemName, pkg]);
    }

    public async getAllItems(): Promise<Item[]> {
        var query = `SELECT * FROM item`

        return await this.db.getAllAsync(query) as Item[];
    }

    public async getPantries(): Promise<Pantry[]> {
        var query = `SELECT * FROM pantry`

        return await this.db.getAllAsync(query) as Pantry[];
    }

    public async getPantryItems(): Promise<any[]> {
        const pantries = new Array<any>();

        for (var i = 0; i < 10; i++) {
            console.log();
        }

        var qtyQuery = `
            SELECT item.id, pantry.name as pantry, item.name, item.serv_off, item.weight_off, item.vol_off, SUM(meal_log.qty) as meallog_qty, meal_log.unit as meallog_unit, SUM(receipt.qty) as receipt_qty, receipt.unit as receipt_unit
            FROM item
            JOIN pantry
            ON pantry.id = item.pantry_id
            LEFT JOIN meal_log
            ON meal_log.item_id = item.id
            LEFT JOIN receipt
            ON receipt.item_id = item.id
            GROUP BY item.id, meal_log.unit, receipt.unit;
        `

        // await this.resetTestTables();

        // await this.printTable('meal_log');
        // await this.printTable('receipt');
        // await this.printTable('item');

        const qtyResult = await this.db.getAllAsync(qtyQuery);

        // TODO: Consolidate any duplicates items with different units into a single line.

        // console.log(qtyResult);

        qtyResult.forEach((item: any) => {
            var found = false;

            for (const pantry of pantries) {
                if (pantry.name == item.pantry) {
                    pantry.items.push(item);
                    found = true;
                    break;
                }
            }

            if (!found) {
                pantries.push({
                    name: item.pantry,
                    items: new Array(item)
                });
            }
        });

        return pantries;
    }

    public getItem() {

    }

    public async getShoppingList(store?: string) {
        const shoppingList = [
            {name: 'Critical', cost: 0, items: new Array<any>()},
            {name: 'Low', cost: 0, items: new Array<any>()},
            {name: 'Extra', cost: 0, items: new Array<any>()}
        ];

        for (var i = 0; i < 10; i++) {
            console.log();
        }

        var qtyQuery = `
            SELECT
                item.id,
                MAX(receipt.id) as receipt_id,
                item.name,
                item.brand,
                item.unit_type,
                CASE
                    WHEN item.unit_type IS 0 THEN item.serv_crit
                    WHEN item.unit_type IS 1 THEN item.weight_crit
                    ELSE item.vol_crit
                    END AS crit,
                CASE
                    WHEN item.unit_type IS 0 THEN item.serv_off
                    WHEN item.unit_type IS 1 THEN item.weight_off
                    ELSE item.vol_off
                    END AS off,
                SUM(meal_log.qty) as meallog_total_qty,
                meal_log.unit as meallog_total_unit,
                receipt.price as receipt_price,
                receipt.qty as receipt_qty,
                receipt.unit as receipt_unit,
                SUM(receipt.qty) as receipt_total_qty,
                receipt.unit as receipt_total_unit,
                receipt.store
            FROM meal_log
            FULL OUTER JOIN receipt
            ON receipt.item_id = meal_log.item_id
            JOIN item
            ON item.id = meal_log.item_id OR item.id = receipt.item_id
            ${store ? ` WHERE receipt.store = "${store}"` : ''}
            GROUP BY item.id, meal_log.unit, receipt.unit
        `

        const qtyResult = await this.db.getAllAsync(qtyQuery);

        qtyResult.forEach( (item: any) => {
            const stock = item.receipt_total_qty - item.meallog_total_qty;

            if (stock <= item.crit) {
                shoppingList[0].items.push(item);
                shoppingList[0].cost += item.receipt_price;
            } else if (stock <= item.crit*2) {
                shoppingList[1].items.push(item);
                shoppingList[1].cost += item.receipt_price;
            } 
            // else {
            //     shoppingList[2].items.push(item);
            //     shoppingList[2].cost += item.receipt_price;
            // }
        } );

        return shoppingList;
    }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new DataManager();
            console.log('Created DataManager Instance');
        }

        return this.instance;
    }
}

export default DataManager;
