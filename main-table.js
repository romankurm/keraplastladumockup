
    import { setupTable } from "./table-helper.js";
    import { getOrders, isFinishedOrder } from "./data-helper.js"
    import { Order } from "./Order.js";

    // Declared before the first await: two polls can overlap and a slow
    // older answer must not repaint over a newer one.
    let refreshSeq = 0;

    // The interval is armed before the first read, so a screen that fails to
    // load once still tries again instead of staying blank until somebody
    // reloads the browser on the wall.
    setInterval(updateMainTable, 10000);

    await updateMainTable().catch(() => {});

async function getSortedOrders() {
    let ordrs = await getOrders();

    return ordrs
        // Same finished and removed tests the queue counter uses, so the board
        // cannot show a row the counter has already left out.
        .filter(order => !isFinishedOrder(order))
        .filter(order => !order.isRemoved())
        .filter(order => order.status != "done")
        .filter(order => order.so_nr != null)
        .filter(order => order.task != null);
}

/**
 * Rebuild the table from one fresh read.
 *
 * The previous version only appended rows when the order count grew, so an
 * operation finished on an order already on screen never showed its tick mark,
 * and a row that should have dropped out stayed. It also dereferenced an
 * undefined `order` right after the fetch, which threw on every tick before any
 * of that ran. Redrawing the whole body is cheap at this row count and keeps
 * every column, not just the tick marks, honest.
 */
async function updateMainTable() {
    const seq = ++refreshSeq;

    const newOrders = await getSortedOrders();
    if (seq !== refreshSeq) return;

    Order.currentOrders = Array.from(newOrders);

    const table_body = document.getElementById("tableBody");
    table_body.innerHTML = "";

    setupTable(table_body, newOrders, true);
}
