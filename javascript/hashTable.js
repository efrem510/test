class HashTable {
 
	constructor() {
		this.initArrSize=11; //начальный размер массива при создании (простое число)
		this.arrSize=this.initArrSize; //фактический размер массива
		
		// при создании объекта создаем 
		// массив начальным размером arrSize
		this.table=new Array(this.arrSize);
		
		this.elemCount=0; //количество элементов массива без учета удаленных
		this.allNotUndefinedCount=0;  //количество элементов массива с учетом удаленных
		this.resizeK=0.75; //коэффициент динамического увеличения массива (elemCount > (resizeK*arrSize))
		this.secondHashDiv=7; //остаток от деления на это число во втором хэш (простое число)
	}

	firstHash(str, table) {
		const seed=0;
		let h=murmurhash2_32_gc(str, seed);
		
		return Math.abs(h)%table.length;
	}
	
	secondHash(str, table) {
		let sum=0;
		const M=37;

		for (var i=0;i<str.length;i++)
			sum+=M*sum+str.charCodeAt(i);
		
		let total=sum%table.length;
		
		return (total%(this.secondHashDiv) +1);
	}

	find(key, reason, table) {
		let h1=this.firstHash(key, table);//вычислим первый хэш (он и размер таблицы взаимопросты)
		let position=h1;
		
		if(table[position] === undefined) //если по данному хэш нет элементов в массиве
			return position;
			
		else {
			//определяем величину шага если по первому хэш уже есть в массиве значение
			//величина шага и размер таблицы взаимопросты 
			let step=this.secondHash(key, table);
			
			let stepsCount=0; //проверка количества итераций (чтобы не зациклиться)
			
			let firstDeleted=-1; //отслеживание первого удаленного элемента в кластере поиска
			
			//идем по массиву с равномерным шагом пока не найдем ключ или пустое значение
			while(stepsCount < table.length
					&& !(table[position] === undefined || table[position].url === key)) {
				//отслеживание первого удаленного элемента в кластере поиска
				if(firstDeleted===-1 && table[position].deleted===true)
					firstDeleted=position;
				
				position=(position+step)%table.length;
				stepsCount++;
			
			}
			
			//если цель поиска - вставка элемента
			if(reason==='forPut') {
				
				//если не нашелся удаленный элемент (в кластере поиска)
				if(firstDeleted===-1) {
					//если нет подходящей позиции
					if(stepsCount===table.length)
						return undefined;
					else
						return position;
				}
				else
					return firstDeleted;
				
			}
			//если цель поиска - удаление элемента
			else if(reason==='forRemove') {
				//если нет подходящей позиции
				if(stepsCount===table.length)
					return undefined;
				else
					return position;
			}
			else {
				alert('неправильная цель поиска');
				return undefined;
			}
		}
	}
	
	put(str1, str2) {
		//контроль динамического расширения массива
		if((this.elemCount + 1)>parseInt(this.resizeK*this.arrSize))
            this.expand();
			
        //если количество удаленных элементов относительно большое
		else if((this.elemCount - this.allNotUndefinedCount)>(this.arrSize/2))
            //тогда делаем это количество равным нулю
			this.undefDelElems();
		
		//найдем позицию в массиве, куда будем вставлять элемент
		let position=this.find(str1, 'forPut', this.table);
		
		//если позиция не нашлась
		//однако такого не должно быть так как
		//в такой ситуации производится динамическое увеличение массива
		if(position === undefined)
			alert('некуда вставлять элемент');
		else {
			
			//если это вставка, а не изменение элемента по ключу (ранее встречавшемуся в массиве)
			if(this.table[position] === undefined) {
				//инициализируем объект вставки
				let kv = {
				  url: str1,
				  html: str2,
				  deleted: false
				};
				
				//в любом случае кол-во элементов массива увеличивается
				this.elemCount+=1;
				//увеличивается количество не удаленных элементов
				this.allNotUndefinedCount++;
				//вставка элемента
				this.table[position]=kv;
			}
			else {
				//необходимо знать, это позиция удаленного ранее элемента или нет
				// для контроля количества удаленных элементов
				if(this.table[position].deleted===false) {
					//в данном случае мы обновляем значение элемента с ключом, уже встречавшимся ранее
					this.table[position].html=str2;
				}
				else {
					//вставка на место удаленного элемента
					this.table[position].url=str1;
					this.table[position].html=str2;
					this.table[position].deleted=false;
					
					//увеличивается количество не удаленных элементов
					this.allNotUndefinedCount++;
				}
			}
		}
	}
	
	remove(key)	{
		let position=this.find(key, 'forRemove', this.table);
		if(this.table[position] !== undefined) {
			this.table[position].deleted = true;
			//уменьшается количество не удаленных элементов
			this.allNotUndefinedCount--;
		}
		else
			alert('can not find element by key for remove');
		
	}
	
	undefDelElems() {
		/*for (const ind in this.table) {
			if(this.table[ind] !== undefined && this.table[ind].deleted===true) {
				this.table[ind]=undefined;
				this.elemCount--;
			}
		}*/
		
		var newArray = new Array(this.arrSize);
		var newPosition;
		var newElemCount=0;
		for(var i=0; i<this.arrSize; i++) {
			if(this.table[i] !== undefined && this.table[i].deleted===false) {
				newPosition=this.find(this.table[i].url, 'forPut', newArray);
				let kv = {
				  url: this.table[i].url,
				  html: this.table[i].html,
				  deleted: false
				};
				newArray[newPosition]=kv;
				newElemCount++;
			}
		}
		var oldArray=this.table;
		this.table=newArray;
		//delete(oldArray);
		oldArray.splice(0, oldArray.length);
		this.arrSize=this.table.length;
		this.elemCount=newElemCount;
		this.allNotUndefinedCount=newElemCount;
	}
	
	expand() {
		/*this.undefDelElems();
		let newArrSize=getPrime(this.arrSize*2, 'gross');
		for(var i=this.arrSize+1; i<=newArrSize; i++)
			this.table.push(undefined);
		this.arrSize=newArrSize;
		if(this.arrSize < 131)
			this.secondHashDiv=getPrime(parseInt(this.arrSize*0.75), 'less');
		else
			this.secondHashDiv=97;*/
		
		let newArrSize=getPrime(this.arrSize*2, 'gross');
		var newArray = new Array(newArrSize);
		var newPosition;
		var newElemCount=0;
		for(var i=0; i<this.arrSize; i++) {
			if(this.table[i] !== undefined && this.table[i].deleted===false) {
				newPosition=this.find(this.table[i].url, 'forPut', newArray);
				let kv = {
				  url: this.table[i].url,
				  html: this.table[i].html,
				  deleted: false
				};
				newArray[newPosition]=kv;
				newElemCount++;
			}
		}
		var oldArray=this.table;
		this.table=newArray;
		oldArray.splice(0, oldArray.length);
		this.arrSize=this.table.length;
		this.elemCount=newElemCount;
		this.allNotUndefinedCount=newElemCount;
		
		if(this.arrSize < 131)
			this.secondHashDiv=getPrime(parseInt(this.arrSize*0.75), 'less');
		else
			this.secondHashDiv=97;
	}
	
	showDistro() {
		for(var i=0; i<this.arrSize; i++) {
			if(this.table[i] != undefined) {
				if(this.table[i].deleted===false)
					console.log(i, ' : ', this.table[i].url, ' : ', this.table[i].html);
				else
					console.log(i, ' : ', this.table[i].url, ' : ', this.table[i].html, ' DELETED ');
			}
			else
				console.log(i, ' :  undefined');
		}
	}
}