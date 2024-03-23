import { UICollection } from './Collection.js';
import { UIToggleCheck } from './ToggleCheck.js';
import { UILabel } from './Label.js';
import { UIButton } from './Button.js';

export function UIToggleGrid(params={}) {
	const ui = UICollection(params);
	const callback = params.callback;

	// const label = new UILabel({ text: params.text ?? 'Grid' });

	let value = params.value ?? [[true]];

	const subCol = ui.add(new UIButton({
		text: '-',
		class: 'left-end',
		callback: () => {
			for (let i = 0; i < this.value.length; i++) {
				this.value[i].pop();
			}
			this.updateGrid();
		}
	}));

	const addCol = ui.add(new UIButton({
		text: '+',
		class: 'right-end',
		callback: () => {
			for (let i = 0; i < value.length; i++) {
				value[i].push(true);
			}
			updateGrid();
		}
	}));

	const grid = ui.add(new UICollection({
		id: 'sequence-grid'
	}));

	function updateGrid() {
		grid.clear();
		grid.setProp('--rows', value.length);
		grid.setProp('--cols', value[0].length);

		for (let i = 0; i < value.length; i++) {
			for (let j = 0; j < value[i].length; j++) {
				const toggle = new UIToggleCheck({
					value: value[i][j],
					css: {
						'grid-row': `${i + 1}/${i + 1}`,
						'grid-column': `${j + 1}/${j + 1}`,
					},
					callback: value => {
						// console.log(i, j, value);
						value[i][j] = value;
						callback(value);
					}
				});
				grid.add(toggle);
			}
		}
	}

	function update(val) {
		value = val;
		updateGrid();
	}

	return Object.assign(ui, { update });
}