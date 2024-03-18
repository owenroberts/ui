import UICollection from './Collection.js';
import UIToggleCheck from './Toggle.js';
import UILabel from './Label.js';
import UIButton from './Button.js';

export default class UIToggleGrid extends UICollection {
	constructor(params) {
		super(params);
		this.callback = params.callback;
		this.value = params.value;
		this.addClass('ui-collection');

		const label = new UILabel({ text: params.text ?? 'Grid' });

		const subCol = new UIButton({
			text: '-',
			class: 'left-end',
			callback: () => {
				for (let i = 0; i < this.value.length; i++) {
					this.value[i].pop();
				}
				this.updateGrid();
			}
		});

		const addCol = new UIButton({
			text: '+',
			class: 'right-end',
			callback: () => {
				for (let i = 0; i < this.value.length; i++) {
					this.value[i].push(true);
				}
				this.updateGrid();
			}
		});

		this.grid = new UICollection({
			// class: 'break',
			id: 'sequence-grid'
		});

		this.add(subCol);
		this.add(addCol);
		this.add(this.grid);

		this.updateGrid();
	}

	updateGrid() {
		this.grid.clear();
		this.grid.setProp('--rows', this.value.length);
		this.grid.setProp('--cols', this.value[0].length);

		for (let i = 0; i < this.value.length; i++) {
			for (let j = 0; j < this.value[i].length; j++) {
				const toggle = new UIToggleCheck({
					value: this.value[i][j],
					css: {
						'grid-row': `${i + 1}/${i + 1}`,
						'grid-column': `${j + 1}/${j + 1}`,
					},
					callback: value => {
						// console.log(i, j, value);
						this.value[i][j] = value;
						this.callback(this.value);
					}
				});
				this.grid.add(toggle);
				// console.log(i, j, toggle);
			}
		}
	}

	update(value) {
		this.value = value;
		this.updateGrid();
	}
}