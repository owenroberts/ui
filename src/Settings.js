/*
	handles saving layout and property settings for reload
	"interface" is reserved, using inteface instead
*/

export function Settings(app, params) {
	let { name, workspaceFields, workspaces, appLoad, appSave } = params;
	const localStorageString = `settings-${name}`;

	if (!workspaceFields) workspaceFields = [];
	workspaceFields = [
		...workspaceFields,
		'timelineLayout', 
		'rightLayout',
		'upLayout',
	];

	function loadPanels(panels) {
		const layout = app.ui.getLayout();
		for (const p in panels) {
			if (p === 'el') continue;
			if (!app.ui.panels[p]) continue;
			app.ui.panels[p].setup(panels[p]);
			let panel = app.ui.panels[p];
			let settings = panels[p];
			layout[panel.gridArea || 'default'].panels.append(panel);
		}
	}

	function loadInterface(inteface) {
		for (const f in inteface) {
			if (f === 'palettes') continue;
			if (f === 'quickRef') continue;
			if (!app.ui.faces[f]) continue;
			app.ui.faces[f].update(inteface[f]);
		}
	}

	function loadLayout(layout) {
		for (const section in layout) {
			app.ui.getLayout()[section].maxWidth.update(layout[section].maxWidth);
			app.ui.getLayout()[section].maxWidthToggle.update(layout[section].maxWidthToggle);
			if (layout[section].isVisible !== undefined) {
				app.ui.getLayout()[section].isVisible = layout[section].isVisible;
			}
		}
	}

	function save() {
		const settings = {};
		
		const inteface = {};
		Object.keys(app.ui.faces)
			.filter(f => !app.ui.faces[f].ignoreSettings)
			.forEach(f => {
				inteface[f] = app.ui.faces[f].value;
			});
		// const inteface = appSave ? { ...s, ...appSave() } : { ...s };
		if (appSave) Object.assign(inteface, appSave());
		settings.inteface = inteface;
		
		settings.panels = {};
		for (const p in app.ui.panels) {
			if (p === 'el') continue;
			settings.panels[p] = app.ui.panels[p].settings;
		}

		settings.layout = app.ui.getLayout().getSettings();
		settings.quickRef = app.ui.getQuickRef().getList();
		localStorage[localStorageString] = JSON.stringify(settings);
	}

	function load() {
		if (localStorage[localStorageString]) {
			const settings = JSON.parse(localStorage[localStorageString]);

			loadPanels(settings.panels);
			loadInterface(settings.inteface);
			loadLayout(settings.layout);

			if (settings.quickRef) {
				app.ui.getQuickRef().list = settings.quickRef;
				settings.quickRef.forEach(ref => {
					// app.ui.createUI(ref, ref.mod, ref.sub, app.ui.panels.quickRef);
					console.log(ref);
				});
			}
			if (appLoad) appLoad(settings);
		} else {
			if (workspaces.length > 0) {
				loadWorkspace(workspaces[0].url)
			}
		}
	}

	function clear() {
		localStorage.setItem(localStorageString, '');
	}

	function saveWorkspace() {
		save();
		const intefaceSettings = {};
		workspaceFields
			.filter(f => app.ui.faces[f])
			.forEach(f => {
				intefaceSettings[f] = app.ui.faces[f].value;
			});
		const savedSettings = JSON.parse(localStorage.getItem(localStorageString));
		const jsonFile = JSON.stringify({ 
			panels: savedSettings.panels, 
			layout: savedSettings.layout,
			inteface: intefaceSettings,
		});
		const fileName = prompt('Layout Name:', 'New Layout');
		const blob = new Blob([jsonFile], { type: "application/x-download;charset=utf-8" });
		saveAs(blob, `${fileName}.json`);
	}

	function loadSettings(settings) {
		loadInterface(settings.inteface); 
		loadPanels(settings.panels);
		loadLayout(settings.layout);
	}

	function loadWorkspace(url) {
		if (url.hasOwnProperty('interface')) {
			loadSettings(url);
		} else if (url) {
			// load default file
			fetch(url)
				.then(response => { return response.json(); })
				.then(settings => { loadSettings(settings); })
				.catch(error => { console.error(error); });
		} else {
			// choose file to load
			const openFile = document.createElement('input');
			openFile.type = "file";
			openFile.click();
			openFile.onchange = function() {
				for (let i = 0, f; f = openFile.files[i]; i++) {
					if (!f.type.match('application/json')) continue;
					const reader = new FileReader();
					reader.onload = (function(theFile) {
						return function(e) {
							loadSettings(JSON.parse(e.target.result))
						}
					})(f);
					reader.readAsText(f);
				}
			};
		}
	}

	app.ui.addCallbacks([
		{ callback: save, key: "ctrl-s", text: 'Save' },
		{ callback: load, text: 'Load' },
		{ callback: clear, text: 'Clear' },
	], 'settings');

	app.ui.addCallbacks([
		{ callback: saveWorkspace, key: 'alt-w', text: 'Save' },
		{ callback: loadWorkspace, text: 'Load' },
	], 'workspaces');

	app.ui.addUI({
		row: true,
		type: "UILabel",
		text: "Defaults",
		class: 'break',
	}, 'workspaces');

	workspaces.forEach(workspace => {
		const { text, url } = workspace;
		app.ui.addCallback({
			text,
			callback: () => { loadWorkspace(url); }
		}, 'workspaces');
	});

	return { load };
}
