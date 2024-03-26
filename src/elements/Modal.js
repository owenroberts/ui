import { UICollection } from './Collection.js';
import { UIElement } from './Element.js';
import { UIButton } from './Button.js';
import { UILabel } from './Label.js';

export class UIModal extends UICollection {
	constructor(params) {
		super({});
		this.addClass('modal');
		if (params.class) this.addClass(params.class);
		this.append(new UILabel({ text: params.title }));

		// better way to do this ?? 
		document.getElementById('container').appendChild(this.el);
		
		this.break = this.append(new UIElement({ class: 'break' }));

		const submit = this.append(new UIButton({
			text: "Submit",
			key: 'enter',
			callback: () => {
				if (params.callback) params.callback();
				this.clear();
			}
		}));
		params.app.ui.keys['enter'] = submit; /* not modular ... */

		const cancel = this.append(new UIButton({
			text: "x",
			key: "escape", // have to add keyHandler ... 
			callback: ev => {
				this.clear();
				if (params.onClear) params.onClear();
			}
		}));
		params.app.ui.keys['escape'] = cancel;
		this.addBreak();

		let x = Math.max(16, params.position.x - 100);
		let y = Math.max(16, params.position.y - 20);

		this.setStyle('left', `${x}px`);
		this.setStyle('top', `${y}px`);
	}

	adjustPosition() {
		let x = parseInt(this.el.style.left);
		let y = parseInt(this.el.style.top);
		let w = parseInt(this.el.clientWidth);
		let h = parseInt(this.el.clientHeight);

		if (x + w > window.innerWidth) {
			this.setStyle('left', `${window.innerWidth - w - 20}px`);
		}

		if (y + h > window.innerHeight) {
			this.setStyle('top', `${window.innerHeight - h - 20}px`);
		}
	}

	add(child) {
		this.insert(child, this.break);
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