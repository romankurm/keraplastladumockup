
    import { setupTable } from "./table-helper.js";
    import { addRow } from "./table-helper.js";
    import { getOrders } from "./data-helper.js"
    import { Order } from "./Order.js";

    let sortedOrders = await getSortedOrders();

    Order.currentOrders = Array.from(sortedOrders);

    let table_body = document.getElementById("tableBody");

    setupTable(table_body, sortedOrders, true);

    const intervalID = setInterval(updateMainTable, 10000);

async function getSortedOrders() {
    let ordrs = await getOrders();

    return ordrs
        .filter(order => order.status != "done")
        .filter(order => order.so_nr != null)
        .filter(order => order.task != null);
}

async function updateMainTable() {
    const currentOrders = Order.currentOrders;

    const newOrders = await getSortedOrders();

    let table_body = document.getElementById("tableBody");

    const order_comments = order.getComments();

    if (order_comments != null) {
        const properties = order_comments.split(" ");

        for (const property of properties) {
            if (property.toLowerCase() == "valmis") {
                    orders.splice(newOrders.indexOf(order), 1);
            } else if (property.toLowerCase() == "p") {

                    orders.splice(newOrders.indexOf(order), 1);
                    orders.splice(0, 0, order);

            }
        }
    }

    if (currentOrders.length < newOrders.length) {
        for (let i = currentOrders.length; i < newOrders.length; ++i) {

            const newOrder = newOrders[i];

            if (newOrder.containsComment("valmis"))
                continue;

            Order.currentOrders.push(newOrder);

            addRow(table_body, newOrder, true);

        }
    }
}