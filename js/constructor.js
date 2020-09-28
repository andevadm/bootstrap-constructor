// Edited component and its container block
// Container differs from edited component for composite elements like text+image
var editedElement = null; // = $('h1')[0];
var containerBlock = null;

$(document).ready(function(){

// Form to edit created components
var editForm = document.createElement('form');
editForm.id = 'editForm';
$(editForm).addClass('row');
// Components of the edit form
var editComponents = {};
editComponents.default = 
	`<p class="text-danger container-fluid">
		Edit is not available
	</p>`;
editComponents.textEdit = 
	`<div class="form-group col-md">
		<label for="textInput">Please edit the text:</label>
		<textarea class="form-control" id="textInput" rows="5">New text</textarea>
	</div>`;
editComponents.textProperties = 
	`<div class="form-group col-md">
		<div class="row">
			<div class="col">
				<label for="textSize">Text size</label>
				<div class="input-group">
					<input type="number" class="form-control" id="textSize" value="">
					<div class="input-group-append">
    					<span class="input-group-text">px</span>
  					</div>
				</div>
			</div>
			<div class="col">
				<label for="textColor">Text color</label>
				<input type="color" id="textColor" class="form-control" value="#000000">
			</div>
		</div>
		<div class="row">
			<div class="col">
				<div class="custom-control custom-checkbox">
					<input type="checkbox" class="custom-control-input" id="textCenter" checked>
					<label class="custom-control-label" for="textCenter">Centered text</label>
				</div>
				<div class="custom-control custom-checkbox">
					<input type="checkbox" class="custom-control-input" id="textBold" checked>
					<label class="custom-control-label" for="textBold">Bold text</label>
				</div>
				<div class="custom-control custom-checkbox">
					<input type="checkbox" class="custom-control-input" id="textHighlight">	
					<label class="custom-control-label" for="textHighlight">Highlighted text</label>
				</div>
			</div>
			<div class="col">
				<button class="btn btn-danger" type="button" id="buttonRemove" data-toggle="modal" data-target="#modalRemove">Remove</button>
				<button class="btn btn-success" type="button" id="buttonComplete">Done</button>
			</div>
		</div>
	</div>`;


// Activation of the edit form
$('#publication').on('click', '.constructed', function(){
	// No action if the selected component is currenly editing
	if ( this == editedElement ) return;
	// If a new component is selected, make it editing
	editedElement = this;
	// Select container of the editing component (actual for composite elements)
	containerBlock = (this.tagName == 'DIV') ? $(this).parents('.container-fluid')[0] : this;
	// Add elements of the editing form depending on type of the edited component
	// For text components
	if ( $(this).hasClass('textBlock') ) {
		$(editForm).html(editComponents.textEdit + editComponents.textProperties);
		$(editForm).find('#textInput')
			.val( $(editedElement).text() );
		$(editForm).find('#textSize')
			.val( Math.floor(
				$(editedElement).css('font-size').substr(0, $(editedElement).css('font-size').length - 2) 
				) 
			);
		// $(editForm).find('#textColor') - disabled due to the difference in the color schemes, supplementary function is necessary
		$(editForm).find('#textCenter')[0]
			.checked = ( $(editedElement).css('text-align') == 'center' ) ? true : false;
		$(editForm).find('#textBold')[0]
			.checked = ( $(editedElement).hasClass('font-weight-bold') ) ? true : false;
		$(editForm).find('#textHighlight')[0]
			.checked = ( $(editedElement).hasClass('bg-highlight') ) ? true : false;
	} 
	// Default edit form for elements where edit is not available
	else {
		$(editForm).html(editComponents.default);
	}
	// Append the edit form
	$(containerBlock).after(editForm);
  	$(editForm).slideDown();
  	console.log(`Element ${this.tagName} is ready to be edited`);
});

// Edit events

// Text edit
$(editForm).on('keyup', '#textInput', function(){
	$(editedElement).text( $('#textInput').val() );
});
// Text size changed
$(editForm).on('change', '#textSize', function(){
	$(editedElement).css( 'font-size', `${$(this).val()}pt` );
});
// Text color changed
$(editForm).on('change', '#textColor', function(){
	$(editedElement).css( 'color', $(this).val() );
});
// Text is centered
$(editForm).on('change', '#textCenter', function(){
	if ( this.checked ) {
		$(editedElement).addClass('text-center');
		$(editedElement).removeClass('text-justify');
	} else {
		$(editedElement).removeClass('text-center');
		$(editedElement).addClass('text-justify');
	}	
});
// Text is bold
$(editForm).on('change', '#textBold', function(){
	if ( this.checked ) {
		$(editedElement).addClass('font-weight-bold');
	} else {
		$(editedElement).removeClass('font-weight-bold');
	}	
});
// Text block is highlighted by preset colors of background and border
$(editForm).on('change', '#textHighlight', function(){
	if ( this.checked ) {
		$(editedElement).addClass('border border-dark-green bg-highlight');
	} else {
		$(editedElement).removeClass('border border-dark-green bg-highlight');
	}	
});
// Delete component
$(editForm).on('click', '#buttonRemove', function(){
	
});
// Confirmation of deletion in a modal
$('#modalRemove').on('click', '#confirmRemove', function(){
	$(containerBlock).remove();
	$('#editForm').slideUp();
	$('#modalRemove').modal('hide');
	console.log(`Element ${containerBlock.tagName} removed`);
});
// Edit completed
$(editForm).on('click', '#buttonComplete', function(){
	$(editedElement).text( $('#textInput').val() );
	console.log('Text edit completed');
	$('#editForm').slideUp();
	editedElement = null;
});
// Preventing form submit when Enter is pressed
$(editForm).on('submit', function(){
	event.preventDefault();
});

// Select in the "New component" dropdown
$('#paragraph').on('click', (event) => { event.preventDefault(); addText('p', 'paragraph') });
$('#subheader').on('click', (event) => { event.preventDefault(); addText('h2', 'subheading') });
/* 	Functions to add image blocks are working but temporary disabled
	editForm is working for text content of #imageLeft and #imageRight
	The functions are not used until editForm for imgBlock is implemented
$('#image').on('click', (event) => { event.preventDefault(); addImage('4', 'img/new_image.png', 'center') });
$('#imageLeft').on('click', (event) => { event.preventDefault(); addImage('4', 'img/new_image.png', 'left') });
$('#imageRight').on('click', (event) => { event.preventDefault(); addImage('4', 'img/new_image.png', 'right') });
*/

}); // $(document).ready

function addText(tag, name) {
// Add new text tag containing `New ${name}`
	var newElement = document.createElement(tag);
	$(newElement)
		.addClass('constructed textBlock')
		.append(`New ${name}`);
 	$('#publication').append(newElement);
 	console.log(`New ${newElement.tagName} is created`);
}

function addImage(size, src, position) {
// Add new block with img in center or img+text on left/right
// size - adaptive image size from 1 to 12
// src - рimage file location
// position - image position: 'center' (no text), 'left' or 'right'
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
			$(newElement.firstElementChild).append('<div class="col-md constructed textBlock">New text</div>');
			break;
		case 'right':
			$(newElement.firstElementChild).prepend('<div class="col-md constructed textBlock">New text</div>');
			break;
		default:
			$(newElement.firstElementChild).append('<div class="col-md"></div>');
			$(newElement.firstElementChild).prepend('<div class="col-md"></div>');
	}
	$('#publication').append(newElement);
 	console.log(`New image block is created`);
}