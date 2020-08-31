var todayRowNumber=1; 
var yesterdayRowNumber=1;

function addRow(buttonId, valueURL, valueHTML) {		   
	var trBegin;
	var tableSelector;
	var rowNumber;
	var tdClassUrl;
	var tdClassDiv;
	var divClass;
	if(buttonId==='today-add-button') {
		trBegin='today-tr-';
		tableSelector='today';
		rowNumber=todayRowNumber;
		todayRowNumber++;
		tdClassUrl='ttu today-td-URL';
		tdClassDiv='today-td-URL';
		divClass='today-td-div';
	}
	else {
		trBegin='yesterday-tr-';
		tableSelector='yesterday';
		rowNumber=yesterdayRowNumber;
		yesterdayRowNumber++;
		tdClassUrl='ytu yesterday-td-URL';
		tdClassDiv='yesterday-td-URL';
		divClass='yesterday-td-div';
	}
	
	var trId = trBegin + rowNumber;
	var tr = document.createElement('TR');
	tr.setAttribute('id', trId);
	
	var tbody = document.getElementById(tableSelector);
	tbody.tBodies[0].appendChild(tr);
	
	var td0 = document.createElement('TD');
	td0.setAttribute('class', 'check');
	
	var input = document.createElement('input');
	input.type = "checkbox";
	input.name = 'chk-' + rowNumber;
	td0.appendChild(input);
	document.getElementById(trId).appendChild(td0);
	
	var td2 = document.createElement('TD');
	td2.setAttribute('class', tdClassUrl);

	var td2Value = document.createTextNode(valueURL);
	td2.appendChild(td2Value);
	document.getElementById(trId).appendChild(td2);
	
	
	var td1 = document.createElement('TD');
	td1.setAttribute('class', tdClassDiv);
	var div1 = document.createElement('DIV');
	div1.setAttribute('class', divClass);
	
	td1.appendChild(div1);
	var div1Value = document.createTextNode(valueHTML);
	div1.appendChild(div1Value);
	
	document.getElementById(trId).appendChild(td1);
	
	//if (rowNumber == 1)

	//var tr2 = document.getElementById('today-tr-' + (rowNumber-1));
	//var parentDiv = tr2.parentNode;

	//parentDiv.insertBefore(tr, tr2);
	//parentDiv.insertBefore(tr, tr2.nextSibling);
}

function findRowByFirstTD(tableId, value) { 
	//возвращает второй элемент td и div третьего элемента td в строке таблицы,
	// найденной по содержимому второго элемента td
	var tbl=document.getElementById(tableId).tBodies[0];
	
	var tdSelector;
	if(tableId==='today') {
		tdSelector='td.ttu';
	}
	else {
		tdSelector='td.ytu';
	}
	
	var tds = tbl.querySelectorAll(tdSelector);
	var found;

	for (var i = 0; i < tds.length; i++) {
		if (tds[i].textContent == value) {
			found = tds[i];
			break;
		}
	}
	
	if (i === tds.length) //не нашлась строка
		return undefined;
	
	var parentEl = found.parentNode;
	var td = parentEl.getElementsByTagName('td')[2];
	var div = td.getElementsByTagName('div')[0];
	
	var tdDiv = {
		  td: found,
		  div: div
	};
	
	return tdDiv;
}

function deleteRow(tableId)  {
	var table = document.getElementById(tableId).tBodies[0];
	var rowCount = table.rows.length;
	var tdSelector;
	if(tableId==='today') {
		tdSelector='today-td-URL';
	}
	else {
		tdSelector='yesterday-td-URL';
	}
	var i = 0;
	while(i<rowCount)	{
		var row = table.rows[i];
		var chkbox = row.cells[0].getElementsByTagName('input')[0];

		if('checkbox' == chkbox.type && true == chkbox.checked) {
			var key = row.getElementsByClassName(tdSelector)[0].innerHTML;
			table.deleteRow(i);
			
			if(tableId==='today')
				htToday.remove(key);
			else
				htYesterday.remove(key);
			
			rowCount--;
		}
		else
			i++;
	}
}