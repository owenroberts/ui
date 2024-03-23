import { UIElement } from './elements/Element.js';
import { UICollection } from './elements/Collection.js';

// inhert UIElement
import { UILabel } from './elements/Label.js';
import { UIButton } from './elements/Button.js';
import { UIToggle } from './elements/Toggle.js';
import { UIText } from './elements/Text.js';

import { UISelect } from './elements/Select.js';
import { UIRange } from './elements/Range.js';
import { UINumber } from './elements/Number.js';
import { UIFile } from './elements/File.js';
import { UIDrag } from './elements/Drag.js';
import { UIColor } from './elements/Color.js';

// inherit UICollection -- layout elems
import { UIPanel } from './elements/Panel.js';
import { UIRow } from './elements/Row.js';
import { UISection } from './elements/Section.js';
import { UITree } from './elements/Tree.js';
import { UIModal } from './elements/Modal.js';

// inherit UICollection -- prop elems
import { UIChance } from './elements/Chance.js';
import { UIToggleGrid } from './elements/ToggleGrid.js';
import { UIToggleCheck } from './elements/ToggleCheck.js';
import { UISelectButton } from './elements/SelectButton.js';
import { UINumberStep } from './elements/NumberStep.js';
import { UINumberList } from './elements/NumberList.js';
import { UIListStep } from './elements/ListStep.js';

import { UIInputList } from './elements/InputList.js';
import { UIInputSearch } from './elements/InputSearch.js';

// deprecated ??
// import { UINumberRange } from './elements/NumberRange.js';
// import { UIDragButton } from './elements/DragButton.js';
// import { UIInput } from './elements/Input.js';
// import { UIList } from './elements/List.js';


const Elements = { UIChance, UIText, UIToggle, UIToggleCheck, UISelect, UISelectButton, UIRow, UISection, UINumberStep, UIPanel, UIRange, UINumberList, UIModal, UINumber, UIListStep, UILabel, UIInputList, UIFile, UIElement, UIDrag, UIColor, UICollection, UIButton, UIToggleGrid, UIInputSearch, UITree };

export { Elements };