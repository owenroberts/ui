/*
	ui mixins ... 
	need to be things that aren't in base types (element, collection) but are in different inheritence trees
*/

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