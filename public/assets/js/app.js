import { validate, showToast } from "./utils.js"
const name = document.getElementById("name")
const price = document.getElementById("price")
const desc = document.getElementById("desc")
const image = document.getElementById("image")
const category = document.getElementById("category")
const addBtn = document.getElementById("add-btn")
const URL = "http://localhost:5000/products"
const result = document.getElementById("result")
const productLimit = document.getElementById("product-limit")
const pagi = document.getElementById("pagi")

const updateBtn = document.getElementById("update-btn")
let selectedId

addBtn.addEventListener("click", () => {
    if (validate(name, price, desc, image, category)) {
        createProduct()
        readProduct()
        reset()
    } else {
        console.error("All Feilds Required")
    }
})
const createProduct = async () => {
    try {
        const productData = {
            name: name.value,
            price: price.value,
            desc: desc.value,
            image: image.value,
            category: category.value,
        }
        await fetch(URL, {
            method: "POST",
            body: JSON.stringify(productData),
            headers: { "Content-Type": "application/json" } // 👈 for backend
        })
        showToast("Product Create Success", "success")
        console.log("Product Create Success")
    } catch (error) {
        console.error(error)
    }
}
const readProduct = async (limit = 2, page = 1) => {
    try {


        // const res = await fetch(URL, { method: "GET" })

        //                              👇 Query String
        const res = await fetch(`${URL}/?_limit=${limit}&_page=${page}`, { method: "GET" })
        const data = await res.json()
        result.innerHTML = data.map(item => `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td><img height="100" src="${item.image}"/></td>
                    <td>${item.desc}</td>
                    <td>${item.category}</td>
                    <td>
                        <button onclick="handleEdit('${item.name}','${item.price}', '${item.desc}', '${item.image}', '${item.category}', '${item.id}')" class="btn btn-warning"> <i class="bi bi-pencil"></i> </button>
                        <button onclick="deleteProduct(${item.id})" class="btn btn-danger"> <i class="bi bi-trash"></i> </button>
                    </td>
                </tr>
            `).join("")

        //                                   👇 Only Related to Json-server
        const totalRecord = res.headers.get("X-Total-Count")
        const totalBtn = totalRecord / limit
        console.log(totalRecord)
        console.log(Math.ceil(totalBtn))

        pagi.innerHTML = ""

        if (page > 1) {
            pagi.innerHTML = `<button onclick="handleBtnClick(${page - 1})"  class="btn btn-primary">pre</button>`
        }

        for (let i = 1; i <= Math.ceil(totalBtn); i++) {
            pagi.innerHTML += `<button onclick="handleBtnClick(${i})"  class="btn btn-outline-primary">${i}</button>`
        }

        if (page < Math.ceil(totalBtn)) {
            pagi.innerHTML += `<button onclick="handleBtnClick(${page + 1})" class="btn btn-primary">next</button>`
        }

    } catch (error) {
        console.error(error)
    }
}
const updateProduct = async () => {
    try {
        const productData = {
            name: name.value,
            price: price.value,
            desc: desc.value,
            image: image.value,
            category: category.value,
        }
        await fetch(`${URL}/${selectedId}`, {
            method: "PATCH",
            body: JSON.stringify(productData),
            headers: { "Content-Type": "application/json" }
        })
        readProduct()
        reset()
        updateBtn.classList.add("d-none")
        addBtn.classList.remove("d-none")
    } catch (error) {
        console.error(error)
    }
}
window.deleteProduct = async id => {
    try {
        await fetch(`${URL}/${id}`, { method: "DELETE" })
        showToast("Product Delete Success", "danger")
        console.log("Product Delete Success")
        readProduct()
    } catch (error) {
        console.error(error)
    }
}

const reset = () => {
    for (const item of [name, price, desc, image, category]) {
        item.value = ""
        item.classList.remove("is-valid")
    }
}

//                              👇 Event
productLimit.addEventListener("change", () => {
    readProduct(productLimit.value)
})

window.handleBtnClick = index => {
    readProduct(productLimit.value, index)
}

window.handleEdit = (ename, eprice, edec, eimage, ecategory, eid) => {
    name.value = ename
    price.value = eprice
    desc.value = edec
    image.value = eimage
    category.value = ecategory
    addBtn.classList.add('d-none')
    updateBtn.classList.remove('d-none')
    selectedId = eid
}
updateBtn.addEventListener("click", () => {
    updateProduct()
})

readProduct()