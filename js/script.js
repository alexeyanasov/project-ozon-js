let noteIdCounter = 8
let columnIdCounter = 4
let draggedNote = null

// Создание карточки

document
	.querySelectorAll('.column')
	.forEach(columnProcess)
	// .forEach(columnElement => {
	// 	const spanAction_addNote = columnElement.querySelector('[data-action-addNote]')
		
	// 	spanAction_addNote.addEventListener('click', function (event){
	// 		const noteElement = document.createElement('div')
	// 		noteElement.classList.add('note')
	// 		noteElement.setAttribute('draggable', 'true')
	// 		noteElement.setAttribute('data-note-id', noteIdCounter)

	// 		noteIdCounter++

	// 		columnElement.querySelector('[data-notes]').append(noteElement)
	// 		// console.log(this)
	// 		// <div class="note" draggable="true" data-note-id="7">Купить собачий корм.</div>
	// 	})
	// })

// Создание колонки

document
	.querySelector('[data-action-addColumn]')
	.addEventListener('click', function(event){
		const columnElement = document.createElement('div')
		columnElement.classList.add('column')
		columnElement.setAttribute('draggable', 'true')
		columnElement.setAttribute('data-column-id', columnIdCounter)

		columnElement.innerHTML = `
			<p class="column-header" contenteditable="true">В плане</p>
				<div data-notes></div>
				<p class="column-footer">
				<span data-action-addNote class="action">+ Добавить карточку</span>
			</p>`

		columnIdCounter++
		document.querySelector('.columns').append(columnElement)

		columnProcess(columnElement)

		// <div class="column" draggable="true" data-column-id="1">
		// <p class="column-header" contenteditable="true">В плане</p>
		// 		<div data-notes>
		// 			<div class="note" draggable="true" data-note-id="1">Тут какая-та задача о чем-то интересном.</div>
		// 			<div class="note" draggable="true" data-note-id="2">А это задача о чем-то не интересном.</div>
		// 			<div class="note" draggable="true" data-note-id="3">Купить собачий корм.</div>
		// 		</div>
		// 		<p class="column-footer">
		// 		<span data-action-addNote class="action">+ Добавить карточку</span>
		// 	</p>
		// 	</div>
	})

// Ищем заметки и редактируем
document
	.querySelectorAll('.note')
	.forEach(noteProcess)

// Функция создания карточки
function columnProcess (columnElement){
	const spanAction_addNote = columnElement.querySelector('[data-action-addNote]')
	
	spanAction_addNote.addEventListener('click', function (event){
		const noteElement = document.createElement('div')
		noteElement.classList.add('note')
		noteElement.setAttribute('draggable', 'true')
		noteElement.setAttribute('data-note-id', noteIdCounter)

		noteIdCounter++

		columnElement.querySelector('[data-notes]').append(noteElement)
		noteProcess(noteElement)

		noteElement.setAttribute('contenteditable', true)
		noteElement.focus()
	})


	// Редактирование заголовка
	const headerElement = columnElement.querySelector('.column-header')
	headerElement.addEventListener('dblclick', function(event){
		headerElement.setAttribute('contenteditable', true)
		headerElement.focus()
	})

	headerElement.addEventListener('blur', function(event){
		headerElement.removeAttribute('contenteditable', true)
	})	

	columnElement.addEventListener('dragover', function(event){
		event.preventDefault()
	})

	columnElement.addEventListener('drop', function(event){
		if(draggedNote){
			return columnElement.querySelector('[data-notes]').append(draggedNote)
		}
	})
}

function noteProcess(noteElement){
	noteElement.addEventListener('dblclick', function(event){
		noteElement.setAttribute('contenteditable', true)
		noteElement.removeAttribute('draggable', true)
		noteElement.closest('.column').removeAttribute('draggable', true)
		noteElement.focus()
	})

	noteElement.addEventListener('blur', function(event){
		noteElement.removeAttribute('contenteditable', true)
		noteElement.setAttribute('draggable', true)
		noteElement.closest('.column').setAttribute('draggable', true)
		
		if(noteElement.textContent.trim().length){
			noteElement.remove
		}
	})


	noteElement.addEventListener('dragstart', dragstart_noteHandler)
	noteElement.addEventListener('dragend', dragend_noteHandler)
	noteElement.addEventListener('dragenter', dragenter_noteHandler)
	noteElement.addEventListener('dragover', dragover_noteHandler)
	noteElement.addEventListener('dragleave', dragleave_noteHandler)
	noteElement.addEventListener('drop', drop_noteHandler)
}

// Перетаскивание карточек

// Кого перетаскивают
function dragstart_noteHandler(event){
	// console.log('dragstart', event, this)
	draggedNote = this
	this.classList.add('dragged')

	event.stopPropagation()
}
function dragend_noteHandler(event){
	// console.log('dragend', event, this)
	draggedNote = null
	this.classList.remove('dragged')

	document
		.querySelectorAll('.note')
		.forEach(x => x.classList.remove('under'))
}


// Над кем перетаскивают
function dragenter_noteHandler(event){
	// console.log('dragenter', event, this)
	if (this === draggedNote){
		return
	}
	this.classList.add('under')
}
function dragover_noteHandler(event){
	event.preventDefault()
	// console.log('dragover', event, this)
	if (this === draggedNote){
		return
	}
}
function dragleave_noteHandler(event){
	// console.log('dragleave', event, this)
	if (this === draggedNote){
		return
	}
	this.classList.remove('under')
}
function drop_noteHandler(event){
	event.stopPropagation()

	// console.log('drop', event, this)
	if (this === draggedNote){
		return
	}
	// console.log(this)
	// console.log(draggedNote)
	if(this.parentElement === draggedNote.parentElement){
		const note = Array.from(this.parentElement.querySelectorAll('.note'))
		const indexA = note.indexOf(this)
		const indexB = note.indexOf(draggedNote)

		if(indexA < indexB){
			this.parentElement.insertBefore(draggedNote, this)
		}
		else{
			this.parentElement.insertBefore(draggedNote, this.nextElementSibling)

		}
	}
	else{
		this.parentElement.insertBefore(draggedNote, this)
	}
}

