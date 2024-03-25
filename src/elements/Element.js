export class UIElement {
	constructor(params={}) {

		this.el = document.getElementById(params.id) ?
				document.getElementById(params.id) :
				document.createElement(params.tag || "div");

		for (const prop in params.css) {
			this.setStyle(prop, params.css[prop]);
		}

		if (params.id !== undefined) this.el.id = params.id;
		if (params.class) this.addClass(params.class); // list?
		if (params.text) this.text = params.text;
	}

	get text() {
		return this.el.textContent;
	}

	set text(value) {
		this.el.textContent = value;
	}

	// idk ... 
	get title() {
		return this.el.title;
	}

	set title(value) {
		this.el.title = value;
	}

	// set value(_value) {
	// 	this.el.value = _value;
	// }

	// get value() {
	// 	return this.el.value;
	// }

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
}