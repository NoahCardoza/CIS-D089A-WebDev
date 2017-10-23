class XTerminal extends HTMLElement {
  constructor() {
    super();
    this.pwd = ''; // needs to be added later
    // Create a shadow root
    this.shadow = this.attachShadow({mode: 'open'});
    this.e = {
    	stdout : document.createElement('stdout'),
    	prompt : document.createElement('prompt'),
    	pwd: document.createElement('pwd'),
    	xinput: new XInput(this),
    };

    add_shadow_style('css/x-terminal.css', this.shadow)
    this.shadow.appendChild(this.e.stdout);

    var tid = this.getAttribute('tid');
    this.e.xinput.setAttribute("active", true)
    this.e.prompt.appendChild(this.e.pwd)
    this.e.prompt.appendChild(this.e.xinput)
    
    this.shadow.appendChild(this.e.prompt);

    this.e.xinput.onkeydown = function(e){
    	if (e.keyCode == 13){
    		if (e.shiftKey){
				this.e.xinput.value.insertAt('\n', this.e.xinput.cursor++);
				this.e.xinput.render()
			}else{
				this.execute();
			}
			e.preventDefault();
    	}
    }.bind(this);

    this.append = {
    	error: (text)=>{
    		var err = document.createElement('error');
    		err.innerText = text;
    		this.e.stdout.appendChild(err);
    		return err;
    	},
    	entry: (text, cls)=>{
    		var entry = document.createElement('entry');
    		entry.innerText = text;
    		entry.className = cls || '';
    		this.e.stdout.appendChild(entry);
    		return entry;
    	},
    	html: (html)=>{
    		this.e.stdout.insertAdjacentHTML('beforeend', html);
    	},
    	elm: (elm)=>{
    		this.e.stdout.appendChild(elm);
    		return elm;
    	},
    	prompt : (status, val)=>{
    		var prompt 	= document.createElement('prompt');
	  		var pwd 	= document.createElement('pwd')
	  		pwd.innerText = this.pwd; // pwd here
	  		var span 	= document.createElement('span')
	  		span.innerText = val || '';
	  		prompt.setAttribute('class', 'executed '+status)
	  		prompt.appendChild(pwd)
	  		prompt.appendChild(span)
	  		this.e.stdout.appendChild(prompt)
	  		return prompt;
    	}
    };
    
  }

  get value() {return this.e.xinput.value;}

  execute(){ // COMMANDS EXECUTED HERE
  	var stdin = this.e.xinput.value;
	if (stdin){
		API('terminal', {stdin: stdin}).then(bin.handle.bind(bin, this)); // this probably not a good way to do it//
		// this.utils.history.add(stdin);
	} else {
		this.append.prompt('success')
	}
  }

  // append(elm, cls, val){
  // 	if (typeof(elm) == 'object'){
  // 		this.e.stdout.appendChild(elm);
  // 		return elm;
  // 	}
  // 	switch (elm){
  // 		case 'prompt':
  // 			
	 //  	case 'raw':
	 //  		this.e.stdout.insertAdjacentHTML('beforeend', val)
  // 	}
  // }
}

// XTerminal

// XTerminal.prototype.utils = function(first_argument) {
// 	// body...
// };

customElements.define('x-terminal', XTerminal);

// // Define the new element
// XTerminal = customElements.define('x-terminal', XTerminal);
