import { UIElement } from './elements/Element.js';
import { UICollection } from './elements/Collection.js';

// inherit UIElement
import { UILabel } from './elements/Label.js';
import { UIButton } from './elements/Button.js';
import { UIToggle } from './elements/Toggle.js';
import { UISelect } from './elements/Select.js';
import { UIFile } from './elements/File.js';
import { UIInput } from './elements/Input.js';

// toggle and file used to inherit button, some overlap but different callback styles ... 

// inherits Input (input not used)
import { UIText } from './elements/Text.js';
import { UIRange } from './elements/Range.js';
import { UIColor } from './elements/Color.js';

// inherits Text
import { UINumber } from './elements/Number.js';
import { UIDrag } from './elements/Drag.js';

// inherit UICollection -- layout elems
import { UIPanel } from './elements/Panel.js';
import { UIRow } from './elements/Row.js';
import { UISection } from './elements/Section.js';
import { UITree } from './elements/Tree.js';
import { UIModal } from './elements/Modal.js';
import { UIList } from './elements/List.js';

// inherit UICollection -- prop elems
import { UIToggleGrid } from './elements/ToggleGrid.js';
import { UIToggleCheck } from './elements/ToggleCheck.js';
import { UISelectButton } from './elements/SelectButton.js';
import { UINumberStep } from './elements/NumberStep.js';
import { UIInputStep } from './elements/InputStep.js';
import { UIInputSearch } from './elements/InputSearch.js';
import { UINumberRange } from './elements/NumberRange.js';
import { UIGraph } from './elements/Graph.js';

// deprecated ??
// import { UIDragButton } from './elements/DragButton.js';
// import { UISlider } from './elements/Slider.js';

// why not export?? -- i think because of that goofy type thing ... 
export { UIText, UIToggle, UIToggleCheck, UISelect, UISelectButton, UIRow, UISection, UINumberStep, UIPanel, UIRange, UIModal, UINumber, UIInputStep, UILabel, UIFile, UIElement, UIDrag, UIColor, UICollection, UIButton, UIToggleGrid, UIInputSearch, UINumberRange, UITree, UIGraph, UIList, UIInput };