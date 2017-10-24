bin = new (class {

	constructor(){

	}

	handle(terminal, resp){
		var oldPrompt = terminal.append.prompt(resp.status, terminal.value);
		terminal.e.xinput.flush();
		if (resp.stdout){
			terminal.append.html(resp.stdout);
		}
		if (resp.callback){
			this.get(resp.callback).then((func)=>{
				var promise = func.call(Object.assign({terminal: terminal}, resp.args));
				if (promise && promise.then){ // means it is in fact a promise
					terminal.e.prompt.style.display = 'none'; // hide prompt
					promise.then((status)=>{
						oldPrompt.setAttribute('status', status || 'success'); // chages the status of the last command if need be
						terminal.e.prompt.style.display = 'inherit'; // till the process is competed
					});
				}
			});
		}
	}
	
	add(func){ 
		return new Promise(function( resolve, reject ) {
			API('terminal/js/'+func).then((function(resp){
				console.log(this);
				this[func] = new Function(resp.file);
				resolve(this[func]);
			}.bind(this)));
		}.bind(this));
	}

	get(func){ // returns a function and adds it if it hasn't been added yet
		return new Promise((resolve, reject)=>{
			if (this[func]){
				resolve(this[func]);
			} else {
				this.add(func).then((func) => {
					resolve(func);
				});
			}
		});
		
	}
});

