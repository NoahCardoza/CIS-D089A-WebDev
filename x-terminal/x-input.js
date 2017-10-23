
function add_shadow_style(url, sl){
	var link 	= document.createElement('link');
	link.type 	= 'text/css';
	link.rel 	= 'stylesheet'
	link.href 	= url;
	link.media 	= 'all';
	sl.appendChild(link);
}

class XInput extends HTMLElement {
	constructor(target){
		super();

		this.cursor = 0
		this.value 	= ''
		this.target = target || this.getAttribute('target') || document;
		this.onTarget = true;
		this.isActive = true;

		this.shadow = this.createShadowRoot();
		add_shadow_style('css/x-input.css', this.shadow);
		this.div 	= document.createElement('div');
		this.div.innerHTML = '<cursor>&nbsp;</cursor>';

		this.shadow.appendChild(this.div);

		window.addEventListener('click', function(e){
			this.onTarget = e.target == this.target;
		}.bind(this))

		document.addEventListener('keypress', function (e){
			if (this.onTarget && this.getAttribute('active') == 'true'){
				if (e.keyCode != 13){
					this.value = this.value.insertAt(String.fromCharCode(e.keyCode), this.cursor++);
					this.render();
					e.preventDefault();
				}
			}
		}.bind(this));

		document.addEventListener('keydown', function (e){ // (elem || document)
			if (this.onTarget && this.getAttribute('active') == 'true'){
				if (this.onkeydown) this.onkeydown(e); // calls callback
				switch (e.keyCode){ // this might need more *cases* in the near future
					case 8: // delete
						this.value = this.value.delAt(--this.cursor);
						this.render();
						e.preventDefault();
						break;
					case 37: // left
						this.cursor--;
						this.render();
						e.preventDefault();
						break;
					case 39: // right
						this.cursor++;
						this.render();
						e.preventDefault();
						break;
				}
			}
		}.bind(this));
	}

	die(){
		this.dead = true;
	}

	htmlSafe(text){
		return text.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>');
	}

	render(val){
		if (val != undefined) this.value = val;
		this.cursor = (this.cursor < 0 ? 0 : this.cursor);
		this.cursor = (this.cursor > this.value.length ? this.value.length : this.cursor);
		val = this.value;
		if (this.getAttribute('type') == 'password'){
			val = this.value.replace(/./g,'*');
		}
		
		if (this.value.length < this.cursor+1){
			this.div.innerHTML = `<span>${this.htmlSafe(val)}</span><cursor>&nbsp;</cursor>`;
			} else {
			this.div.innerHTML = `<span>${this.htmlSafe(val.substring(0, this.cursor))}</span><cursor>${val[this.cursor]}</cursor><span>${this.htmlSafe(val.substring(this.cursor+1, val.length))}</span>`;
		}
	}

	flush(){
		var value = this.value;
		this.render('');
		return value;
	}
}
customElements.define('x-input', XInput);
