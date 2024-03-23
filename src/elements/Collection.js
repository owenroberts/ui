import { UIElement } from './Element.js';

export function UICollection(params={}) {
	const ui = UIElement(params);
	ui.addClass('ui-collection');
	let children = {};
	let childList = [];

	// k is the key value in the interface object
	function append(child, k) {
		// console.log(child, k);
		// if (k !== undefined) this[k] = ui;
		if (k !== undefined) children[k] = child; // way to add a key ???
		// console.log(childList);
		childList.push(child);
		// prob a way to check if it is a collection here ... 
		const html = child.getHTML ? child.getHTML() : child.html;
		if (Array.isArray(html)) {
			html.forEach(el => {
				ui.el.appendChild(el);
			});
		} else {
			ui.el.appendChild(child.el);
		}
		// console.log(children);
		return child;
	}

	function insert(child, ref) {
		// html only has insert before
		ui.el.insertBefore(child.el, ref.el);
		const index = childList.indexOf(ref);
		childList.splice(index, 0, child);
	}

	function add(child, k, _addBreak) {
		if (_addBreak) addBreak();
		return append(child, k);
	}

	function addBreak() {
		add(new UIElement({ class: 'break' }));
	}

	function remove(child, k) {
		if (k) delete children[k];
		ui.el.removeChild(child.el);
		let index = childList.indexOf(ui);
		childList.splice(index, 1);
		return child;
	}

	function removeK(k) {
		ui.el.removeChild(children[k].el);
		delete children[k];
	}

	function clear() {
		// originally part of row, seems simpler safer
		while (ui.el.firstChild) {
			ui.el.firstChild.value = null; /* prevent blur event */
			ui.el.removeChild(ui.el.firstChild);
		}
		children = {};
		childList = [];
	}

	function pop() {
		const child = childList.pop();
		if (!child) return;
		return remove(child);
	}

	return Object.assign(ui, {
		append, insert, add, remove, removeK, clear, pop, addBreak,
		getChild(k) { return children[k]; },
		getChildren() { return childList; },
		// get id() { return ui.el.id; },
		id: ui.el.id,
	});

}