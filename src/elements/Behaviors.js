/*
	ui mixins ... 
	need to be things that aren't in base types (element, collection) but are in different inheritence trees
*/

export const KeyMixins = {
	setKey(key, title) {
		// console.log('set key this', this);
		this.title = `${ title ? title : '' } ~ ${ key }`;
		this.el.addEventListener('mouseenter', () => { this.onPress(false); });
		this.el.addEventListener('mouseleave', () => { this.onRelease(); });
	},
	onPress(triggerRelease) {
		this.addClass('triggered');
		
		if (window.ToolTip) {
			window.ToolTip.text = `${ this.title }`;
			window.ToolTip.addClass('visible');
		}
		
		if (triggerRelease === true) {
			setTimeout(() => { this.onRelease() }, 400);
		}
	},
	onRelease() {
		this.removeClass('triggered');
		if (window.ToolTip) {
			window.ToolTip.removeClass('visible');
		}
	}
};

// this does not need to be mixin at all ... if not this, not mixin ... 
export const NumberMixins = {
	formatNumberInput(value) {
		if (typeof value === 'string') {
			if (value.match(/\D/)) {
				try {
					value = eval(value);
				} catch(e) {
					alert("Please enter a numerical value or mathematical expression.");
					return;
				}
			}
		}
		return value;
	}
};