export class UIElement {
	constructor(params={}) {

		this.el = document.getElementById(params.id) ?
				document.getElementById(params.id) :
				document.createElement(params.tag || "div");

		for (const prop in params.css) {
			// this.setStyle(prop, params.css[prop]);
			this.el.style[prop] = params.css[prop];
		}

		if (params.id !== undefined) this.el.id = params.id;
		if (params.class) this.addClass(params.class); // list?
		// if (params.class === 'order-btn') console.log(params.hasOwnProperty("text"), params.text);
		if (params.hasOwnProperty("text")) this.text = params.text;
		// if (params.class === 'order-btn') console.log(this.text);
		if (params.debug) this.debug = true;
	}

	setText(value) {
		this.el.textContent = value;
	}

	get text() {
		return this.el.textContent;
	}

	set text(value) {
		this.el.textContent = value;
	}

	// idk ... why ... 
	// get title() {
	// 	return this.el.title;
	// }

	// set title(value) {
	// 	this.el.title = value;
	// }

	// deprecate?
	get position() {
		return { x: this.el.getBoundingClientRect().x, y: this.el.getBoundingClientRect().y };
	}

	setStyle(prop, value) {
		this.el.style.setProperty(prop, value);
	}

	getStyle(prop) {
		return this.el.style.getPropertyValue(prop); 
	}

	addClass(value) {
		this.el.classList.add(value);
	}

	removeClass(value) {
		this.el.classList.remove(value);
	}

	hasClass(value) {
		return this.el.classList.contains(value);
	}

	remove() {
		this.el.remove();
	}

	add(child) {
		this.el.appendChild(child.el);
		return child;
	}

	clear() {
		while (this.el.firstChild) {
			this.el.firstChild.value = null; /* prevent blur event */
			this.el.removeChild(this.el.firstChild);
		}
	}
}