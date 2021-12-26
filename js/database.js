var db = window.openDatabase("Tam|Vo", "1.0", "Tam|Vo", 200000);

function create_database() {
    db.transaction(function(tx) {
        var query = `CREATE TABLE IF NOT EXISTS city (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    )`;

        tx.executeSql(
            query, [],
            table_transaction_success(`city`),
            transaction_error
        );

        query = `CREATE TABLE IF NOT EXISTS account (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT NULL,
      last_name TEXT NULL,
      birthday REAL NULL,
      phone TEXT NULL,
      street TEXT NULL,
      ward_id INTEGER NULL,
      district_id INTEGER NULL,
      city_id INTEGER NULL,
      status INTEGER ,
      FOREIGN KEY (city_id) REFERENCES city(id)
    )`;

        tx.executeSql(
            query, [],
            table_transaction_success(`account`),
            transaction_error
        );

        query = `CREATE TABLE IF NOT EXISTS category (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
          )`;

        tx.executeSql(
            query, [],
            table_transaction_success(`category`),
            transaction_error
        );
        query = `CREATE TABLE IF NOT EXISTS product (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            price INTEGER NOT NULL, 
            description TEXT,
            category_id INTEGER NOT NULL,
            FOREIGN KEY (category_id) REFERENCES category(id)
          )`;
        tx.executeSql(
            query, [],
            table_transaction_success(`product`),
            transaction_error
        );
        query = `CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            account_id INTEGER NOT NULL,
            FOREIGN KEY(account_id) REFERENCES account(id),
            FOREIGN KEY(product_id) REFERENCES product(id)
          )`;

        tx.executeSql(
            query, [],
            table_transaction_success(`cart`),
            transaction_error
        );
        query = `CREATE TABLE IF NOT EXISTS ward (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            district_id INTEGER NOT NULL,
            FOREIGN KEY(district_id) REFERENCES district(id)
          )`;

        tx.executeSql(
            query, [],
            table_transaction_success(`ward`),
            transaction_error
        );
        query = `CREATE TABLE IF NOT EXISTS district (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            city_id INTEGER NOT NULL,
            FOREIGN KEY(city_id) REFERENCES city(id)
          )`;
        tx.executeSql(
            query, [],
            table_transaction_success(`district`),
            transaction_error
        );

    });

}

function fetch_database() {
    db.transaction(function(tx) {
        var query = `INSERT INTO category (name) VALUES(?)
    `;

        tx.executeSql(
            query, ["Adidas"],
            function add_category_successfully() {
                log("INFO", "Add successfully")
            },
            transaction_error
        );
        query = `INSERT INTO category (name) VALUES(?)
    `;

        tx.executeSql(
            query, ["Nike"],
            function add_category_successfully() {
                log("INFO", "Add successfully");
            },
            transaction_error
        );

        query = `INSERT INTO account (email, password,status) VALUES(?, ?, ?)
    `;

        tx.executeSql(
            query, ["vht@gmail.com", "123", "1"],
            function add_category_successfully() {
                log("INFO", "Add successfully");
            },
            transaction_error
        );
        query = `INSERT INTO product (name, price, category_id) VALUES(?, ?, ?)
    `;

        tx.executeSql(
            query, ["Jordan", 200, 2],
            function add_category_successfully() {
                log("INFO", "Add successfully");
            },
            transaction_error
        );
        query = `INSERT INTO product (name, price, category_id) VALUES(?, ?, ?)
    `;

        tx.executeSql(
            query, ["Ultra boost", 300, 1],
            function add_category_successfully() {
                log("INFO", "Add successfully");
            },
            transaction_error
        );
    });
};

function log(type, message) {
    var current_time = new Date();
    console.log(`${current_time} [${type}] ${message}`);
}

function table_transaction_success(table) {
    log(`INFO`, `Create table "${table}" successfully.`);
}

function transaction_error(tx, error) {
    log(`ERROR`, `SQL Error ${error.code}: ${error.message}.`);
}