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

// new jsm version bundles UI together here
// is this normal?? idk feels like this is how they do stuff ... 
// three js does export .. from ..., but that gets error ...

import { Interface, labelFromKey } from './Interface.js';
import { Settings } from './Settings.js';
import { UIChance, UIText, UIToggle, UIToggleCheck, UISelect, UISelectButton, UIRow, UISection, UINumberStep, UIPanel, UIRange, UIModal, UINumber, UIInputStep, UILabel, UIFile, UIElement, UIDrag, UIColor, UICollection, UIButton, UIToggleGrid, UIInputSearch, UINumberRange, UITree, UIGraph, UIList, UIInput } from './Elements.js';

export { Interface, Settings, labelFromKey, UIChance, UIText, UIToggle, UIToggleCheck, UISelect, UISelectButton, UIRow, UISection, UINumberStep, UIPanel, UIRange, UIModal, UINumber, UIInputStep, UILabel, UIFile, UIElement, UIDrag, UIColor, UICollection, UIButton, UIToggleGrid, UIInputSearch, UINumberRange, UITree, UIGraph, UIList, UIInput };