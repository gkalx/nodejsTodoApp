//Create Feature
function itemTemplate(createdItemId) {
    return `
    <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${createdItemId.text}</span>
        <div>
        <button data-id="${createdItemId._id}" class="edit-me btn btn-secondary btn-sm mr-1" type="button">Edit</button>
        <button data-id="${createdItemId._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
    </li>`
}



// Initial Page Load Render
let ourHTML =  items.map(function(item){
    console.log(item)
    return itemTemplate(item) 
}).join("")
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML)




// Create Feature
let creatField = document.getElementById("create-field")

document.getElementById("create-form").addEventListener('submit', function(e){
    e.preventDefault()

    async function createItem(){
        try {
            
            let response = await axios.post('/create-item',  { text: creatField.value })
            console.log("We are Here")
            console.log(response)
            console.log(response.config)
            console.log(response.config.data)
            console.log(response.data)
            let createdItemId = response.data
            let itemTemplatehtml = itemTemplate(createdItemId)
            console.log(itemTemplate)
            document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplatehtml) 
            creatField.value = ""
            creatField.focus()
        } catch(error){
            console.log("Please try again later.")
            console.log(error)
        }    
    }
    createItem()

})



document.addEventListener('click', function (e) {

    //Update Feature
    if (e.target.classList.contains("edit-me")) {
        let userInput = prompt("Enter your desired new thext.", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        if(userInput){
            axios.post('/update-item',  { text: userInput, id: e.target.getAttribute("data-id") }).then(function () {
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
            }).catch(function (error){
                console.log("Please try again later.")
                console.log(error)
            })
        }
    }

    //Delete Feature
    if (e.target.classList.contains("delete-me")) {
        if(confirm('Are you sure you want to permenatetly delete this item?')){
            axios.post('/delete-item', {id: e.target.getAttribute('data-id')}).then(function(){
                e.target.parentElement.parentElement.remove()
            }).catch(function(error){
                console.log(error)
            })           
        }

    }

})