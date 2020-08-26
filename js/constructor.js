// Редактируемый элемент и его блок-контейнер
var editedElement = null; // = $('h1')[0];
var containerBlock = null;

$(document).ready(function(){

// Блок редактирования элемента
var editForm = document.createElement('form');
editForm.id = 'editForm';
$(editForm).addClass('row');
// Элементы редактирования
var editComponents = {};
editComponents.default = 
	`<p class="text-danger container-fluid">
		Редактирование элемента недоступно
	</p>`;
editComponents.textEdit = 
	`<div class="form-group col-md">
		<label for="textInput">Отредактируйте текст:</label>
		<textarea class="form-control" id="textInput" rows="5">Новый заголовок</textarea>
	</div>`;
editComponents.textProperties = 
	`<div class="form-group col-md">
		<div class="row">
			<div class="col">
				<label for="textSize">Размер текста</label>
				<div class="input-group">
					<input type="number" class="form-control" id="textSize" value="">
					<div class="input-group-append">
    					<span class="input-group-text">px</span>
  					</div>
				</div>
			</div>
			<div class="col">
				<label for="textColor">Цвет текста</label>
				<input type="color" id="textColor" class="form-control" value="#000000">
			</div>
		</div>
		<div class="row">
			<div class="col">
				<div class="custom-control custom-checkbox">
					<input type="checkbox" class="custom-control-input" id="textCenter" checked>
					<label class="custom-control-label" for="textCenter">Центрировать текст</label>
				</div>
				<div class="custom-control custom-checkbox">
					<input type="checkbox" class="custom-control-input" id="textBold" checked>
					<label class="custom-control-label" for="textBold">Выделить текст</label>
				</div>
				<div class="custom-control custom-checkbox">
					<input type="checkbox" class="custom-control-input" id="textHighlight">	
					<label class="custom-control-label" for="textHighlight">Выделить блок</label>
				</div>
			</div>
			<div class="col">
				<button class="btn btn-danger" type="button" id="buttonRemove" data-toggle="modal" data-target="#modalRemove">Удалить</button>
				<button class="btn btn-success" type="button" id="buttonComplete">Готово</button>
			</div>
		</div>
	</div>`;


// Активация формы редактирования элемента
$('#publication').on('click', '.constructed', function(){
	// Если элемент уже редактируется, ничего делать не надо
	if ( this == editedElement ) return;
	// Если выбран новый элемент, он становится редактируемым
	editedElement = this;
	// Главный контейнер блока - отличается от editedElement для сборных элементов: как текст с рисунком
	containerBlock = (this.tagName == 'DIV') ? $(this).parents('.container-fluid')[0] : this;
	// Добавление элементов редактирования, в зависимости от типа элемента, и выведение текущих параметров в форму
	// Для текстовых элементов
	if ( $(this).hasClass('textBlock') ) {
		$(editForm).html(editComponents.textEdit + editComponents.textProperties);
		$(editForm).find('#textInput')
			.val( $(editedElement).text() );
		$(editForm).find('#textSize')
			.val( Math.floor(
				$(editedElement).css('font-size').substr(0, $(editedElement).css('font-size').length - 2) 
				) 
			);
		// $(editForm).find('#textColor') - отложено из-за различия форматов цвета
		$(editForm).find('#textCenter')[0]
			.checked = ( $(editedElement).css('text-align') == 'center' ) ? true : false;
		$(editForm).find('#textBold')[0]
			.checked = ( $(editedElement).hasClass('font-weight-bold') ) ? true : false;
		$(editForm).find('#textHighlight')[0]
			.checked = ( $(editedElement).hasClass('bg-highlight') ) ? true : false;
	} 
	// По умолчанию, для элементов без функции редактирования
	else {
		$(editForm).html(editComponents.default);
	}
	// Присоединение формы
	$(containerBlock).after(editForm);
  	$(editForm).slideDown();
  	console.log(`Element ${this.tagName} is ready to be edited`);
});

// События редактирования

// Редактирование текста
$(editForm).on('keyup', '#textInput', function(){
	$(editedElement).text( $('#textInput').val() );
});
// Изменение размера текста
$(editForm).on('change', '#textSize', function(){
	$(editedElement).css( 'font-size', `${$(this).val()}pt` );
});
// Изменение цвета текста
$(editForm).on('change', '#textColor', function(){
	$(editedElement).css( 'color', $(this).val() );
});
// Центрирование текста
$(editForm).on('change', '#textCenter', function(){
	if ( this.checked ) {
		$(editedElement).addClass('text-center');
		$(editedElement).removeClass('text-justify');
	} else {
		$(editedElement).removeClass('text-center');
		$(editedElement).addClass('text-justify');
	}	
});
// Выделение текста жирным
$(editForm).on('change', '#textBold', function(){
	if ( this.checked ) {
		$(editedElement).addClass('font-weight-bold');
	} else {
		$(editedElement).removeClass('font-weight-bold');
	}	
});
// Выделение блока цветом
$(editForm).on('change', '#textHighlight', function(){
	if ( this.checked ) {
		$(editedElement).addClass('border border-dark-green bg-highlight');
	} else {
		$(editedElement).removeClass('border border-dark-green bg-highlight');
	}	
});
// Удаление элемента
$(editForm).on('click', '#buttonRemove', function(){
	
});
// Подтверждение удаления в модальном окне
$('#modalRemove').on('click', '#confirmRemove', function(){
	$(containerBlock).remove();
	$('#editForm').slideUp();
	$('#modalRemove').modal('hide');
	console.log(`Element ${containerBlock.tagName} removed`);
});
// Завершение правок
$(editForm).on('click', '#buttonComplete', function(){
	$(editedElement).text( $('#textInput').val() );
	console.log('Text edit completed');
	$('#editForm').slideUp();
	editedElement = null;
});
// Отмена отправки формы при нажатии Enter
$(editForm).on('submit', function(){
	event.preventDefault();
});

// Выбор на кнопке "Новый элемент"
$('#paragraph').on('click', () => { event.preventDefault(); addText('p', 'абзац') });
$('#subheader').on('click', () => { event.preventDefault(); addText('h2', 'подзаголовок') });
$('#image').on('click', () => { event.preventDefault(); addImage('4', 'img/new_image.png', 'center') });
$('#imageLeft').on('click', () => { event.preventDefault(); addImage('4', 'img/new_image.png', 'left') });
$('#imageRight').on('click', () => { event.preventDefault(); addImage('4', 'img/new_image.png', 'right') });

}); // $(document).ready

function addText(tag, name) {
// Добавляет к публикации новый tag с текстом "Новый name"
	var newElement = document.createElement(tag);
	$(newElement)
		.addClass('constructed textBlock')
		.append(`Новый ${name}`);
 	$('#publication').append(newElement);
 	console.log(`New ${newElement.tagName} is created`);
}

function addImage(size, src, position) {
// Добавляет к публикации новый блок с img и текстом 9слева или справа)
// size - адаптивный размер рисунка от 1 до 12
// src - расположение файла рисунка
// position - положение рисунка: center (текста нет), left или right
	var newElement = document.createElement('div');
	$(newElement)
		.addClass('container-fluid')
		.append(`
			<div class="row">
				<div class="col-md-${size} constructed imgBlock"><img src="${src}" width="100%"></div>
			</div>
			`);
	switch (position) {
		case 'left': 
			$(newElement.firstElementChild).append('<div class="col-md constructed textBlock">Новый текст</div>');
			break;
		case 'right':
			$(newElement.firstElementChild).prepend('<div class="col-md constructed textBlock">Новый текст</div>');
			break;
		default:
			$(newElement.firstElementChild).append('<div class="col-md"></div>');
			$(newElement.firstElementChild).prepend('<div class="col-md"></div>');
	}
	$('#publication').append(newElement);
 	console.log(`New image block is created`);
}
