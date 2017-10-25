
window.addEventListener("message", function(e){
	console.log(e)
}, false);


class Foxfire {
	constructor(selector){
		// if (!DB.foxfire)
			// DB.write('foxfire', {history:[]})
		// this.history = DB.terminal.history.length;
		this.e = {
			parent	: document.querySelector(selector),
			navbar	: createElement('div', {className:"url"}),
			prev	: createElement('div', {className:"arrow-left"}),
			next	: createElement('div', {className:"arrow-right"}),
			reload	: createElement('div', {className:"reload"}),
    		input	: createElement('input', {type:"text", autocapitalize:false}),
    		body	: createElement('iframe')
		};
		this.e.navbar.appendChild(this.e.prev);
		this.e.navbar.appendChild(this.e.next);
		this.e.navbar.appendChild(this.e.reload);
		this.e.navbar.appendChild(this.e.input);
		this.e.parent.appendChild(this.e.navbar);
		this.e.parent.appendChild(this.e.body);

		this.e.body.onload = () => {
			this.e.reload.classList.remove("loading");
		}

		this.e.input.onkeydown = (e) => {
			if (e.keyCode == 13)
				this.go();
		}
	}
	// This sends an api request submitting whatever is in the prompt 
	go(){
		var url = this.e.input.value;
		console.log(url);
		this.e.reload.classList.add("loading");
		// if (!url.match(/^https?:\/\//))
		// {
		// 	url = "https://" + url;
		// 	this.e.input.value = url;
		// }

		this.e.body.src = url;
		// DB.terminal.history.push(cmd);
		// this.history = DB.terminal.history.length;
		// prompt.replaceChild(createElement('span', {innerText:prompt.lastChild.value}), prompt.lastChild);
		// prompt.className = 'prompt';
		// this.e.stdout.appendChild(prompt);
		// this.e.stdout.scrollTop = this.e.stdout.scrollHeight;
		
		// this.e.input.value = '';
		// this.e.input.setAttribute('disabled', '')
		// API("terminal", {stdin:cmd, env:this.env}).then(this.exe.bind(this, prompt)) 
	}
	// This is used to send messages to the terminal screen

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