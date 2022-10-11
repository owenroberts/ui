/*
	module for running a function or adding uis to quick ref menu
*/

function QuickRef(app) {

	const data = {};
	let list = [];

	const defaultFontSize = 11;
	let fontSize = 11;

	function setScale(value) {
		fontSize = +value;
		document.body.style.setProperty('--quick-ref-font-size', +value);
	}

	function reset() {
		app.ui.faces.quickRefScale.update(defaultFontSize);
	}

	function addRef() {
		
		function modalOptions() {
			const options = {};
			data[p1.value].modules.forEach(mod => {
				mod.controls.forEach(control => {

					let createQuickUI = (control.number || control.toggle) ? true : false;
					if (control.fromModule) createQuickUI = control.fromModule.callback ? true : false;

					if (createQuickUI) {
						const title = control.params ? 
							control.params.text || control.params.onText || control.params.label || control.face:
							control.fromModule.callback;
						
						control.mod = ui.key;
						control.sub = ui.sub;

						options[title] = control;
					}
				});
			});

			if (Object.keys(options).length > 0) {
				// m2 choose a callback
				const m2 = new UIModal({
					title: "ui", 
					app: app, 
					position: app.ui.quick.panel.position,
					callback: function() {
						const d = options[p2.value];
						const ui = app.ui.createControl(d, d.mod, d.sub, self.panel);
						list.push(d);
					}
				});

				const p2 = new UISelect({
					options: Object.keys(options)
				});
				m2.add(p2);

				const callFunc = new UIButton({
					text: "Execute",
					callback: function() {
						m2.clear();
						const d = options[p2.value];
						const m = d.sub ? app[d.mod][d.sub] : app[d.mod];
						
						if (d.callback) m[d.callback]();
						else if (d.fromModule) { // legacy
							if (d.fromModule.callback) {
								m[d.fromModule.callback]();
							}
						}

						/* 
							direct set properties, toggle, number 
							doesn't update ui -- bad ..
						*/
						if (d.number) m[d.number] = +prompt(d.prompt || d.label);
						if (d.toggle) m[d.toggle] = !m[d.toggle];
					}
				});
				m2.add(callFunc);
			} else {
				m1.clear();
			}
		}

		const m1 = new UIModal({
			title: "panels", 
			app: app, 
			position: app.ui.quick.panel.position,
			callback: modalOptions
		});

		const p1 = new UISelect({ options: Object.keys(data) });
		m1.add(p1);
	}

	function addData(newData) {
		for (const k in newData) {
			data[k] = newData[k];
		}
	}

	function openQuickMenu() {

		// populat ui optoins
		let ignoreUIs = ['UIRow', 'UILabel'];
		let options = {};

		Object.keys(data).forEach(k => {
			return data[k].modules.forEach(mod => {
				return mod.controls
					.filter(c => !ignoreUIs.includes(c.type))
					.filter(c => c.key !== 'ctrl-space') // this one 
					.forEach(control => {
						let label = data[k].label + ' > ';
						let n = control.label;
						if (!n && control.params) {  
							n = control.params.text || control.params.onText || control.params.placeholder;
						}
						if (!n) n = control.face;
						if (!n) console.error('quick search fuck', control);
						label += n;
						if (control.key) label += ` (key: ${control.key})`;
						options[label] = { ...control, module: mod.key, sub: mod.sub };
					});
			});
		});

		const m = new UIModal({
			title: "Quick Func",
			app: app,
			position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
			callback: () => {

				// gotta be a better way to do this part -- data from uis not original file
				const ui = options[input.value];
				console.log(ui);
				const mod = ui.sub ? app[ui.module][ui.sub] : app[ui.module];
				let args;
				if (ui.params) {
					if (ui.params.args) {
						args = [ui.params.args];
					}
				}
				
				if (ui.face) app.ui.faces[ui.face].update();

				if (ui.type === 'UIFile') { // temp fix
					if (ui.face) { 
						app.ui.faces[ui.face].keyHandler();
					} else {
						const f = new UIFile({ ...ui.params, callback: mod[ui.callback] });
						f.keyHandler();
					}
				}
				else if (ui.callback) {
					if (args) mod[ui.callback](...args);
					else mod[ui.callback]();

				}
				else if (ui.fromModule) {
					if (ui.fromModule.callback) {
						if (args) mod[ui.fromModule.callback](...args);
						else mod[ui.fromModule.callback]();
					}
				}
				else if (ui.number) {
					mod[ui.number] = +prompt(ui.prompt || ui.label);
				}
				else if (ui.toggle) {
					mod[ui.toggle] = !m[ui.toggle];
				}
			}
		});

		const input = new UIInputList({
			listName: 'quick-menu-list',
			options: Object.keys(options),
			callback: function() {
				m.clear();
				m.callback();
			}
		});

		m.add(input);
		input.input.el.focus();

		input.input.el.addEventListener('keydown', ev => {
			if (Cool.keys[ev.which] === 'escape') m.clear();
		});
	}

	return {
		setScale, reset, addRef, addData, openQuickMenu,
		getList: () => { return list }
	};
}