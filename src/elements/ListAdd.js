import { UICollection } from './Collection.js';
import { UIButton } from './Button.js';

export function UIListAdd(params={}) {
	const ui = UICollection(params);

	const list = [...params.list] ?? [];
	const callback = params.callback;

	const remove = new UIButton({
		text: 'X',
		class: 'left-end',
		callback: () => {
			if (list.length > 0) {
				ui.removeK('n' + (list.length - 1));
				list.pop();
			}
			callback(list);
		}
	});

	function addItems() {
		for (let i = 0; i < list.length; i++) {
			addItem(i, list[i]); // wtf is this? deprecate???
			// used by InputList, which inherits this .... 
		}
	}

	function set(newList) {
		for (let i = list.length - 1; i >= 0; i--) {
			ui.removeK('n' + i);
		}

		list = [...newList];

		for (let i = 0; i < list.length; i++) {
			addItem(i, list[i]);
		}
	}

	ui.add(remove);

	return Object.assign(ui, { addItems, set });
}