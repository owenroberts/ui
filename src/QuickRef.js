/*
	module for running a function or adding uis to quick ref menu
	register all callbacks, props, uis with params to either run or recreate ui 
*/

function QuickRef(app) {

	const reg = []; // registered uis for reference
	const list = []; // list of uis added to interfaces
	const defaultFontSize = 11;
	let panel;

	function add() {

		const m = new UIModal({
			title: "Add UI To Quick Ref",
			app: app,
			position: app.ui.panels.quick.position
		});

		function addUI(label) {
			const { type, params, prop } = reg.find(e => e.label === label);
			params.label = label;
			let row = panel.addRow();
			let ui;
			if (type === 'prop') {
				ui = new UI.Elements[params.type](params);
			} else {
				ui = new UIButton(params);
			}
			row.append(new UILabel({ text: label, css: { 'margin-right': 'auto' } }));
			row.append(ui);
			row.append(new UIButton({
				text: 'x',
				callback: () => {
					panel.removeRow(row);
				}
			}));
		} 

		const input = new UIInputList({
			listName: 'quick-menu-list',
			options: reg.map(e => e.label),
			escape: () => { m.clear() },
			callback: value => {
				m.clear();
				addUI(value);
			}
		});
		m.add(input);
		input.focus();
	}

	function open() {

		const m = new UIModal({
			title: "Quick Menu",
			app: app,
			position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
		});

		function callCallback(label) {
			const ui = reg.find(e => e.label === label);
			if (ui.type === 'prop') app.ui.faces[ui.prop].update();
			// test other types ...
			else ui.params.callback();
		} 

		const input = new UIInputList({
			listName: 'quick-menu-list',
			options: reg.map(e => e.label),
			escape: () => { m.clear() },
			callback: value => {
				m.clear();
				callCallback(value);
			}
		});
		m.add(input);
		input.focus();
	}

	function registerCallback(mod, label, params) {
		reg.push({ label: `${mod} > ${label}`, params, type: 'callback' });
	}

	function registerProp(prop, mod, label, params) {
		reg.push({ label: `${mod} > ${label}`, prop, params, type: 'prop' });
	}

	function connect() {

		panel = app.ui.getPanel('quick', { label: 'Quick Ref' });

		app.ui.addCallbacks([
			{ callback: open, text: "Menu", key: "ctrl-space" },
			{ callback: add, text: "+" },
		]);

		app.ui.addProp('quickRefScale', {
			type: 'UINumberStep',
			value: defaultFontSize,
			label: "Scale",
			callback: value => {
				document.body.style.setProperty('--quick-ref-font-size', +value);
			},
			reset: true, // defaultFontSize ??
			range: [10, 40],
		});
	}

	return {
		connect, registerCallback, registerProp, 
		getList: () => { return list; }
	};
}