import { UICollection } from './Collection.js';
import { UIElement } from './Element.js';
import { UIButton } from './Button.js';
import { UILabel } from './Label.js';

export class UIModal extends UICollection {
	constructor(params) {
		super({});
		if (params.callback) this.callback = params.callback;
		this.addClass('modal');
		if (params.class) this.addClass(params.class);
		this.append(new UILabel({ text: params.title }));

		// better way to do this ?? 
		document.getElementById('container').appendChild(this.el);
		
		const self = this;

		this.break = new UIElement({ class: 'break' });
		this.append(this.break);

		this.submit = new UIButton({
			text: "Submit",
			callback: function() {
				if (params.callback) params.callback();
				self.clear();
			}
		});

		this.append(this.submit);
		params.app.ui.keys['enter'] = this.submit; /* not modular ... */

		this.cancel = new UIButton({
			text: "x",
			callback: ev => {
				this.clear();
				if (params.onClear) params.onClear();
			}
		});

		params.app.ui.keys['escape'] = this.cancel;
		this.append(this.cancel);
		this.append(new UIElement({ class: "break" }));

		let x = Math.max(16, params.position.x - 100);
		let y = Math.max(16, params.position.y - 20);

		this.el.style.left = `${x}px`;
		this.el.style.top = `${y}px`;
	}

	adjustPosition() {
		let x = parseInt(this.el.style.left);
		let y = parseInt(this.el.style.top);
		let w = parseInt(this.el.clientWidth);
		let h = parseInt(this.el.clientHeight);

		if (x + w > window.innerWidth) {
			this.el.style.left = `${window.innerWidth - w - 20}px`;
		}

		if (y + h > window.innerHeight) {
			this.el.style.top = `${window.innerHeight - h - 20}px`;
		}
	}

	add(component) {
		if (Array.isArray(component.html)) {
			component.html.forEach(el => {
				this.el.insertBefore(el, this.break.el);
			});
		} else {
			this.el.insertBefore(component.el, this.break.el);
		}
		this.adjustPosition();
	}

	addBreak(label) {
		this.add(new UIElement({ class: "break" }));
		if (label) this.addLabel(label);
		this.adjustPosition();
	}

	addLabel(labelText) {
		this.add(new UILabel({ text: labelText }));
		this.adjustPosition();
	}

	clear() {
		this.el.remove();
	}
}