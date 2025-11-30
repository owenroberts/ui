import { UIPanel, UIModal, UIButton } from '../oi.js';
import * as Elements from '../elements.js';

export class QuickPanel extends UIPanel {
	constructor(params) {
		super({ ...params, id: 'quick' });

		this.quick = this.ui.quick;
		this.fontSize = 11;

		this.addRef({
			obj: this,
			ref: 'fontSize',
			reset: true, // ??
			range: [10, 40],
			callback: value => {
				document.body.style.setProperty('--quick-ref-font-size', +value);
			}
		});

		this.addBreak();

		this.addButton({ 
			callback: () => {
				this.quick.open(false);
			}, 
			text: "Menu", 
			key: "q" 
		});

		this.addButton({ 
			callback: () => {
				this.quick.displayKeys();
			}, 
			text: 'Key Commands', 
			key: 'alt-k' 
		});

		this.addButton({ 
			callback: () => {
				this.quick.open(true);
			}, 
			text: "+",
			key: "shift-q",
		});
	}

	addUI(params) {
		const row = this.addRow();
		if (params.callback) {
			this.addButton(params);
		} else {
			this.addRef(params);
		}

		row.append(new UIButton({
			text: 'x',
			callback: () => {
				this.removeRow(row);
			}
		}));
	}
}


