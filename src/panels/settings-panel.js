import { UIPanel, UIButton } from '../oi.js';

export class SettingsPanel extends UIPanel {
	constructor(params) {
		super({ ...params, id: 'settings' });

		const settings = this.ui.settings;

		this.addButton({ 
			callback: () => {
				settings.save();
			}, 
			key: "ctrl-s", 
			text: 'Save' 
		});
	
		this.addButton({ 
			callback: () => {
				settings.load();
			}, 
			text: 'Load' 
		});

		this.addButton({ 
			callback: () => {
				settings.clear();
			}, 
			text: 'Clear' 
		});

	}
}