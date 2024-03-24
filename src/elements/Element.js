/*
	writing new jsm, comp version of classes
	try to make it so it works the same exact way first
	take notes about what to modify ... 
*/

export function UIElement(params={}) {

	const el = document.getElementById(params.id) ??
		document.createElement(params.tag ?? "div");

	for (const prop in params.css) { // rename css style??
		el.style[prop] = params.css[prop];
	}

	if (params.id !== undefined) el.id = params.id;
	if (params.class) addClass(params.class); // list?
	if (params.text) el.textContent = params.text;

	function addClass(val) { 
		el.classList.add(val); 
	}

	function removeClass(val) { 
		el.classList.remove(val); 
	}

	function hasClass(val) {
		return el.classList.contains(val);
	}

	return {
		el, addClass, removeClass, hasClass,
		getPosition() { 
			return {
				x: el.getBoundingClientRect().x, 
				y: el.getBoundingClientRect().y
			};
		},
		setText(val) { el.textContent = val; },
		getText() { return el.textContent; },
		getTitle() { return el.title; },
		setTitle(val) { el.title = val; },
		setType(val) { el.type = val; },

		// set style prop? set css prop?
		setProp(prop, value) { el.style.setProperty(prop, value); },
		// getProp(prop) { return el.style.getPropertyValue(prop); }, // used??
		
		remove() { el.remove(); }
	}

}