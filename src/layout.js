import { UICollection, UISection, UIPanel } from './oi.js';

export class Layout {
	constructor(app, params) {

		this.app = app;
		this.container = new UICollection({ id: 'container' });
		this.sections = {};
	
		//  mostly ui
		this.default = this.container.add(new UISection({ id: 'ui', gridArea: 'default', app }));
	
		// full-width section for timeline related stuff
		this.timeline = this.container.add(new UISection({ id: 'ui-timeline', gridArea: 'timeline', app }));
	
		// canvas in lines, melody editor in doodoo 
		this.main = this.container.add(new UISection({ id: 'main', gridArea: 'main', app }));
	}

	addSelectOption(key, label) {
		this.default.addSelectorOption(key, label);
		this.timeline.addSelectorOption(key, label);
		this.main.addSelectorOption(key, label);
	}

	getSettings() {
		return {
			default: this.default.settings,
			timeline: this.timeline.settings,
			main: this.main.settings,
		};
	}
}