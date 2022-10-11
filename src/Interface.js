function Interface(app, params) {

	// turn off ipad request desktop
	document.body.classList.add(Cool.mobilecheck() ? 'mobile' : 'desktop');

	const keys = {}; // all short cut keys
	const faces = {}; // all interfaces that need to be saved/updated -- make this all interfaces?
	const panels = {};
	
	const quickRef = new QuickRef(app);
	const layout = new Layout(app, params);
	const settings = new Settings(app, params);

	let baseFontSize = 11;
	function updateScale(value) {
		if (value) baseFontSize = +value;
		document.body.style.setProperty('--base-font-size', baseFontSize);
	}

	/* key commands */
	function keyDown(ev) {
		let k = Cool.keys[ev.which];
		if (k === "space") ev.preventDefault();
		k = ev.shiftKey ? "shift-" + k : k;
		k = ev.ctrlKey ? "ctrl-" + k : k;
		k = ev.altKey ? "alt-" + k : k;

		const ui = keys[k];

		if (k && ui && 
			document.activeElement.type !== "text" &&
			document.activeElement.type !== "number" && 
			!ev.metaKey) {
			ev.preventDefault();
			ui.keyHandler(ev.target.value);
			ui.onPress(true);
		}
	}
	document.addEventListener("keydown", keyDown, false);

	async function loadInterfaceFiles(file, callback) {
		const appFile = await fetch(file).then(response => response.json());
		const interfaceFile = await fetch('../ui/static/panels.json').then(response => response.json());
		
		const data = { ...interfaceFile };
		for (const k in appFile) {
			if (data[k]) data[k].modules.push(...appFile[k].modules);
			else data[k] = { ...appFile[k] };
		}
		
		for (const key in data) {
			const panel = panels[key] || createPanel(key, data[key]);
			const modules = data[key].modules;
			for (let i = 0; i < modules.length; i++) {
				const { key, sub, controls} = modules[i];
				for (let j = 0; j < controls.length; j++) {
					createControl(controls[j], key, sub, panel);
				}
				if (key === 'ui' && sub) app.ui[sub].panel = panel;
			}
		}

		quickRef.addData(data);
		settings.load();
		if (callback) callback();
	}

	function load(file, callback) {
		loadInterfaceFiles(file, callback);
	}

	function createPanel(key, data) {
		const panel = new UIPanel({ 
			id: key, 
			label: data.label, 
			onToggle: function() {
				// later close other panels
				// let openPanels = lns.ui.panels.uiList.filter(p => p.isOpen && p.isDocked);
				// console.log(openPanels) 
				// do this in UISection ...
			}
		});
		panels[key] = panel;
		layout.addSelectOption(key, data.label);
		return panel;
	}

	function createControl(data, mod, sub, panel) {

		const m = sub ? app[mod][sub] : app[mod]; // module with sub module
		// this is because a bunch of modules are "sub modules" of the ui object, for no reason?

		const params = { ...data.params };
		if (data.key) params.key = data.key;
		if (data.callback) params.callback = m[data.callback];

		// most callbacks
		for (const k in data.fromModule) {
			params[k] = m[data.fromModule[k]];
		}

		/* direct set properties, toggle, number */
		if (data.number) {
			params.callback = function(value) {
				m[data.number] = +value;
			};
			params.value = +m[data.number];
		}

		if (data.string) {
			params.callback = function(value) {
				m[data.string] = value;
			}
			params.value = m[data.string];
		}

		/* this is fuckin nuts right ... */
		if (data.toggle) {
			params.callback = function(value) {
				m[data.toggle] = typeof value !== 'undefined' ? value :
					!m[data.toggle];
			};
			params.value = m[data.number];
		}

		if (data.row) panel.addRow();

		/* 
			this is counter intuitive because 
			labels get created before ui, 
			doesn't work for uis created in js
		*/
		if (data.label) panel.add(new UILabel({ text: data.label }));
		
		// console.log(data);
		// console.log(panel.rows);
		let ui = new UI.Elements[data.type](params);
		
		if (data.type == 'UIRow') panel.addRow(data.k, params.class);
		else if (data.k) {
			// panel.append(ui, data.k);
			// dont know if this will fuck up anything yet
			panel.add(ui, undefined, data.k); 
		}
		else panel.add(ui);

		/* add is to row, append is adding it straight there */

		if (params.prompt) ui.prompt = params.prompt; /* only key commands -- why here? */
		if (params.key) keys[data.key] = ui;
		if (data.face) faces[data.face] = ui;
		if (data.face && data.ignoreSettings) ui.ignoreSettings = true;
	}

	function update() {
		app.uiUpdate();
	}

	return { keys, faces, panels, settings, quickRef, layout, load, update, updateScale, createPanel, createControl };
}

UI.Interface = Interface;