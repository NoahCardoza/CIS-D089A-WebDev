
class Terminal {
	constructor(root, sys){
		Terminal.instances.add(this);
		this.root = root;
		this.sys = sys;
		//		API('desktop', {init:'terminal'}).then((r)=>{
		//			if (r.status){
		//				this.init(root, r.id);
		//			} else {
		//				console.error("Couldn't Retrive Window ID!");
		//			}
		//		});
		this.init(Math.random());
	}

	init(id)
	{
		this.id = id;
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
			parent : createElement('div', {className:"app-terminal", id:id}),
			stdout : createElement('div', {className:"stdout"}),
			prompt : createElement('div', {className:"prompt-active"}),
			pwd : createElement('span', {className:"pwd", innerText:this.env.pwd}),
			input : createElement('input', {type:"text", autocapitalize:false}),
		};
		
		this.e.parent.appendChild(this.e.stdout);
		this.e.parent.appendChild(this.e.prompt);
		this.e.prompt.appendChild(this.e.pwd);
		this.e.prompt.appendChild(this.e.input);
		this.focus = this.focus.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.e.parent.addEventListener("click", this.focus);
		this.e.input.addEventListener("keydown", this.onkeydown);
		this.root.appendChild(this.e.parent);
		this.send('entry', '&nbsp;')
		this.send('entry', "Logged in on "+(new Date()).toGMTString())
		this.welcome();
	}

	welcome(){
		var t = 1;
		setTimeout(()=>this.send("entry", "Welcome to the BOT.net"),t++ * 1000)
		setTimeout(()=>this.send("entry", "We regret to inform you that this os is incomplete."),t++ * 1000)
		setTimeout(()=>this.send("entry", "A few commands that work are:"),t++ * 2000)
		setTimeout(()=>{
			this.send("entry", "echo<br>date<br>ls<br>cd")
			this.focus();
		}, t * 2000)
	}

	onkeydown(e){
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

	focus(){
			if (!getSelectedText())
				this.e.input.focus();
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
		API("terminal", {id:this.id, stdin:cmd, env:this.env}).then(this.exe.bind(this, prompt)) 
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
		if (req.open)
		{
			this.open(req.open);
		}
		if (req.callback){
			console.log('not yet implemented')
		}
		this.e.stdout.scrollTop = this.e.stdout.scrollHeight;

		this.e.input.removeAttribute('disabled');
		if (document.activeElement == document.body)
			this.e.input.focus();
	}

	close(){
		this.e.parent.removeEventListener("click", this.focus);
		this.e.input.removeEventListener("keydown", this.onkeydown);
		this.root.removeChild(this.e.parent);
	}
}

Terminal.prototype.fscmd = {
	cat: function(path){
		console.log(this.sys.fs.read(path))
	}
}

Terminal.instances = new Set();

