var htToday=new HashTable(); 
var htYesterday=new HashTable();

function addString(buttonId, urlValue, htmlValue) { // вызывается при нажатии кнопки "Добавить строку"
	var valueURL;
	var valueHTML;
	if(urlValue === undefined) {
		valueURL = document.getElementById("text-url").value;   //введенный URL на форме
		valueHTML = document.getElementById("text-html").value; //введенный HTML на форме
	}
	else {
		valueURL = urlValue;
		valueHTML = htmlValue;
	}
	
	if(buttonId==='today-add-button') {
		var elemCount=htToday.allNotUndefinedCount;
		htToday.put(valueURL, valueHTML);
		
		if ((htToday.allNotUndefinedCount - elemCount) > 0) //если элемент был добавлен в хэш-таблицу
			addRow(buttonId, valueURL, valueHTML); //тогда добавляем строку в таблицу html
		
		else { //если элемент хэш-таблицы должен быть изменен (заданный ключ уже существует)
			//тогда находим строку таблицы html и меняем содержимое ее второго столбца
			var div = findRowByFirstTD('today', valueURL).div;
			div.innerHTML = valueHTML;
		}
	}
	else if(buttonId==='yesterday-add-button') {
		var elemCount=htYesterday.allNotUndefinedCount;
		htYesterday.put(valueURL, valueHTML);
		
		if ((htYesterday.allNotUndefinedCount - elemCount) > 0) //если элемент был добавлен в хэш-таблицу
			addRow(buttonId, valueURL, valueHTML); //тогда добавляем строку в таблицу html
		
		else { //если элемент хэш-таблицы должен быть изменен (заданный ключ уже существует)
			//тогда находим строку таблицы html и меняем содержимое ее второго столбца
			var div = findRowByFirstTD('yesterday', valueURL).div;
			div.innerHTML = valueHTML;
		}
	}
	else
		alert('addString: wrong buttonId='+buttonId);
	
}

function changeString(oldURL, buttonId) { // вызывается при нажатии строки таблицы 
	//(передается предыдущее значение ее первого столбца
	
	var valueURL = document.getElementById("text-url").value;   //введенный URL на форме
	var valueHTML = document.getElementById("text-html").value; //введенный HTML на форме
	
	if (oldURL === valueURL) { //если новое значение URL (ключ) совпадает с предыдущим
		//тогда не нужно добавлять строку в хэш таблицу
		// а нужно найти строку хэш таблицы по ключу valueURL
		// и обновить значение html (valueHTML)
		var tdDiv;
		if(buttonId==='today-add-button') {
			htToday.put(valueURL, valueHTML);
			tdDiv = findRowByFirstTD('today', oldURL);
		}
		else {
			htYesterday.put(valueURL, valueHTML);
			tdDiv = findRowByFirstTD('yesterday', oldURL);
		}
		tdDiv.div.innerHTML = valueHTML;
	}
	else { //если новое значение URL (ключ) не совпадает с предыдущим
		var tableId;
		
		if(buttonId==='today-add-button')
			tableId = 'today';
		else {
			tableId = 'yesterday';
		}
		
		//находим строку таблицы html по предыдущему ключу, а точнее
		// первый элемент td и div второго элемента td этой строки
		var tdDiv = findRowByFirstTD(tableId, oldURL);
		
		//определяем, существует ли в таблице html
		//строка с новым значением ключа (URL)
		var tdDivNew = findRowByFirstTD(tableId, valueURL);
		
		var changedTdDiv;
		if (tdDivNew === undefined) //тогда меняем строку таблицы html со старым значением ключа
			changedTdDiv = tdDiv;
		else {
			//тогда меняем строку таблицы html с новым значением ключа
			changedTdDiv = tdDivNew;
			// а строку таблицы html со старым значением ключа удаляем
			var delTr = document.getElementById(tdDiv.td.parentNode.id);
			delTr.parentNode.removeChild(delTr);
		}
		
		changedTdDiv.td.innerHTML = valueURL;
		changedTdDiv.div.innerHTML = valueHTML;

		//удаляем из хэш таблицы строку со старым ключом (URL)
		//и кладем туда строку с новым значением
		if(buttonId==='today-add-button') {
			htToday.remove(oldURL);
			htToday.put(valueURL, valueHTML);
		}
		else {
			htYesterday.remove(oldURL);
			htYesterday.put(valueURL, valueHTML);
		}
		
	}
}

function getPrime(value, lg) {
	var m = 2;
	if(lg==='less')
		m*=-1;
	value+=(m/2);
	if(value%2===0)
		value+=(m/2);
	var result=isPrime(value);
	while(result===false) {
		value+=m;
		result=isPrime(value);
	}
	return value;
}

function isPrime(value) {
    if (value%2 === 0)
        return (value===2);
    d=3;
    while ((d*d<=value) && (value%d !== 0))
        d+=2;
    return (d*d)>value;
}

function getReport() {
	var ind;
	var text1='';
	var text2='';
	var text3='';
	var url;
	for(var i=0;i<htYesterday.table.length;i++) {
		if(htYesterday.table[i] !== undefined && htYesterday.table[i].deleted===false) {
			url=htYesterday.table[i].url;
			ind=htToday.find(url, 'forRemove', htToday.table);
			if(ind!==undefined && htToday.table[ind] !==undefined && htToday.table[ind].deleted !== true) {
				if(htToday.table[ind].html!==htYesterday.table[i].html)
					text2+=(url+'<br>');
			}
			else
				text1+=(url+'<br>');
		}
	}
	
	for(var i=0;i<htToday.table.length;i++) {
		if(htToday.table[i] !== undefined && htToday.table[i].deleted===false) {
			url=htToday.table[i].url;
			ind=htYesterday.find(url, 'forRemove', htYesterday.table);
			if(!(ind!==undefined && htYesterday.table[ind] !==undefined && htYesterday.table[ind].deleted !== true)) {
				text3+=(url+'<br>');
			}
		}
	}
	
	var p=document.getElementById("report");
	//p.innerHTML="Здравствуйте, дорогая и.о. секретаря<br>За последние сутки во вверенных Вам сайтах произошли следующие изменения:<br><br>Исчезли следующие страницы:{здесь список урлов}<br><br>Появились следующие новые страницы {здесь список урлов}<br><br>Изменились следующие страницы {здесь список урлов}<br><br>С уважением,<br>автоматизированная система<br>мониторинга.<br>";
	p.innerHTML=`Здравствуйте, дорогая и.о. секретаря<br>
			За последние сутки во вверенных Вам сайтах произошли следующие изменения:<br><br>
			
			Исчезли следующие страницы:<br>`+text1+`<br><br>
			
			Появились следующие новые страницы:<br>`+text3+`<br><br>
			
			Изменились следующие страницы:<br>`+text2+`<br><br>
			
			С уважением,<br>
			автоматизированная система<br>
			мониторинга.<br>`;
}

