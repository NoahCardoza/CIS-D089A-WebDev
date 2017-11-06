class NotificationCenter {
	constructor(){
		this.root = createElement('div', {className:"tab-notify col-center"});
		document.body.insertBefore(this.root, document.body.firstChild);
	}

	notify(argv){ // title, msg, time (seconds), type
		var body = createElement('div', {className:"fade-in tab-notification-" + argv.type}),
			x = createElement('span', {innerHTML:'&times;', className:'tab-x'}),
			title = createElement('div', {innerHTML:"<b>" + argv.title + "</b>"}),
			msg = createElement('div', {innerHTML:argv.msg}),
			gone = false;

		console.log(body);

		var remove = () => {
			if (!gone)
			{
				x.removeEventListener('click', remove);
				body.classList.remove("fade-in");
				body.classList.add("fade-out");
				setTimeout(() => body.parentElement.removeChild(body), 3000);
				gone = true;
			}
		}

		x.addEventListener('click', remove);
		body.appendChild(x);
		body.appendChild(title);
		body.appendChild(msg);
		if (argv.time)
			setTimeout(remove, (argv.time + 2) * 1000);
		this.root.insertBefore(body, this.root.firstChild);
	}
}