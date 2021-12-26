var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos < currentScrollPos) {
        document.getElementById("fullmenu").style.top = "-60px";
    } else {
        document.getElementById("fullmenu").style.top = "0px";
    }
    prevScrollpos = currentScrollPos;
}

window.onload = on_load;

function on_load() {
    create_database();
    fetch_database();
    get_product();

}



function get_product() {
    db.transaction(function(tx) {
        var query = `SELECT * FROM product WHERE category_id = ?`;
        tx.executeSql(
            query, [1],
            function(tx, result) {
                show_adidas(result.rows);
            }, transaction_error);
        var query = `SELECT * FROM product WHERE category_id = ?`;
        tx.executeSql(
            query, [2],
            function(tx, result) {
                show_nike(result.rows);
            }, transaction_error);
    });
}

function show_adidas(products) {

    var show_adidas = document.getElementById("product-list-adidas");
    for (var product of products) {
        var img = "";
        if (product.category_id == 1) {
            img = `<img src="../img/adidas.png" alt="">`
        } else {
            img = `<img src="../img/nike.png" alt="">`
        }
        show_adidas.innerHTML += `<div class="product-container  col-6 col-md-4 col-lg-3">
                               <div class="product">
                                    <div>${img}</div>
                                    <div>
                                        <h5>${product.name}</h5>
                                    </div>
                                    <div>
                                        <h5>${product.price}$</h5>
                                    </div>
                                    <div><button type="button" onclick="add_to_cart(this.id)" id="${product.id}" class="btn btn-dark"><i class="fa-solid fa-cart-plus"></i> </button> </div>
                                </div>
                            </div>`;
    }
}

function show_nike(products) {

    var show_nike = document.getElementById("product-list-nike");
    for (var product of products) {
        var img = "";
        if (product.category_id == 1) {
            img = `<img src="../img/adidas.png" alt="">`
        } else {
            img = `<img src="../img/nike.png" alt="">`
        }
        show_nike.innerHTML += `<div class="product-container  col-6 col-md-4 col-lg-3">
                               <div class="product">
                                    <div>${img}</div>
                                    <div>
                                        <h5>${product.name}</h5>
                                    </div>
                                    <div>
                                        <h5>${product.price}$</h5>
                                    </div>
                                    <div><button type="button" onclick="add_to_cart(this.id)" id="${product.id}" class="btn btn-dark"><i class="fa-solid fa-cart-plus"></i> </button></div>
                                </div>
                            </div>`;
    }
}

function add_to_cart(id) {
    var alert_login = localStorage.getItem("account_id")
    if (alert_login) {
        db.transaction(function(tx) {
            var query = ` SELECT * FROM cart WHERE product_id = ? and account_id = ?`;
            tx.executeSql(query, [id, alert_login], function(tx, result) {
                if (result.rows[0]) {
                    update_quantity(id, result.rows[0].quantity + 1)
                } else {
                    get_cart_database(id);
                }
            }, transaction_error);
        });
    } else {
        alert("Please login to shop!")
    }
};

function update_quantity(id, quantity) {
    var account_id = localStorage.getItem("account_id");
    db.transaction(function(tx) {
        var query = ` UPDATE cart SET quantity= ? WHERE product_id = ? and account_id = ?`;
        tx.executeSql(query, [quantity, id, account_id], function(tx, result) {
            var message = `Update item to cart successfully`;
            log(`INFOR`, message);
            update_cart_quantity();
        }, transaction_error);
    });
}

function get_cart_database(id) {
    var account_id = localStorage.getItem("account_id");
    // alert(account_id);
    db.transaction(function(tx) {
        var query = ` INSERT INTO cart(product_id, quantity,account_id) VALUES(?, ?, ?)`;
        tx.executeSql(query, [id, 1, account_id], function(tx, result) {
            var message = `insert item to cart successfully`;
            log(`INFOR`, message);
            update_cart_quantity();
        }, transaction_error);
    });
};

function update_cart_quantity() {
    var account_id = localStorage.getItem("account_id");
    db.transaction(function(tx) {
        var query = ` SELECT SUM(QUANTITY) AS total FROM cart WHERE account_id= ?`;
        tx.executeSql(query, [account_id], function(tx, result) {
            var message = `Update total item from cart successfully`;
            log(`INFOR`, message);
            if (result.rows[0].total > 0) {
                document.getElementById("total-quantity").innerHTML = `(${result.rows[0].total})`
            } else {
                document.getElementById("total-quantity").innerHTML = `(0)`
            }

        }, transaction_error);
    });
}

// function delete_product(id) {
//     var item_delete = document.getElementById(`item${id}`);
//     item_delete.outerHTML = ``;
// }

function register(e) {
    e.preventDefault();
    var first_name = document.getElementById("first_name").value;
    var last_name = document.getElementById("last_name").value;
    // alert(last_name);
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    db.transaction(function(tx) {
        var query = ` INSERT INTO account(first_name, last_name, email,password) VALUES(?, ?, ?, ?)`;
        tx.executeSql(query, [first_name, last_name, email, password], function(tx, result) {
            var message = `insert account successfully`;
            log(`INFOR`, message);
        }, transaction_error);
    });

};

function check_login() {
    var check = localStorage.getItem("account_email");
    if (check) {
        logged();
    } else {
        not_login_yet();
    }
}

function log_in(e) {
    e.preventDefault();
    var email = document.getElementById("email-login").value;
    var password = document.getElementById("password-login").value;
    db.transaction(function(tx) {
        var query = ` SELECT * FROM account
                      WHERE email = ? and password = ?`;
        tx.executeSql(query, [email, password], function(tx, result) {
            if (result.rows[0]) {

                $("#exampleModal").modal("hide");

                localStorage.setItem("account_email", result.rows[0].email);
                localStorage.setItem("account_id", result.rows[0].id);
                document.getElementById("login").innerHTML = `<button type="button" data-bs-toggle="modal" data-bs-target="#profile"><i class="fa-solid fa-user-check"></i></button>`;
                update_cart_quantity();
                get_all_cart();
            } else {
                alert("Log in fail!");
                localStorage.setItem("account_email", "");
            }
        }, transaction_error);
    });

};

function logged() {
    document.getElementById("login").innerHTML = `<button type="button" data-bs-toggle="modal" data-bs-target="#profile"><i class="fa-solid fa-user-check"></i></button> `;
}

function not_login_yet() {
    $("#profile").modal("hide");
    document.getElementById("total-quantity").innerHTML = `(0)`
    localStorage.setItem("account_email", "");
    localStorage.setItem("account_id", "");
    document.getElementById("login").innerHTML = `<button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class = "fa-solid fa-arrow-right-to-bracket"></i></button> `;

    var item_cart = document.getElementById("all_item_cart");
    if (item_cart) {
        item_cart.innerHTML = ``;
    }

}

function get_all_cart() {
    var account_id = localStorage.getItem("account_id");
    db.transaction(function(tx) {
        var query = ` SELECT p.name, p.price, c.quantity, c.id, c.account_id FROM cart c, product p 
                      WHERE c.product_id = p.id and c.account_id= ? `;
        tx.executeSql(query, [account_id], function(tx, result) {
            var message = `select cart successfully`;
            log(`INFOR`, message);
            show_all_cart(result.rows);

        }, transaction_error);
    });
}

function show_all_cart(products) {
    var all_item_cart = document.getElementById("all_item_cart");
    if (all_item_cart) {
        var total_all = 0;
        for (var product of products) {
            var total = product.price * product.quantity;
            total_all += total;
            all_item_cart.innerHTML += `<tr id="${product.id}_cart">
                                <td>${product.name}</td>
                                <td>${product.price} $</td>
                                <td>${product.quantity}</td>
                                <td>${total} $</td>
                                <td>
                                    <i class="fas fa-trash-alt btn btn-danger btn-sm" id="${product.id}" onclick="delete_and_update(this.id); update_total_price();"></i>
                                </td>
                         </tr>`;
        }
        all_item_cart.innerHTML += `<tr id="total_bill">
                                <td></td>
                                <td></td>
                                <td>Total bill</td>
                                <td>${total_all} $</td>
                                <td>
                                </td></tr>`;
    }

}

function update_total_price() {
    var total_bill = document.getElementById(`total_bill`);
    var account_id = localStorage.getItem("account_id");
    db.transaction(function(tx) {
        var query = ` SELECT p.price, c.quantity FROM cart c, product p 
                      WHERE c.product_id = p.id and c.account_id= ? `;
        tx.executeSql(query, [account_id], function(tx, result) {
            var message = `select cart successfully`;
            log(`INFOR`, message);
            var total_all = 0;
            for (var product of result.rows) {
                var total = product.price * product.quantity;
                total_all += total;
            }
            total_bill.outerHTML = `<tr id="total_bill">
                                <td></td>
                                <td></td>
                                <td>Total bill</td>
                                <td id="total_bill">${total_all} $</td>
                                <td>
                                </td></tr>`;

        }, transaction_error);
    });
}

function delete_and_update(id) {
    delete_in_cart_database(id);
    update_cart_quantity();
}

function delete_in_cart_database(id) {
    db.transaction(function(tx) {
        var query = " DELETE FROM cart WHERE id = ?";
        tx.executeSql(query, [id],
            function(tx, result) {
                var message = `delete successfully`;
                log(`INFOR`, message);
                delete_product_cart(id)
            }, transaction_error)
    });
}

function delete_product_cart(id) {
    var item_delete = document.getElementById(`${id}_cart`);
    item_delete.outerHTML = ``;
}

function profile() {
    var id = localStorage.getItem("account_id");
    var inf = document.getElementById("profile_user");
    db.transaction(function(tx) {
        var query = " SELECT * FROM Account WHERE id = ?";
        tx.executeSql(query, [id],
            function(tx, result) {
                var message = `get inf successfully`;
                log(`INFOR`, message);
                inf.innerHTML = `<h3 class="text-center mb-3">Hello ${result.rows[0].first_name}!</h3>
                               <div class="text-center">Email: ${result.rows[0].email} </div>`;
            }, transaction_error)
    });
}