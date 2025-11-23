/**
 * save layout, interface values
 */
export class Settings {

	constructor(ui, params) {
		console.log(params.name)
		
		this.ui = ui;
		this.workspaces = params.workspaces ?? [];
		this.appLoad = params.appLoad;
		this.appSave = params.appSave;

		this.localStorageString = `settings-${ params.name }`;
		this.workspaceFields = [
			...params?.workspaceFields,
			'timelineLayout', 
			'rightLayout',
			'upLayout',
		];
	}

	loadPanels(panels) {
		for (const p in panels) {
			if (p === 'el') continue;
			if (!this.ui.panels[p]) continue;
			this.ui.panels[p].setup(panels[p]);
			let panel = this.ui.panels[p];
			let settings = panels[p];
			this.ui.layout[panel.gridArea || 'default'].panels.append(panel);
		}
	}

	loadFaces(faces) {
		for (const f in faces) {
			if (f === 'palettes') continue;
			if (f === 'quickRef') continue;
			if (!this.ui.faces[f]) continue;
			this.ui.faces[f].update(faces[f]);
		}
	}

	loadLayout(layout) {
		for (const section in layout) {
			this.ui.layout[section].load(layout[section]);
		}
	}

	save() {
		const settings = {
			faces: {},
			panels: {},
			layout: this.ui.layout.getSettings(),
			quick: this.ui.quick.list,
		};

		Object.keys(this.ui.faces)
			.filter(f => !this.ui.faces[f].ignoreSettings)
			.forEach(f => {
				settings.faces[f] = this.ui.faces[f].value;
			});

		if (this.appSave) {
			Object.assign(settings.faces, this.appSave());
		}
		
		for (const p in this.ui.panels) {
			settings.panels[p] = this.ui.panels[p].settings;
		}

		localStorage[this.localStorageString] = JSON.stringify(settings);
	}

	load() {
		if (localStorage[this.localStorageString]) {
			const settings = JSON.parse(localStorage[this.localStorageString]);
			this.loadLayout(settings.layout);
			this.loadPanels(settings.panels);
			this.loadFaces(settings.faces);

			if (settings.quickRef) {
				this.ui.quick.list = settings.quickRef;
				settings.quickRef.forEach(ref => {
					// app.ui.createUI(ref, ref.mod, ref.sub, app.ui.panels.quickRef);
					console.log(ref);
				});
			}
			if (this.appLoad) this.appLoad(settings);
		} else {
			if (this.workspaces.length > 0) {
				this.loadWorkspace(this.workspaces[0].url)
			}
		}
	}

	clear() {
		localStorage.setItem(localStorageString, '');
	}

	saveWorkspace() {
		this.save();

		const facesSettings = {};
		this.workspaceFields
			.filter(f => this.ui.faces[f])
			.forEach(f => {
				facesSettings[f] = this.ui.faces[f].value;
			});

		const savedSettings = JSON.parse(localStorage.getItem(this.localStorageString));
		
		const jsonFile = JSON.stringify({ 
			panels: savedSettings.panels, 
			layout: savedSettings.layout,
			faces: facesSettings,
		});
		
		const fileName = prompt('Layout Name:', 'New Layout');
		const blob = new Blob([jsonFile], { type: "application/x-download;charset=utf-8" });
		saveAs(blob, `${fileName}.json`);
	}

	// prob need better name for this ... 
	loadSettings(settings) {
		this.loadLayout(settings.layout);
		this.loadFaces(settings.faces); 
		this.loadPanels(settings.panels);
	}

	loadWorkspace(url) {
		if (url.hasOwnProperty('interface')) {
			this.loadSettings(url);
		} else if (url) {
			// load default file
			fetch(url)
				.then(response => { return response.json(); })
				.then(settings => { this.loadSettings(settings); })
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
							this.loadSettings(JSON.parse(e.target.result))
						}
					})(f);
					reader.readAsText(f);
				}
			};
		}
	}
}
