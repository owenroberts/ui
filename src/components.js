import { UIElement } from './components/element.js';
import { UICollection } from './components/collection.js';

// inherit UIElement
import { UILabel } from './components/label.js';
import { UIButton } from './components/button.js';
import { UIToggle } from './components/toggle.js';
import { UISelect } from './components/select.js';
import { UIFile } from './components/file.js';
import { UIInput } from './components/input.js';

// toggle and file used to inherit button, some overlap but different callback styles ... 

// inherits Input (input not used)
import { UIText } from './components/text.js';
import { UIRange } from './components/range.js';
import { UIColor } from './components/color.js';

// inherits Text
import { UINumber } from './components/number.js';
import { UIDrag } from './components/drag.js';

// inherit UICollection -- layout elems
import { UIPanel } from './components/panel.js';
import { UIRow } from './components/row.js';
import { UISection } from './components/section.js';
import { UITree } from './components/tree.js';
import { UIModal } from './components/modal.js';
import { UIList } from './components/list.js';

// inherit UICollection -- prop elems
import { UIToggleGrid } from './components/toggle-grid.js';
import { UIToggleCheck } from './components/toggle-check.js';
import { UISelectButton } from './components/select-button.js';
import { UINumberStep } from './components/number-step.js';
import { UIInputStep } from './components/input-step.js';
import { UIInputSearch } from './components/input-search.js';
import { UINumberRange } from './components/number-range.js';
import { UIGraph } from './components/graph.js';

// deprecated ??
// import { UIDragButton } from './components/drag-button.js';
// import { UISlider } from './components/slider.js';

// why not export?? -- i think because of that goofy type thing ... 
export { UIText, UIToggle, UIToggleCheck, UISelect, UISelectButton, UIRow, UISection, UINumberStep, UIPanel, UIRange, UIModal, UINumber, UIInputStep, UILabel, UIFile, UIElement, UIDrag, UIColor, UICollection, UIButton, UIToggleGrid, UIInputSearch, UINumberRange, UITree, UIGraph, UIList, UIInput };