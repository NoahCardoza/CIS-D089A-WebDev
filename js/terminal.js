class Terminal {
	constructor(selector){
		if (!DB.terminal)
			DB.write('terminal', {history:[]})
		this.history = DB.terminal.history.length;
		this.env = {
			pwd : '/'
		};

		this.env.watch('pwd', (v) => {
			if (v == '/')
				this.e.pwd.innerText = '/';
			else
			{
				var dirs = v.split('/');
				this.e.pwd.innerText = dirs[dirs.length - 1];
			}
		});

		this.e = {
			parent	: document.querySelector(selector),
			stdout	: createElement('div', {className:"stdout"}),
    		prompt	: createElement('div', {className:"prompt-active"}),
    		pwd		: createElement('span', {className:"pwd", innerText:this.env.pwd}),
    		input	: createElement('input', {type:"text", autocapitalize:false}),
		};
		this.e.parent.appendChild(this.e.stdout);
		this.e.parent.appendChild(this.e.prompt);
		this.e.prompt.appendChild(this.e.pwd);
		this.e.prompt.appendChild(this.e.input);

		this.e.parent.onclick = () => {
			if (!getSelectedText())
				this.e.input.focus();
		}

		this.e.input.onkeydown = (e) => {
			if (e.keyCode == 13)
				this.submit();
			else if (e.keyCode == 38) // up
			{
				if (this.history - 1 >= 0)
				{
					this.e.input.value = DB.terminal.history[--this.history];
					setTimeout(()=>this.e.input.selectionStart = this.e.input.selectionEnd = this.e.input.value.length, 0) // to clear the stack
				}
			}
			else if (e.keyCode == 40) // down
			{
				if (this.history + 1 < DB.terminal.history.length)
				{
					this.e.input.value = DB.terminal.history[++this.history];
					setTimeout(()=>this.e.input.selectionStart = this.e.input.selectionEnd = this.e.input.value.length, 0) // to clear the stack
				}
				else
					this.e.input.value = "";
			}
		}

		this.send('entry', "Logged in on "+(new Date()).toGMTString())
	}
	// This sends an api request submitting whatever is in the prompt 
	submit(){
		var prompt = this.e.prompt.cloneNode(true);
		var cmd = this.e.input.value;
		DB.terminal.history.push(cmd);
		this.history = DB.terminal.history.length;
		prompt.replaceChild(createElement('span', {innerText:prompt.lastChild.value}), prompt.lastChild);
		prompt.className = 'prompt';
		this.e.stdout.appendChild(prompt);
		this.e.stdout.scrollTop = this.e.stdout.scrollHeight;
		
		this.e.input.value = '';
		this.e.input.setAttribute('disabled', '')
		API("terminal", {stdin:cmd, env:this.env}).then(this.exe.bind(this, prompt)) 
	}
	// This is used to send messages to the terminal screen
	send(location, html, argv){
		var body = document.createElement('div');
		if (location == 'entry'){
			body.className = 'entry';
			body.innerHTML = html;
			this.e.stdout.appendChild(body);
			return (body);
		} else if (location == 'error'){
			body.className = 'error';
			body.innerHTML = html;
			this.e.stdout.appendChild(body);
			return (body);
		}else {
			console.error('location invalid')
		}
	}
	exe(prompt, req){
		console.log(req);
		prompt.className = ('prompt-'+['error', 'success'][req.status]);
		if (req.stdout){
			this.e.stdout.appendChild(req.stdout.toDOM());
		}
		if (req.env){
			for (var k in req.env)
			{
				this.env[k] = req.env[k];
			}
		}
		if (req.callback){
			console.log('not yet implemented')
		}
		this.e.stdout.scrollTop = this.e.stdout.scrollHeight;

		this.e.input.removeAttribute('disabled');
		this.e.input.focus();
	}
}