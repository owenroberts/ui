// possibly deprecated ... 
import { UICollection } from './Collection.js';

export function UIList(params={}) {
	const ui = UICollection(params);
	const callback = params.callback;

	return Object.assign(ui, {
		get length() { return ui.el.children.length; },
		get children() { return ui.el.children; },
		insertBefore(ui, before) {
			ui.el.insertBefore(ui.el, before.el);
		},
		addClass(className) {
			for (let i = 0; i < this.els.length; i++) {
				if (ui.els[i].classList.contains(className)) continue;
 				ui.els[i].classList.add(className);
			}
		},
		setId(id, index) { ui.children[index].id = id; },
		removeIndex(index) { ui.children[index].remove(); },
		looper(callback, start, end) {
			const len = end || ui.length - 2; /* for plusframe ... */
			for (let i = start || 0; i <= len; i++) {
				callback(ui.children[i]);
			}
		},
	});
}


