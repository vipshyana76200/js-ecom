export const validate = (...elements) => {
    let isValid = true
    for (const item of elements) {
        if (item.value === "") {
            item.classList.remove("is-valid")
            item.classList.add("is-invalid")
            isValid = false
        } else {
            item.classList.remove("is-invalid")
            item.classList.add("is-valid")
        }
    }
    return isValid
}

export const showToast = (message, varient) => {
    const tc = document.getElementById("toast-container")
    tc.innerHTML = `<div class="alert alert-${varient}">${message}</div>`

    setTimeout(() => {
        tc.innerHTML = ""
    }, 3000)
}