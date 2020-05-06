document.addEventListener("DOMContentLoaded", function() {
    //api
    const apiHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

    const get = (url) => {
        return fetch(url).then(resp => resp.json())
    }

    const post = (url, data) => {
        return fetch(url, {
          method: "POST",
          headers: apiHeaders,
          body: JSON.stringify(data)
        }).then((resp) => resp.json());
      };

      const patch = (url, id, data) => {
        return fetch(url + id, {
            method: "PATCH",
            headers: apiHeaders,
            body: JSON.stringify(data)
        }).then(resp => resp.json())
     }

    const destroy = (url, id) => {
      return fetch(url + id, {
        method: "DELETE"
      }).then((resp) => resp.json())
    }

    const API = {get, post, patch, destroy}

    //constants
    const tasksUrl = "http://localhost:3000/tasks/"

    const taskList = document.querySelector("#task-list")
    const completedList = document.querySelector("#completed-list")
    const taskForm = document.querySelector("#task-form")
    taskForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const newTask = {title: e.target[0].value, description: e.target[1].value}
      API.post(tasksUrl, newTask).then(returnedTask =>
          newTaskCard(returnedTask)
        )
        newTask.reset() 
      })

      
    

    //functions
    const getAllTasks = () => {
        API.get(tasksUrl).then(tasks => tasks.forEach(task => newTaskCard(task)))
    }

    const newTaskCard = (task) => {
        const li = document.createElement("li")
        li.className = "task-card"

        const h4 = document.createElement("h4")
        h4.innerText = task.title

        const p = document.createElement("p")
        p.innerText = task.description

        const br = document.createElement("br")

        const editButton = document.createElement("button")
        editButton.className = "btn btn-warning"
        editButton.id = "edit-button"
        editButton.innerText = "Edit"
        editButton.addEventListener("click", (e) => {
          hiddenForm(task.id, task.title, task.description, p)
        })

        const completeButton = document.createElement("button")
        completeButton.className = "btn btn-success"
        completeButton.id = "complete-button"
        completeButton.innerText = "Complete"
        completeButton.addEventListener("click", (e) => {
          li.removeChild(editButton)
          li.removeChild(completeButton)
          deleteButton.className = "btn btn-outline-danger"
          li.append(h4 , p, deleteButton)
          completedList.append(li)
        })

        const deleteButton = document.createElement("button")
        deleteButton.className = "btn btn-danger"
        deleteButton.id = "delete-button"
        deleteButton.innerText = "Delete"
        deleteButton.addEventListener("click", (e) => {
          API.destroy(tasksUrl, task.id)
          li.remove()
        })

        li.append(h4, p, completeButton, editButton, deleteButton)

        taskList.append(li)
    }

    const hiddenForm = (id, title, description, p) => {
      const hForm = document.createElement("form")
      
      const titleInput = document.createElement("input")
      titleInput.setAttribute("type", "text", "class", "form-control", "id", "edit-task-title", "placeholder", "Edit Title")
      titleInput.value = title

      const descriptionInput = document.createElement("input")
      descriptionInput.setAttribute("type", "text", "class", "form-control", "id", "edit-task-description", "placeholder", "Edit Description")
      descriptionInput.value = description

      const submitButton = document.createElement("button")
      submitButton.className = "btn btn-outline-warning"
      submitButton.innerText = "Confirm"
      submitButton.addEventListener("click", (e) => {
        e.preventDefault()
        const dataObj = {title: titleInput.value, description: descriptionInput.value}
        API.patch(tasksUrl, id, dataObj)

      })
     
      hForm.append(titleInput, descriptionInput, submitButton)
      p.append(hForm)
    }


    //call master function
    getAllTasks()
});