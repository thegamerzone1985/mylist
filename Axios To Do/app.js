//grab todo container
const listContainer = document.getElementById("list-container")

//GET todos///////////////////////

//get data
axios.get("https://api.vschool.io/Danwarren/todo/")
.then(res => {
    const todos = res.data
    for (let i = 0; i < todos.length; i++){
        let newTodo = createTodo(todos[i])
        listContainer.appendChild(newTodo)
    }
})
.catch(err => console.log(err))

//create new todo
function createTodo(todo) {
    todoContainer = document.createElement("div")
    todoContainer.className = "todo-container"
    todoContainer.id = `${todo._id}`

    addCheckbox(todo, todoContainer)
    if (todo.imgUrl || todo.price || todo.description){
        filledTodo(todo, todoContainer)
    } else {
        titleOnly(todo, todoContainer)
    }
    addEditButton(todoContainer)
    addDelete(todoContainer)
    // addButtons()
    return todoContainer
}
//completed checkbox

function addCheckbox(item, container){
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", function(e){
        completeToggle(e, item)
    })
    if (item.completed) {
        checkbox.checked = true
    }
    container.appendChild(checkbox)
}
function titleOnly(item, container) {
    const title = document.createElement("span")
    title.id = `${item._id}-title`
    title.textContent = item.title
    if (item.completed){
        title.className = "todo-completed"
    }
    container.appendChild(title)
}
//delete button
function addDelete(container){
    const deleteButton = document.createElement("button")
    deleteButton.addEventListener("click", function() {
        deleteTodo(container.id)
    })
    deleteButton.textContent = "Delete This"
    deleteButton.className = "delete-button"
    container.appendChild(deleteButton)
}

function filledTodo(item, container){
    const content = document.createElement("details")

    //title/dropdown
    const summary = document.createElement("summary")
    const title = document.createElement("span")
    title.id = `${item._id}-title`
    title.textContent = item.title
    if (item.completed){
        title.className = "todo-completed"
    }
    summary.appendChild(title)
    content.appendChild(summary)

    //cointainer
    const infoContainer = document.createElement("div")
    infoContainer.className = "todo-details"


    //picture
    if (item.imgUrl){    
        const todoImg = document.createElement("img")
        todoImg.id = `${item._id}-img`
        todoImg.src = item.imgUrl
        todoImg.alt = "to-do image"
        todoImg.className = "todo-img"
        infoContainer.appendChild(todoImg)
    }

    //right container
    const todoRight = document.createElement("div")
    todoRight.className = "todo-right"
    
    //price
    if (item.price){
        const todoPrice = document.createElement("div")
        todoPrice.id = `${item._id}-price`
        todoPrice.textContent = `$${item.price}`
        todoPrice.className = "todo-price"
        todoRight.appendChild(todoPrice)
    }
    //desription
    if (item.description){
        const todoDescription = document.createElement("div")
        todoDescription.id = `${item._id}-description`
        todoDescription.textContent = item.description
        todoDescription.className = "todo-description"
        todoRight.appendChild(todoDescription)
    }
    //put everything in container
    if (item.price || item.description){
        infoContainer.appendChild(todoRight)
    }
    content.appendChild(infoContainer)
    container.appendChild(content)
}
//POST new todos
const newPostBtn = document.getElementById("new-post");
const postDialog = document.getElementById("post-dialog")
newPostBtn.addEventListener("click", postPopUp )
function postPopUp(){
    postDialog.open = true
    postDialog.title.value = ""
}
document.post.addEventListener("submit", newPost)

function newPost(e){
    e.preventDefault()
    const newPostObj = {
        title: document.post.title.value
    }
    if (document.post.img.value){
        newPostObj.imgUrl = document.post.img.value
    }
    if (document.post.price.value){
        newPostObj.price = document.post.price.value
    }
    if (document.post.description.value){
        newPostObj.description = document.post.description.value
    }
    console.log(newPostObj)
    axios.post("https://api.vschool.io/Danwarren/todo/", newPostObj)
        .then(response => {
            const newPostConfirm = response.data
            const newTodo = createTodo(newPostConfirm)
            listContainer.appendChild(newTodo)
        })
        .catch(error => console.log(error))
    e.target.parentElement.open = false
}
//PUT complete or incomplete
function completeToggle(e, item){
    const isCompletedObj = {}
    if(item.completed){
        isCompletedObj.completed = false 
    } else {
        isCompletedObj.completed = true
    }
    console.log(isCompletedObj)
    axios.put(`https://api.vschool.io/Danwarren/todo/${e.target.parentElement.id}`, isCompletedObj)
    .then(response => {
        const updated = response.data
        console.log(updated)
        const updatedTodo = createTodo(updated)
        updateCurrent(updatedTodo, e.target.parentElement.id)
    })
    .catch(error => console.log(error))
}

function updateCurrent(update, id){
    //remove old parts
    const elementToUpdate = document.getElementById(`${id}`)
    console.dir(update)
    console.dir(elementToUpdate)
    while (elementToUpdate.children.length){
        elementToUpdate.removeChild(elementToUpdate.firstChild)
    }
    //add new parts
    while (update.children.length){
        let oldPart = update.removeChild(update.firstChild)
        elementToUpdate.appendChild(oldPart)
    }
}
//DELETE old todos
function deleteTodo(id) {
    const toDelete = document.getElementById(id)
    axios.delete(`https://api.vschool.io/Danwarren/todo/${id}`)
        .then(response => {
            console.log(response)
            listContainer.removeChild(toDelete)
        })
        .catch(error => console.log(error))
    
}

//EDIT todos//////////////////
function addEditButton(container){
    const editButton = document.createElement("button")
    editButton.textContent = "Edit Content"
    editButton.className = "edit-button"
    editButton.addEventListener("click", editPopUp)
    container.appendChild(editButton)
}

function editPopUp(event){
    //id of current todo
    const currentTodo = event.target.parentElement
    const currentID = currentTodo.id
    document.edit.id = `${currentID}-form`
    //get components
    const currentTitle = document.getElementById(`${currentID}-title`)
    const currentPrice = document.getElementById(`${currentID}-price`)
    const currentImg = document.getElementById(`${currentID}-img`)
    const currentDescription = document.getElementById(`${currentID}-description`)
    //fill form
    if (currentTitle){
        document.edit.title.value = currentTitle.textContent
    }
    if (currentPrice){
        let price = currentPrice.textContent.slice(1, currentPrice.textContent.length)
        document.edit.price.value = parseFloat(price)
    }
    if (currentImg){
        document.edit.img.value = currentImg.src
    }
    if (currentDescription){
        document.edit.description.value = currentDescription.textContent
    }
    const editDialog = document.getElementById("edit-dialog")
    editDialog.open = true
    
}

document.edit.addEventListener("submit", editTodo)


function editTodo(event){
    event.preventDefault()
    //edit object
    const newEditObj = {
        title: document.edit.title.value
    }

    newEditObj.imgUrl = document.edit.img.value
    newEditObj.price = document.edit.price.value
    newEditObj.description = document.edit.description.value

    console.log(newEditObj)
    //send
    const editId = document.edit.id.split("-")[0]
    axios.put(`https://api.vschool.io/Danwarren/todo/${editId}`, newEditObj)
        .then(response => {
        const updated = response.data
        const updatedTodo = createTodo(updated)
        updateCurrent(updatedTodo, editId)
        
        })
        .catch(error => console.log(error))
    event.target.parentElement.open = false
}