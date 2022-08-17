/*
	layout for app
	ui is interface
*/

function Layout(ui, params) {
	const self = this;

	const container = new UICollection({ id: 'container' });
	this.default = new UISection({ id: 'ui', gridArea: 'default' }, ui);
	container.append(this.default);
	
	// this.interface.append(ui.panels); // adding main panels to the interface collection
	
	this.timeline = new UISection({ id: 'ui-timeline', gridArea: 'timeline' }, ui);
	container.append(this.timeline);
	this.main = new UISection({ id: 'main', gridArea: 'main' }, ui);

	window.toolTip = new UILabel({id: 'tool-tip'});
	this.default.append(window.toolTip);

	this.toggleTimeline = function(isOn) {
		self.timeline.isVisible = isOn;
	};

	this.toggleRL = function(isOn) {
		if (isOn) container.addClass('RL');
		else container.removeClass('RL');
	};

	this.toggleUP = function(isOn) {
		if (isOn) container.addClass('UP');
		else container.removeClass('UP');
	};

	this.addSelectPanels = function(panelList) {
		this.default.addSelectorOptions(panelList);
		this.timeline.addSelectorOptions(panelList);
		this.main.addSelectorOptions(panelList);
	};

	this.addSelectOption = function(key, label) {
		this.default.addSelectorOption(key, label);
		this.timeline.addSelectorOption(key, label);
		this.main.addSelectorOption(key, label);
	};
}