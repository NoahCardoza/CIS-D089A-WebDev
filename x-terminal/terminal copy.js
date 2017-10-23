// prototypes

String.prototype.delAt = function(i) {
		return this.substring(0, i) + this.substring(i+1, this.length);
};

String.prototype.insertAt = function(s, i) {
		return this.substring(0, i) + s + this.substring(i, this.length);
};

// Object.prototype.safePath = function() {// args are the path
//   return Array.from(arguments).reduce(function (result, key) {
//     if (typeof result !== 'undefined' && typeof result[key] !== 'undefined') {
//       return result[key]
//     }
//   }, this);
// }

terminal = new (function Terminal() {
	// varabuls
	this.$ = {
		prompt : $('prompt.active'),
		stdout : $('stdout'),
		stdin : $('stdin'),
	};

	// variable
	this.stdin = "";
	this.cursor = 0;
	this.entrys = 0;
	
	// utils
	this.utils = {
		localStorage : new (function (){
			if (!localStorage.terminal) localStorage.terminal = "{}";
			this.set = (a, v) => {
				var lterm = JSON.parse(localStorage.terminal);
				lterm[a] = v;
				localStorage.terminal = JSON.stringify(lterm);
			};
			this.get = (a) => {
				var lterm = JSON.parse(localStorage.terminal);
				return lterm[a];
			};
		})(),
		htmlSafe : (text)=>{
			return text.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>')
		},
		render : {
			prompt : (stdin) => {
				if (typeof stdin === 'string') this.stdin = stdin;
				stdin = this.stdin;
				this.cursor = (this.cursor < 0 ? 0 : this.cursor);
				this.cursor = (this.cursor > stdin.length ? stdin.length : this.cursor);

				if (stdin.length < this.cursor+1){
					this.$.stdin.html(`<span>${this.utils.htmlSafe(stdin)}</span><cursor>&nbsp;</cursor>`);
				} else {
					this.$.stdin.html(`<span>${this.utils.htmlSafe(stdin.substring(0, this.cursor))}</span><cursor>${stdin[this.cursor]}</cursor><span>${this.utils.htmlSafe(stdin.substring(this.cursor+1, stdin.length))}</span>`);
				}
			},
			ePrompt : (status)=>{ // executed prompt
				this.$.stdout.append(`<prompt class="executed ${status}"><pwd></pwd>${this.utils.prompt.flush()}</prompt>`)
			},
			error: (err)=>{
				this.$.stdout.append(`<error>${err}</error>`)
			},
			entry: (entry)=>{
				this.$.stdout.append(`<entry>${entry||''}</entry>`)
			}

		},

		prompt : {
			cursor : {
				start: () => {
					this.cursor = 0;
					this.utils.render.prompt();
				},
				end: () => {
					this.cursor = this.stdin.length;
					this.utils.render.prompt();
				}
			},

			delete : () => {
				var range = (window.getSelection && window.getSelection().type != "None" ? window.getSelection().getRangeAt(0):0) || ((document.selection && document.selection.createRange) ? document.selection.createRange():0);
				// console.log(range);
				if (range.startOffset != range.endOffset){ // needs to be tested with IE, fzzzzzz!
					this.stdin = this.stdin.substring(0, range.startOffset+1) + this.stdin.substring(range.endOffset, this.stdin.length);
					this.cursor = range.startOffset;
					this.utils.render.prompt();
				} else {
					this.stdin = this.stdin.delAt(this.cursor-1);
					this.cursor--;
					this.utils.render.prompt();
				}
			},
			flush : () => {
				var stdin = this.stdin;
				this.utils.render.prompt('');
				return stdin;
					
			},
			execute : () => { // COMMANDS EXECUTED HERE
				if (this.stdin){
					API('terminal', {stdin: this.stdin}).then(this.callbacks.handle);
					this.utils.history.add(this.stdin);
				} else {
					// this.utils.render.entry('')
					this.utils.render.ePrompt('success')
				}
				
				
        		// this.utils.render.error("That command does not exist.");

			}
		},

		history: new (function (term){
			this.term = term;
			this.index = 0;

			this.init = () => {
				if (!this.term.utils.localStorage.get('history')) this.term.utils.localStorage.set('history', []);
				this.history = this.term.utils.localStorage.get('history');
				return this.term;
			};
			
			this.add = (entry) => {
				this.index = 0;
				if (entry) {
					this.history.push(entry)
					this.term.utils.localStorage.set('history', this.history);
				}
			};

			this.prev = () => { // last command (note: loops back)
				this.index = this.index || this.history.length;
				this.term.stdin = this.history[--this.index];
				this.term.utils.prompt.cursor.end();
			};

			this.back = () => { // backwards from "last command" stops at 0
				this.index = (this.index && ++this.index < this.history.length ? this.index : 0);
				if (this.index){
					this.term.stdin = this.history[this.index];
					this.term.utils.prompt.cursor.end();
				} else {
					this.term.utils.render.prompt('');
				}
			};
		})(this)
		
	};

	// callbacks
	this.callbacks = new (function(term){
		this.term = term;
		this.handle = (resp)=>{
			this.term.utils.render.ePrompt(resp.status)
			if (resp.stdout){
				this.term.$.stdout.append(resp.stdout);
			}
			if (resp.callback){
				if (this[resp.callback]){
					this[resp.callback].call(resp.args);
				} else {
					this.add(resp.callback, this).then(() => {
						this[resp.callback].call(resp.args);
					});
				}
			}
		};
		this.add = (func, term) => {
			return new Promise( function( resolve, reject ) {
				API('terminal/js/'+func).then(((resp) => {
					eval(resp.file);
					resolve()
				}));
			});
			
		};
		
	})(this);
	
	
	// eventListeners/callbacks
	
	document.onpaste = (e) => { // handles pasting to the prompt
		var paste = (e.clipboardData ? e.clipboardData.getData('text/plain'):0) || (window.clipboardData ? window.clipboardData.getData('Text'):0);
		if (paste){
			this.stdin = this.stdin.insertAt(paste, this.cursor);
			this.cursor += paste.length;
			this.utils.render.prompt();
		} else {
			alert("Pasting is not supported in this browser.\nTry Google Chrome.\n\nGood luck, and happy hacking!");
		}
	}
	
	window.addEventListener('keypress', (e) => {
		if (e.keyCode != 13){
			this.utils.render.prompt(this.stdin.insertAt(String.fromCharCode(e.keyCode), this.cursor++));
			e.preventDefault()
		}
		
	});
	
	window.addEventListener('keydown', (e) => {
			 switch (e.keyCode){ // this might need more *cases* in the near future
				case 8:
					this.utils.prompt.delete();
					e.preventDefault();
					break;
				case 13:
					if (e.shiftKey){
						this.utils.render.prompt(this.stdin.insertAt('\n', this.cursor++));
					}else{
						this.utils.prompt.execute();
					}
					e.preventDefault();
					break;
				case 37: // left
					this.cursor--;
					this.utils.render.prompt();
					e.preventDefault();
					break;
				case 39: // right
					this.cursor++;
					this.utils.render.prompt();
					e.preventDefault();
					break;
				case 38: // up
					this.utils.history.prev();
					e.preventDefault();
					break;
				case 40: // down
					this.utils.history.back();
					e.preventDefault();
					break;
			}

	});
})().utils.history.init() // because js Ass-ynchronous I need to make sure this exectes after the term.utils.localStorage
