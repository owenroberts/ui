function Settings(app, name, appSave, workspaceFields) {
	const self = this;
	const appName = `settings-${name}`;
	
	function loadPanels(panels) {
		for (const p in panels) {
			if (p === 'el') continue;
			if (!app.ui.panels[p]) continue;
			let panel = app.ui.panels[p];
			let settings = panels[p];
			
			if (settings.docked) panel.dock();
			else panel.undock();
			
			// ui.panels[p].open.update(panels[p].open);
			if (!settings.open) panel.close();
			
			if (settings.block) panel.block();
			if (settings.headless) panel.headless();
			
			panel.order = settings.order;
			panel.gridArea = settings.gridArea;
		
			app.ui.layout[panel.gridArea].panels.append(panel);
		}
	}

	function loadInterface(interface) {
		for (const f in interface) {
			if (f === 'palettes') continue;
			if (f === 'quickRef') continue;
			if (app.ui.faces[f]) app.ui.faces[f].update(interface[f]);
		}
	}

	this.save = function() {
		const settings = {};
		
		const s = {};
		Object.keys(app.ui.faces)
			.filter(f => !app.ui.faces[f].ignoreSettings)
			.forEach(f => {
				s[f] = app.ui.faces[f].value;
			});
		const interface = appSave ? { ...s, ...appSave() } : { ...s };
		settings.interface = interface;
		
		settings.panels = {};
		for (const p in app.ui.panels) {
			if (p === 'el') continue;
			settings.panels[p] = app.ui.panels[p].settings;
		}

		settings.quickRef = app.ui.quickRef.list;
		localStorage[appName] = JSON.stringify(settings);
	};

	this.load = function(appLoad) {
		if (localStorage[appName]) {
			const settings = JSON.parse(localStorage[appName]);
			// if (appLoad) appLoad(settings);
			loadPanels(settings.panels);
			loadInterface(settings.interface);

			if (settings.quickRef) {
				app.ui.quickRef.list = settings.quickRef;
				settings.quickRef.forEach(ref => {
					app.ui.createUI(ref, ref.mod, ref.sub, app.ui.panels.quickRef);
				});
			}
		}
	};

	this.clear = function() {
		// delete localStorage[appName];
		localStorage.setItem(appName, '');
	};

	// better way to set this up??
	this.toggleSaveSettings = function() {
		app.files.saveSettingsOnUnload = !app.files.saveSettingsOnUnload;
	};

	if (!workspaceFields) workspaceFields = [];
	workspaceFields = [
		...workspaceFields,
		'timelineView', 
		'interfaceScale', 
		'rl'
	];

	this.saveLayout = function() {
		self.save();
		const interfaceSettings = {};
		workspaceFields.forEach(f => {
			interfaceSettings[f] = app.ui.faces[f].value;
		});
		const panelSettings = JSON.parse(localStorage.getItem(appName)).panels;
		const jsonFile = JSON.stringify({ panels: panelSettings, interface: interfaceSettings });
		const fileName = prompt('Layout Name:', 'New Layout');
		const blob = new Blob([jsonFile], { type: "application/x-download;charset=utf-8" });
		saveAs(blob, `${fileName}.json`);
	};

	this.loadLayoutFile = function(url) {
		// load default file
		if (url) {
			fetch(url)
				.then(response => { return response.json() })
				.then(data => { 
					loadInterface(data.interface); 
					loadPanels(data.panels);
				})
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
							const settings = JSON.parse(e.target.result);
							loadPanels(settings.panels);
							loadInterface(settings.interface);
						}
					})(f);
					reader.readAsText(f);
				}
			};
		}
	};

}