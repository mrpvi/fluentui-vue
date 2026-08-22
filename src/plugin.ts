import type { App, Plugin } from 'vue';
import { FBadge } from './components/Badge';
import { FButton } from './components/Button';
import { FCheckbox } from './components/Checkbox';
import { FCounterBadge } from './components/CounterBadge';
import { FDivider } from './components/Divider';
import { FField } from './components/Field';
import { FImage } from './components/Image';
import { FPresenceBadge } from './components/PresenceBadge';
import { FInput } from './components/Input';
import { FLabel } from './components/Label';
import { FLink } from './components/Link';
import { FText } from './components/Text';
import { FTextarea } from './components/Textarea';

export const FluentVue: Plugin = {
  install(app: App) {
    app.component('FBadge', FBadge);
    app.component('FButton', FButton);
    app.component('FInput', FInput);
    app.component('FCheckbox', FCheckbox);
    app.component('FCounterBadge', FCounterBadge);
    app.component('FDivider', FDivider);
    app.component('FField', FField);
    app.component('FImage', FImage);
    app.component('FPresenceBadge', FPresenceBadge);
    app.component('FLabel', FLabel);
    app.component('FLink', FLink);
    app.component('FText', FText);
    app.component('FTextarea', FTextarea);
  },
};
