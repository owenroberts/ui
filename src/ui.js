window.UI = { Elements: {} }; // make Interface, Settings, some elements available to modules

/*
	notes on using ui
	ui modules in project connect ui to properties within the objects in the project

	ui can add elements (buttons, inputs, etc), key presses, and save properties in storage or in files

	ui can be added inside of project module if it doesn't reference the rest of the ui

	ui that needs to be saved use addProp
	button that just need a key command use addCallback (addButton?)
	ui that needs key command, or used in other modules, but not save, addUI
	need to specify a panel (maybe set the current panel or something ... )
	
*/