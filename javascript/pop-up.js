// Показать полупрозрачный DIV, чтобы затенить страницу 
// (форма располагается не внутри него, а рядом, потому что она не должна быть полупрозрачной)
function showCover() {
  let coverDiv = document.createElement('div');
  coverDiv.id = 'cover-div';

  // убираем возможность прокрутки страницы во время показа модального окна с формой
  document.body.style.overflowY = 'hidden';

  document.body.append(coverDiv);
}

function hideCover() {
  document.getElementById('cover-div').remove();
  document.body.style.overflowY = '';
}

function showPrompt(text, valueURL, valueHTML, callback) {
  showCover();
  let form = document.getElementById('prompt-form');
  let container = document.getElementById('prompt-form-container');
  document.getElementById('prompt-message').innerHTML = text;
  //form.text.value = '';
  document.getElementById("text-url").value = valueURL;
  document.getElementById("text-html").value = valueHTML;

  function complete(value) {
	hideCover();
	container.style.display = 'none';
	document.onkeydown = null;
	callback();
  }

  form.onsubmit = function() {
	//let value = form.text.value;

	let valueURL = document.getElementById("text-url").value;
	let valueHTML = document.getElementById("text-html").value;
	
	if (valueURL == '' || valueHTML == '') {
		hideCover();
		container.style.display = 'none';
		document.onkeydown = null;
		return false; // игнорируем отправку пустой формы
	}
	complete(valueURL.concat(valueHTML));
	return false;
  };

  form.cancel.onclick = function() {
	hideCover();
	container.style.display = 'none';
	document.onkeydown = null;
	//complete(null);
  };

  document.onkeydown = function(e) {
	if (e.key == 'Escape') {
	  //complete(null);
		hideCover();
		container.style.display = 'none';
		document.onkeydown = null;
	}
  };

  let lastElem = form.elements[form.elements.length - 1];
  let firstElem = form.elements[0];

  lastElem.onkeydown = function(e) {
	if (e.key == 'Tab' && !e.shiftKey) {
	  firstElem.focus();
	  return false;
	}
  };

  firstElem.onkeydown = function(e) {
	if (e.key == 'Tab' && e.shiftKey) {
	  lastElem.focus();
	  return false;
	}
  };

  container.style.display = 'block';
  //form.elements.text.focus();
}

