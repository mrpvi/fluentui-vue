import type { App, Plugin } from 'vue';
import { FBadge } from './components/Badge';
import { FButton } from './components/Button';
import { FCheckbox } from './components/Checkbox';
import { FCounterBadge } from './components/CounterBadge';
import { FDivider } from './components/Divider';
import { FField } from './components/Field';
import { FImage } from './components/Image';
import { FPresenceBadge } from './components/PresenceBadge';
import { FProgressBar } from './components/ProgressBar';
import { FInput } from './components/Input';
import { FSelect } from './components/Select';
import { FLabel } from './components/Label';
import { FLink } from './components/Link';
import { FSpinner } from './components/Spinner';
import { FSwitch } from './components/Switch';
import { FText } from './components/Text';
import { FTextarea } from './components/Textarea';

export const FluentVue: Plugin = {
  install(app: App) {
    app.component('FBadge', FBadge);
    app.component('FButton', FButton);
    app.component('FInput', FInput);
    app.component('FSelect', FSelect);
    app.component('FCheckbox', FCheckbox);
    app.component('FCounterBadge', FCounterBadge);
    app.component('FDivider', FDivider);
    app.component('FField', FField);
    app.component('FImage', FImage);
    app.component('FPresenceBadge', FPresenceBadge);
    app.component('FProgressBar', FProgressBar);
    app.component('FLabel', FLabel);
    app.component('FLink', FLink);
    app.component('FSpinner', FSpinner);
    app.component('FSwitch', FSwitch);
    app.component('FText', FText);
    app.component('FTextarea', FTextarea);
  },
};
