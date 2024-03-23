/*
	things ui can do
	set implies return of funcs
	add not reurn of funcs 
*/

import { UIButton } from './Button.js';

function setKey(ui, key, text) {
	if (key) ui.el.title = `${ text ? text : '' } ~ ${ key }`;
	// no this ... need to figure this one out .... 
	ui.el.addEventListener('mouseenter', onPress);
	ui.el.addEventListener('mouseleave', onRelease);

	function onPress(triggerRelease) {
		ui.addClass('triggered');
		if (triggerRelease === true) setTimeout(onRelease, 400);
	}

	function onRelease() {
		ui.removeClass('triggered');
	}

	return { onPress };
}

function setInput(ui, params, callback) {
	// ui.value = params.value ?? '';
	// placeholder is real value ... 
	ui.setType(params.type ?? 'text');
	ui.el.placeholder = params.placeholder ?? params.value ?? '';

	ui.el.addEventListener('focus', ev => {
		ui.el.select();
	});

	/* have to hit enter to confirm value */
	ui.el.addEventListener('keyup', ev => {
		if (ev.which == 13) {
			callback(ev.target.value);
			ui.el.blur();
		}
	});

	ui.el.addEventListener('blur', ev => {
		// if (ui.value === undefined) {
			// ui.el.placeholder = params.placeholder ?? params.value ?? '';
			// ui.el.value = '';
		// } else 
		if (ui.el.placeholder !== ev.target.value && ev.target.value) {
			update(ev.target.value);
		}
	});

	return {
		get() { return ui.el.placeholder },
		set(value) { callback(value); },
	};
}

// need event type?
function setCallback(ui, params, eventType, update) {
	const args = params.args ?? [];
	function callback(value) {
		// prob should not spread args here ... 
		if (value) args.unshift(value);
		if (update) update(...args);
		else params.callback(...args);
	}
	if (eventType) {
		ui.el.addEventListener(eventType, callback);
	}
	return { callback };
}

function addDrag(ui, params, onDrag) {
	// drag is typically component of other ui ... 
	if (params.onDrag === undefined) {
		return console.error('Missing onDrag callback', ui, params);
	}
	let x = 0; // position when clicked
	let y = 0; 
	let timeout = 5; 
	let timer = 0; // timeout so it doesn't go nuts
	let prev = 0; // -1 or 1
	let active = false;

	ui.el.addEventListener('mousedown', mouseDown);

	function mouseDown(ev) {
		x = ev.pageX;
		y = ev.pageY;
		active = true;
		document.addEventListener('mousemove', mouseMove);
		document.addEventListener('mouseup', mouseUp);
	}

	function mouseMove(ev) {
		if (!active) return;

		const delta = { x: ev.pageX - x, y: ev.pageY - y };
		const dir = Math.abs(delta.x) > Math.abs(delta.y) ? 'x' : 'y';

		if (Math.abs(delta[dir]) > 10 && timer === 0) {
			const m = dir === 'x' ? 1 : -1; // multiplier for x/y

			// onDrag better?? 
			// error if no onDrag ??
			onDrag(m * Math.sign(delta[dir]));
			
			timer = timeout;
			x = ev.pageX;
			y = ev.pageY;
		} else if (timer > 0) {
			timer--;
		}
	}

	function mouseUp(ev) {
		if (!active) return;
		active = false;
		x = 0;
		y = 0;
		document.removeEventListener('mousemove', mouseMove);
		document.removeEventListener('mouseup', mouseUp);
	}
}

function setList(ui, params, getItemUI) {

	let list = [...params.list] ?? [];
	const callback = params.callback;

	const remove = ui.add(new UIButton({
		text: 'X',
		class: 'left-end',
		callback: () => {
			if (list.length > 0) {
				ui.removeK('n' + (list.length - 1));
				list.pop();
			}
			callback(list);
		}
	}));

	const add = ui.add(new UIButton({
		text: '+',
		callback: () => {
			list.push('');
			addItem(this.list.length - 1, 0);
			callback(this.list);
		}
	}));

	function addItems() {
		for (let i = 0; i < list.length; i++) {
			addItem(i, list[i]);
		}
	}
	addItems();

	function addItem(index, value) {
		const itemUI = getItemUI(index, value);
		itemUI.callback = value => {
			list[index] = value;
			callback(list);
		}
		ui.add(itemUI, 'n' + index);
	}

	function pushItem(value) {
		list.push(value);
		addItem(list.length - 1, value);
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

	return { 
		get() { return list; },
		set,
		addItem,
	};
}

export { setKey, setInput, setCallback, setList, addDrag };