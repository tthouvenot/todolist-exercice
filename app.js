/**
 * Query selector variables
 */
const taskAddButton = document.querySelector('#taskform button')
const taskListTodo = document.querySelector('.todo')
const taskListPending = document.querySelector('.pending')
const taskListDone = document.querySelector('.done')
const editButton = document.querySelector('.editTask')
const deleteButton = document.querySelector('.deleteTask')
const validateButton = document.querySelector('.validateButton')
const cancelButton = document.querySelector('.cancelButton')


/**
 * Creates a new HTML element with the given tag name and optional value.
 * @param {string} tagName - The tag name of the HTML element to be created.
 * @param {string} [value] - The text content to be set for the created element.
 * @returns {HTMLElement} - The newly created HTML element.
 */
function createNewElement(tagName, value){

    const element = document.createElement(tagName)
    if(value){
        element.innerText = value
    }
    return element
}

/**
 * Creates a container for task titles (Task, Tag, Date de fin).
 * @returns {HTMLElement} - The created task title container.
 */
function createTaskTitleContainer() {
    const container = createNewElement('div')
    container.className = 'taskTitle'
    container.append(
        createNewElement('p', 'Tâche'),
        createNewElement('p', 'Tag'),
        createNewElement('p', 'Date de fin')
    )
    return container
}

/**
 * Creates a container for task content with given data.
 * @param {string} task - The task name.
 * @param {string} tag - The task tag.
 * @param {string} deadline - The task deadline in 'YYYY-MM-DD' format.
 * @param {string} status - The task status. Default is 'A faire'.
 * @returns {HTMLElement} - The created task content container.
 */
function createTaskContentContainer(task, tag, deadline, status) {
    const container = createNewElement('div')
    container.className = 'taskContent'

    const checkboxContainer = createNewElement('div')
    checkboxContainer.className = 'taskCheckboxContainer'
    
    const checkbox = createNewElement('input')
    checkbox.type = 'checkbox'
    checkbox.className = 'taskCheckbox'
    checkboxContainer.append(checkbox)

    const elements = [
        { tagName: 'p', value: task, className: 'task' },
        { tagName: 'p', value: tag, className: 'tag' },
        { tagName: 'p', value: deadline, className: 'deadline' },
        { tagName: 'p', value: status, className: 'taskStatus hidden' }
    ]

    elements.forEach(({ tagName, value, className = '' }) => {
        const element = createNewElement(tagName, value)
        if (className) {
            element.className = className
        }
        container.append(element)
    })

    container.append(checkboxContainer)
    return container
}

/**
 * Handles the addition of a new task to the task list.
 * @param {Event} event - The event that triggered the function.
 * @listens click
 */
function addTask(event) {
    event.preventDefault()

    const form = document.querySelector('#taskform')
    const formData = new FormData(form)

    const task = formData.get('task')
    const tag = formData.get('tag')
    const deadline = formData.get('deadline').split('-').reverse().join('-')
    const status = 'A faire'

    const newTask = document.createElement('li')
    newTask.append(
        createTaskTitleContainer(),
        createTaskContentContainer(task, tag, deadline, status)
    )

    taskListTodo.append(newTask)
}


/*************************************************************************** 
 *************************************************************************** 
 ***************************************************************************/



    /**
     * Quand j'appuie sur Modifier => sélectionne tous les input type checkbox qui sont checked
     * Pour chacun des input j'affiche le bouton Valider et annuler ainsi que le status
     * Je modifie chacun des champs pour les transformer en input (text/text/date) et selection pour le status
     * Si je modifie le status la tache passe d'un module à l'autre
     * 
     */ 
//TODO reste à faire la validation et le passage d'un status à l'autre

/**
 * An array of objects representing HTML elements and their corresponding CSS classes.
 * This array is used to manage the appearance of buttons related to task editing and cancellation.
 *
 * used for classListChange function
 * 
 * @type {Array<{selectedNode: HTMLElement, className: string}>}
 */

let modifiedNodes = [{
    selectedNode: editButton,
    className: 'activeButton'
},{
    selectedNode: deleteButton,
    className: 'unusableButton'
},{
    selectedNode: validateButton,
    className: 'hidden'
},{
    selectedNode: cancelButton,
    className: 'hidden'
}]

/**
 * This function toggles the CSS classes of a list of HTML elements.
 * It iterates over an array of objects, each containing a reference to an HTML element and a CSS class name.
 * For each object, it checks if the selectedNode exists and then toggles the specified className on the selectedNode.
 * 
 * @param {Array<{selectedNode: HTMLElement, className: string}>} nodeArray - An array of objects, each containing a reference to an HTML element and a CSS class name.
 * @returns {void}
 */
function classListChange(nodeArray) {
    
    nodeArray.forEach(({ selectedNode, className }) => {
        if (selectedNode) {
            selectedNode.classList.toggle(className)
        }
    })
}


/**
 *
 * Handles the editing of a task in the task list.
 * This function is called when the edit button is clicked.
 * It checks if any task is selected, then modifies the selected tasks by replacing their content with input elements.
 * @param {Event} event - The event that triggered the function.
 * @listens click
 * @returns {void}
 */
function editTask(event) { 
    event.preventDefault()
    event.stopPropagation()

    const checkboxItem = document.querySelectorAll('input[type=checkbox]')
    let isAnyChecked = false

    for(let node of checkboxItem){
        if(node.checked){
            isAnyChecked = true
            break
        }
    }

    if(!isAnyChecked){
        alert('Veuillez sélectionner une tâche!') //TODO gérer avec une modal d'alerte
        return
    }
    
    for (let node of checkboxItem) {
        const checkboxParent = node.parentElement
        const checkboxGreatParent = checkboxParent.parentElement
        const taskContent = checkboxGreatParent.parentElement.querySelector('.taskContent')
        const taskTitle = checkboxGreatParent.parentElement.querySelector('.taskTitle')
        const taskStatus = checkboxGreatParent.querySelector('.taskStatus')
        
        let headerNode = [{
            selectedNode: taskContent,
            className: 'modifiedGrid'
        },{
            selectedNode: taskTitle,
            className: 'modifiedGrid'
        },{
            selectedNode: taskStatus,
            className: 'hidden'
        },{
            selectedNode: node,
            className: 'unusableCheckBox'
        }]
        
        
        const task = checkboxGreatParent.querySelector('.task')
        const tag = checkboxGreatParent.querySelector('.tag')
        const deadline = checkboxGreatParent.querySelector('.deadline')

        console.log(task)
        console.log(tag)
        console.log(deadline)

        let inputChange = [{
            selectedNode: task,
            oldType: 'p',
            type: 'text',
            attr: task.innerText,
            parentNode: taskContent,
            className: task.className
        },{
            selectedNode: tag,
            oldType: 'p',
            type: 'text',
            attr: tag.innerText,
            parentNode: taskContent,
            className: tag.className
        },{
            selectedNode: deadline,
            oldType: 'p',
            type: 'date',
            attr: deadline.innerText,
            parentNode: taskContent,
            className: deadline.className
        },{
            selectedNode: taskStatus,
            oldType: 'p',
            type: 'select',
            attr: taskStatus.innerText,
            parentNode: taskContent,
            className: taskStatus.className
        }]

        console.log('Input change: ', inputChange)

        if (node.checked) {
            classListChange(modifiedNodes)
            classListChange(headerNode)
            replaceElement(inputChange)
            modifiedInputValue(taskContent, inputChange)
        }
    }
}

let modifiedState = []

/**
 *
 * Replaces the elements in the task list with modified input elements.
 * This function is called when the edit button is clicked during task editing.
 * It iterates over an array of objects, each containing references to an HTML element, its original type,
 * the new type, its attribute value, and its parent node.
 * For each object, it creates a new element based on the new type and attribute value,
 * copies over the attributes from the original element, and replaces the original element with the new one.
 * @param {Array<{ selectedNode: HTMLElement, oldType: string, type: string, attr: string, parentNode: HTMLElement }>} eleArray - An array of objects, each containing a reference to an HTML element, its original type, the new type, its attribute value, and its parent node.
 * @returns {void}
 * 
 */
function replaceElement(eleArray) {

    eleArray.forEach(({ selectedNode, oldType, type, attr, parentNode, className }) => {

        let newElement

        if (type === 'select') {
            newElement = document.createElement('select')
            const options = ['À faire', 'En cours', 'Fini']
            options.forEach(optionText => {
                const option = document.createElement('option')
                option.value = optionText
                option.text = optionText
                newElement.appendChild(option)
            })
        } else {
            newElement = document.createElement('input')
            newElement.type = type
            newElement.value = attr
        }

        for (let attribute of selectedNode.attributes) {
            newElement.setAttribute(attribute.name, attribute.value)
        }

        modifiedState.push({
            selectedNode: newElement,
            oldType: type,
            type: oldType,
            attr: attr,
            parentNode: parentNode,
            className: className
        })

        selectedNode.parentNode.replaceChild(newElement, selectedNode)
    })
}

function validateElement(eleArray) {

    console.log('validateElement ', eleArray)

    eleArray.forEach(({ selectedNode, oldType, type, attr, parentNode, className }) => {

        let newElement

        newElement = document.createElement('p')
        newElement.className = className
        newElement.innerText = attr

        console.log('newElement', newElement)

        selectedNode.parentNode.replaceChild(newElement, selectedNode)
    })
}

/**
 *
 * Restores the original elements in the task list to their initial state.
 * This function is called when the cancel button is clicked during task editing.
 * It replaces the modified input elements (text/date/select) with their original paragraph elements.
 * @returns {void}
 *
 */
function restoreElements() {
    modifiedState.forEach(({ selectedNode, oldType, type, attr, parentNode, className }) => {

        let newElement

        newElement = document.createElement('p')
        newElement.innerText = attr
        newElement.className = className

        parentNode.replaceChild(newElement, selectedNode)
    })

    modifiedState = []
}

/**
 * Deletes a task from the task list when the delete button is clicked.
 *
 * @param {Event} event - The event that triggered the function.
 * @listens click
 * @returns {void}
 *
 */
function deleteTask(event) {
    event.preventDefault()
    event.stopPropagation()

    const checkboxItems = document.querySelectorAll('input[type=checkbox]')
    let isAnyChecked = false

    for (let node of checkboxItems) {
        if (node.checked) {
            isAnyChecked = true
            break
        }
    }

    if (!isAnyChecked) {
        alert('Veuillez sélectionner une tâche!')
        return
    }

    for (let node of checkboxItems) {
        if (node.checked) {
            const taskItem = node.closest('li')
            if (taskItem) {
                taskItem.remove()
            }
        }
    }
}

/**
 *
 * Handles the cancellation of task modifications.
 * This function is called when the cancel button is clicked during task editing.
 * It restores the original elements in the task list to their initial state and updates the appearance of buttons.
 * @param {Event} event - The event that triggered the function.
 * @listens click
 * @returns {void}
 *
 */
function cancelAction(event) { 
    event.preventDefault()
    event.stopPropagation()

    const checkboxItem = document.querySelectorAll('input[type=checkbox]')

    for (let node of checkboxItem) {
        const checkboxParent = node.parentElement
        const checkboxGreatParent = checkboxParent.parentElement
        const taskContent = checkboxGreatParent.parentElement.querySelector('.taskContent')
        const taskTitle = checkboxGreatParent.parentElement.querySelector('.taskTitle')
        
        let headerNode = [{
            selectedNode: taskContent,
            className: 'modifiedGrid'
        },{
            selectedNode: taskTitle,
            className: 'modifiedGrid'
        },{
            selectedNode: node,
            className: 'unusableCheckBox'
        }]
        
        restoreElements()
        if (node.checked) {
            classListChange(modifiedNodes)
            classListChange(headerNode)
            node.checked = false
        }
    }
}

function validateAction(event) {    
    event.preventDefault()
    event.stopPropagation()

    const checkboxItem = document.querySelectorAll('input[type=checkbox]')

    for (let node of checkboxItem) {
        const checkboxParent = node.parentElement
        const checkboxGreatParent = checkboxParent.parentElement
        const taskContent = checkboxGreatParent.parentElement.querySelector('.taskContent')
        const taskTitle = checkboxGreatParent.parentElement.querySelector('.taskTitle')
        const taskStatusElement = checkboxGreatParent.querySelector('.taskStatus');

        const modifiedElement = modifiedState.find(element => element.selectedNode === taskStatusElement);
        const selectedStatus = modifiedElement ? modifiedElement.attr : '';

        // Déterminer la liste cible en fonction du statut
        let targetList;
        if (selectedStatus === 'À faire') {
            targetList = taskListTodo;
        } else if (selectedStatus === 'En cours') {
            targetList = taskListPending;
        } else if (selectedStatus === 'Fini') {
            targetList = taskListDone;
        }

        // Déplacer la tâche vers la liste cible
        const taskItem = node.closest('li');
        if (taskItem) {
            targetList.appendChild(taskItem);
        }
        
        let headerNode = [{
            selectedNode: taskContent,
            className: 'modifiedGrid'
        },{
            selectedNode: taskTitle,
            className: 'modifiedGrid'
        },{
            selectedNode: node,
            className: 'unusableCheckBox'
        }]

        validateElement(modifiedState)
        if (node.checked) {
            classListChange(modifiedNodes)
            classListChange(headerNode)
            node.checked = false
        }
    }

    modifiedState=[]
}

// function validateAction(event) {    
//     event.preventDefault();
//     event.stopPropagation();

//     const checkboxItems = document.querySelectorAll('input[type=checkbox]');
    
//     checkboxItems.forEach(node => {
//         if (node.checked) {
//             const checkboxParent = node.parentElement;
//             const checkboxGreatParent = checkboxParent.parentElement;
//             const taskContent = checkboxGreatParent.querySelector('.taskContent');
//             const taskStatus = checkboxGreatParent.querySelector('.taskStatus');

//             console.log(taskStatus)

//             // Récupérer le statut sélectionné
//             const selectedStatus = taskStatus.querySelector('select').value;
            
//             // Déterminer la liste cible en fonction du statut
//             let targetList;
//             if (selectedStatus === 'À faire') {
//                 targetList = taskListTodo;
//             } else if (selectedStatus === 'En cours') {
//                 targetList = taskListPending;
//             } else if (selectedStatus === 'Fini') {
//                 targetList = taskListDone;
//             }

//             // Déplacer la tâche vers la liste cible
//             const taskItem = node.closest('li');
//             if (taskItem) {
//                 targetList.appendChild(taskItem);
//             }

//             // Réinitialiser l'état des boutons
//             classListChange(modifiedNodes);
//             classListChange([{
//                 selectedNode: taskContent,
//                 className: 'modifiedGrid'
//             }, {
//                 selectedNode: checkboxGreatParent.querySelector('.taskTitle'),
//                 className: 'modifiedGrid'
//             }, {
//                 selectedNode: node,
//                 className: 'unusableCheckBox'
//             }]);
            
//             node.checked = false;
//         }
//     });

//     // Réinitialiser les éléments modifiés
//     validateElement(modifiedState);
// }

function modifiedInputValue(htmlEle) {
    const childElements = htmlEle.querySelectorAll('input, select');
    console.log('Avant modification', modifiedState)
    
    childElements.forEach(node => {
        node.addEventListener('change', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const className = e.target.classList;
            const value = e.target.value;
            const type = e.target.type;

            for(let element of modifiedState){

                if((className.value === element.className)){
                    element.attr = value
                }else if(element.oldType === 'select' && type.startsWith('select')){
                    element.attr = value
                }
            }
        });
    });
}

taskAddButton.addEventListener('click', addTask)


editButton.addEventListener('click', editTask)
deleteButton.addEventListener('click', deleteTask)
cancelButton.addEventListener('click', cancelAction)
validateButton.addEventListener('click', validateAction)
