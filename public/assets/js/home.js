import { showToast } from "./utils.js"

const home = document.getElementById("home")
const URL = "http://localhost:5000"
const count = document.getElementById("count")
const productLimit = document.getElementById("product-limit")
const pagi = document.getElementById("pagi")
const getAllProducts = async (limit = 2, page = 1) => {
    try {
        const res = await fetch(`${URL}/products/?_limit=${limit}&_page=${page}`, { method: "GET" })
        const data = await res.json()
        const totalRecord = res.headers.get("X-Total-Count") // 10
        const totalBtn = Math.ceil(totalRecord / limit) // 5
        pagi.innerHTML = ""

        if (page > 1) {
            pagi.innerHTML += `<button  onclick="handlePagination(${page - 1})" class="btn btn-sm btn-outline-primary">Pre</button>`
        }

        for (let i = 1; i <= totalBtn; i++) {
            // if (page === i) {
            //     pagi.innerHTML += `<button onclick="handlePagination(${i})" class="btn btn-sm btn-primary">${i}</button>`
            // } else {
            //     pagi.innerHTML += `<button onclick="handlePagination(${i})" class="btn btn-sm btn-outline-primary">${i}</button>`
            // }

            page === i
                ? pagi.innerHTML += `<button onclick="handlePagination(${i})" class="btn btn-sm btn-primary">${i}</button>`
                : pagi.innerHTML += `<button onclick="handlePagination(${i})" class="btn btn-sm btn-outline-primary">${i}</button>`

        }

        if (page < totalBtn) {
            pagi.innerHTML += `<button onclick="handlePagination(${page + 1})" class="btn btn-sm btn-outline-primary">Next</button>`
        }

        home.innerHTML = data.map(item => `
            <div class="col-sm-4">
                <div class="card">
                    <div class="card-body">
                        <img src="${item.image}" class="img-fluid" alt="">
                        <h6>${item.id}</h6>
                        <h6>${item.name}</h6>
                        <div>${item.price}</div>
                        <div>${item.desc}</div>
                        <button onclick="handleAddToCart('${item.id}','${item.name}','${item.price}','${item.image}',)" type="button" class="btn btn-primary">Add To Cart</button>
                    </div >
                </div >
            </div >
    `).join("")
    } catch (error) {
        console.log(error)
    }
}

window.handleAddToCart = async (id, name, price, image) => {
    try {
        const cartData = { pid: id, name, price, image }
        await fetch(`${URL}/cart`, {
            method: "POST",
            body: JSON.stringify(cartData),
            headers: { "Content-Type": "application/json" }
        })

        displayCart()
        showToast("add to cart success", "success")

        console.log("Add To Cart Success")
    } catch (error) {
        console.error(error)
    }
}

const displayCart = async () => {
    try {

        const res = await fetch(`${URL}/cart`)
        const data = await res.json()
        count.innerHTML = data.length

        if (data.length === 0) {
            return document.querySelector("#cart>.offcanvas-body").innerHTML = "No Cart Item"
        }

        const TOTAL = data.reduce((sum, item) => sum + +item.price, 0)
        const GST = TOTAL * 18 / 100
        const BILL = GST + TOTAL


        document.querySelector("#cart>.offcanvas-body").innerHTML = data.map(item => `
             <div class="card mb-3">
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-3">
                            <img src="${item.image}" class="img-fluid" alt="">
                        </div>
                        <div class="col-sm-3">
                            ${item.name}
                        </div>
                        <div class="col-sm-3">
                            ${item.price}
                        </div>
                        <div class="col-sm-3">
                           <button onclick="removeFromCart(${item.id})" class="btn btn-outline-danger">
                            <i class="bi bi-trash"></i>
                           </button>
                        </div>
                    </div>
                </div>
            </div>
            `).join("")

        document.querySelector("#cart>.offcanvas-body").innerHTML += `
               <div class="card">
                    <div class="card-header">Total Bill</div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <span>Total</span>
                            <strong>${TOTAL}</strong>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>TAX</span>
                            <strong>${GST}</strong>
                        </div>
                        <hr/>
                        <div class="d-flex justify-content-between">
                            <span>Bill</span>
                            <strong>${BILL}</strong>
                        </div>
                    </div>
                </div>
        `
    } catch (error) {
        console.error(error)
    }
}

window.removeFromCart = async id => {
    try {
        await fetch(`${URL}/cart/${id}`, { method: "DELETE" })
        displayCart()
        showToast("Cart Item Delete Success", "danger")
        console.log("Cart Item Delete Success")
    } catch (error) {
        console.error(error)
    }
}

productLimit.addEventListener("change", () => {
    getAllProducts(productLimit.value)
})

window.handlePagination = index => {
    getAllProducts(productLimit.value, index)
}

displayCart()
getAllProducts()