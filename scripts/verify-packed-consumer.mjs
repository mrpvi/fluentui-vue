import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const localVueTsc = resolve(root, 'node_modules/.bin/vue-tsc');
const dependencyRoot = existsSync(localVueTsc) ? root : resolve(root, '../../..');
const consumer = await mkdtemp(resolve(tmpdir(), 'fluent-vue-consumer-'));
const packageDirectory = resolve(consumer, 'node_modules/@mrpvi/fluentui-vue');

try {
  const packed = JSON.parse(
    execFileSync('npm', ['pack', '--json', '--pack-destination', consumer], {
      cwd: root,
      encoding: 'utf8',
    }),
  );
  const tarball = resolve(consumer, packed[0].filename);

  await mkdir(packageDirectory, { recursive: true });
  execFileSync('tar', ['-xzf', tarball, '--strip-components=1', '-C', packageDirectory]);
  await symlink(
    resolve(dependencyRoot, 'node_modules/vue'),
    resolve(consumer, 'node_modules/vue'),
    'dir',
  );
  await mkdir(resolve(consumer, 'src'));

  await writeFile(
    resolve(consumer, 'index.html'),
    '<div id="app"></div><script type="module" src="/src/main.ts"></script>\n',
  );
  await writeFile(
    resolve(consumer, 'src/main.ts'),
    `import { createApp, h, ref } from 'vue';
import {
  FAccordion,
  FAccordionHeader,
  FAccordionItem,
  FAccordionPanel,
  FAvatar,
  FAvatarGroup,
  FAvatarGroupItem,
  FAvatarGroupPopover,
  FBadge,
  FBreadcrumb,
  FBreadcrumbButton,
  FBreadcrumbDivider,
  FBreadcrumbItem,
  FButton,
  FCard,
  FCardFooter,
  FCardHeader,
  FCardPreview,
  FCheckbox,
  FCompoundButton,
  FCounterBadge,
  FDivider,
  FField,
  FImage,
  FInput,
  FLabel,
  FLink,
  FList,
  FListbox,
  FListItem,
  FOption,
  FOptionGroup,
  FPersona,
  FPresenceBadge,
  FProgressBar,
  FRating,
  FRatingDisplay,
  FRatingItem,
  FSkeleton,
  FSkeletonItem,
  FSlider,
  FRadio,
  FRadioGroup,
  FSelect,
  FSearchBox,
  FSpinner,
  FSpinButton,
  FSwitch,
  FTab,
  FTabList,
  FText,
  FTextarea,
  FToggleButton,
  FluentVue,
  packageVersion,
  type AvatarColor,
  type AvatarGroupLayout,
  type AvatarSize,
  type BadgeAppearance,
  type BadgeColor,
  type BreadcrumbFocusMode,
  type BreadcrumbSize,
  type ButtonAppearance,
  type CardAppearance,
  type CardFocusMode,
  type CardOrientation,
  type CardSize,
  type CheckboxValue,
  type CompoundButtonAppearance,
  type CompoundButtonIconPosition,
  type CompoundButtonShape,
  type CompoundButtonSize,
  type DividerAppearance,
  type FluentTheme,
  type ImageFit,
  type ImageShape,
  type ListNavigationMode,
  type ListSelectionMode,
  type ListValue,
  type PersonaSize,
  type PersonaTextPosition,
  type PresenceBadgeStatus,
  type ProgressBarColor,
  type ProgressBarThickness,
  type RatingColor,
  type RatingSize,
  type RatingStep,
  type SkeletonAnimation,
  type SkeletonSize,
  type SliderSize,
  type RadioGroupLayout,
  type RadioLabelPosition,
  type SelectAppearance,
  type SelectSize,
  type SearchBoxAppearance,
  type SearchBoxSize,
  type SpinnerLabelPosition,
  type SpinnerSize,
  type SpinButtonAppearance,
  type SpinButtonValue,
  type SwitchLabelPosition,
  type SwitchSize,
  type TabListAppearance,
  type TabListSize,
  type TabValue,
  type TextareaResize,
  type ToggleButtonAppearance,
  type ToggleButtonIconPosition,
  type ToggleButtonShape,
  type ToggleButtonSize,
} from '@mrpvi/fluentui-vue';
import '@mrpvi/fluentui-vue/style.css';

const accepted = ref<CheckboxValue>('mixed');
const avatarColor: AvatarColor = 'colorful';
const avatarGroupLayout: AvatarGroupLayout = 'stack';
const avatarSize: AvatarSize = 40;
const avatarOverflowOpen = ref(false);
const radioValue = ref('email');
const badgeAppearance: BadgeAppearance = 'tint';
const badgeColor: BadgeColor = 'success';
const breadcrumbFocusMode: BreadcrumbFocusMode = 'arrow';
const breadcrumbSize: BreadcrumbSize = 'large';
const appearance: ButtonAppearance = 'primary';
const toggleAppearance: ToggleButtonAppearance = 'primary';
const toggleIconPosition: ToggleButtonIconPosition = 'after';
const toggleShape: ToggleButtonShape = 'circular';
const toggleSize: ToggleButtonSize = 'small';
const compoundAppearance: CompoundButtonAppearance = 'primary';
const compoundIconPosition: CompoundButtonIconPosition = 'after';
const compoundShape: CompoundButtonShape = 'rounded';
const compoundSize: CompoundButtonSize = 'medium';
const cardAppearance: CardAppearance = 'outline';
const cardFocusMode: CardFocusMode = 'tab-only';
const cardOrientation: CardOrientation = 'vertical';
const cardSize: CardSize = 'medium';
const resize: TextareaResize = 'vertical';
const dividerAppearance: DividerAppearance = 'brand';
const imageFit: ImageFit = 'cover';
const imageShape: ImageShape = 'rounded';
const listNavigationMode: ListNavigationMode = 'items';
const listSelectionMode: ListSelectionMode = 'multiselect';
const selectedListItems = ref<ListValue[]>(['packed-one']);
const selectedOptions = ref<string[]>(['packed-cat']);
const personaSize: PersonaSize = 'large';
const personaTextPosition: PersonaTextPosition = 'after';
const presenceStatus: PresenceBadgeStatus = 'available';
const progressColor: ProgressBarColor = 'success';
const progressThickness: ProgressBarThickness = 'large';
const ratingColor: RatingColor = 'marigold';
const ratingSize: RatingSize = 'large';
const ratingStep: RatingStep = 0.5;
const ratingValue = ref(2.5);
const skeletonAnimation: SkeletonAnimation = 'pulse';
const skeletonSize: SkeletonSize = 48;
const sliderSize: SliderSize = 'small';
const radioGroupLayout: RadioGroupLayout = 'horizontal';
const radioLabelPosition: RadioLabelPosition = 'after';
const selectAppearance: SelectAppearance = 'outline';
const selectSize: SelectSize = 'medium';
const searchAppearance: SearchBoxAppearance = 'filled-lighter';
const searchSize: SearchBoxSize = 'large';
const spinnerLabelPosition: SpinnerLabelPosition = 'after';
const spinnerSize: SpinnerSize = 'large';
const spinButtonAppearance: SpinButtonAppearance = 'outline';
const spinButtonValue = ref<SpinButtonValue>(2);
const switchLabelPosition: SwitchLabelPosition = 'before';
const switchSize: SwitchSize = 'small';
const tabAppearance: TabListAppearance = 'subtle-circular';
const tabSize: TabListSize = 'medium';
const selectedTab = ref<TabValue>('overview');
const theme: FluentTheme = 'light';

createApp({
  render: () =>
    h('main', { 'data-version': packageVersion, 'data-theme': theme }, [
      h(FText, { as: 'h1', size: 700, weight: 'semibold' }, () => 'Fluent Vue'),
      h(FLabel, { for: 'standalone-email', required: true }, () => 'Standalone email'),
      h(FInput, { id: 'standalone-email', type: 'email', required: true }),
      h(
        FField,
        {
          label: 'Email address',
          hint: 'Use your work email.',
          required: true,
        },
        { default: () => h(FInput, { type: 'email' }) },
      ),
      h(
        FField,
        {
          label: 'Biography',
          hint: 'Write a short profile.',
        },
        {
          default: () =>
            h(FTextarea, {
              defaultValue: 'Native Vue components',
              resize,
            }),
        },
      ),
      h(FCheckbox, {
        modelValue: accepted.value,
        'onUpdate:modelValue': value => (accepted.value = value),
        label: 'Accept terms',
      }),
      h(
        FField,
        { label: 'Receipt method', hint: 'Choose one option.', required: true },
        {
          default: () =>
            h(
              FRadioGroup,
              {
                modelValue: radioValue.value,
                'onUpdate:modelValue': value => (radioValue.value = value),
                layout: radioGroupLayout,
                name: 'packed-receipt',
              },
              {
                default: () => [
                  h(FRadio, { value: 'email', label: 'Email', labelPosition: radioLabelPosition }),
                  h(FRadio, { value: 'paper', label: 'Paper' }),
                ],
              },
            ),
        },
      ),
      h(FBadge, { appearance: badgeAppearance, color: badgeColor }, () => 'Packed badge'),
      h(FCounterBadge, {
        count: 120,
        overflowCount: 99,
        role: 'img',
        'aria-label': 'Packed notifications',
      }),
      h(FPresenceBadge, { status: presenceStatus, size: 'large' }),
      h(FSlider, {
        'aria-label': 'Packed slider',
        defaultValue: 0.3,
        min: -0.5,
        max: 0.5,
        step: 0.1,
        size: sliderSize,
      }),
      h(FSlider, {
        'aria-label': 'Packed vertical slider',
        defaultValue: 25,
        vertical: true,
      }),
      h(
        FField,
        { label: 'Packed select', required: true },
        {
          default: () =>
            h(
              FSelect,
              { defaultValue: 'dog', appearance: selectAppearance, size: selectSize, name: 'companion' },
              { default: () => [h('option', { value: 'cat' }, 'Cat'), h('option', { value: 'dog' }, 'Dog')] },
            ),
        },
      ),
      h(FSpinner, {
        as: 'span',
        label: 'Packed spinner',
        labelPosition: spinnerLabelPosition,
        size: spinnerSize,
      }),
      h(
        FSpinner,
        { label: 'Packed custom spinner' },
        { indicator: () => h('span', { class: 'packed-indicator' }) },
      ),
      h(FProgressBar, {
        value: 72,
        max: 100,
        color: progressColor,
        thickness: progressThickness,
        'aria-label': 'Packed progress',
      }),
      h(FField, { label: 'Packed field progress', validationState: 'warning' }, {
        default: () => h(FProgressBar, { value: 0.4 }),
      }),
      h(FProgressBar, {
        indeterminateMotion: false,
        'aria-label': 'Packed indeterminate progress',
      }),
      h(FRating, {
        modelValue: ratingValue.value,
        'onUpdate:modelValue': value => (ratingValue.value = value),
        color: ratingColor,
        size: ratingSize,
        step: ratingStep,
        name: 'packed-rating',
        'aria-label': 'Packed rating',
      }),
      h(FRating, { defaultValue: 3, readOnly: true, 'aria-label': 'Packed read-only rating' }),
      h(FRatingDisplay, {
        value: 4.5,
        count: 1160,
        color: ratingColor,
        'aria-label': 'Packed rating display',
      }),
      h(FRatingDisplay, { value: 3.8, compact: true, 'aria-label': 'Packed compact rating' }),
      h(FRating, { defaultValue: 1, 'aria-label': 'Packed custom rating' }, {
        default: () => [h(FRatingItem, { value: 1 }), h(FRatingItem, { value: 2 })],
      }),
      h(FSpinButton, {
        modelValue: spinButtonValue.value,
        'onUpdate:modelValue': value => (spinButtonValue.value = value),
        appearance: spinButtonAppearance,
        min: 0,
        max: 10,
        name: 'packed-quantity',
        'aria-label': 'Packed quantity',
      }),
      h(FField, { label: 'Packed field quantity', required: true }, {
        default: () => h(FSpinButton, { defaultValue: 1 }),
      }),
      h(FSwitch, {
        defaultChecked: true,
        label: 'Packed switch',
        labelPosition: switchLabelPosition,
        name: 'packed-switch',
        size: switchSize,
        value: 'enabled',
      }),
      h(
        FField,
        { label: 'Packed field switch', required: true },
        { default: () => h(FSwitch) },
      ),
      h(
        FSkeleton,
        {
          animation: skeletonAnimation,
          appearance: 'translucent',
          size: skeletonSize,
          shape: 'circle',
          'aria-label': 'Packed skeleton',
        },
        {
          default: () => [
            h(FSkeletonItem),
            h(FSkeletonItem, { size: 16, shape: 'rectangle', style: { width: '60%' } }),
          ],
        },
      ),
      h(
        FAccordion,
        { defaultOpenItems: 'packed' },
        {
          default: () => [
            h(
              FAccordionItem,
              { value: 'packed' },
              {
                default: () => [
                  h(FAccordionHeader, { as: 'h2' }, () => 'Packed accordion'),
                  h(FAccordionPanel, {}, () => 'Packed accordion panel'),
                ],
              },
            ),
          ],
        },
      ),
      h(
        FTabList,
        {
          modelValue: selectedTab.value,
          'onUpdate:modelValue': value => (selectedTab.value = value),
          appearance: tabAppearance,
          size: tabSize,
          'aria-label': 'Packed tabs',
        },
        {
          default: () => [
            h(FTab, { value: 'overview' }, () => 'Overview'),
            h(FTab, { value: 'details' }, () => 'Details'),
          ],
        },
      ),
      h(
        FBreadcrumb,
        {
          focusMode: breadcrumbFocusMode,
          size: breadcrumbSize,
          'aria-label': 'Packed breadcrumb',
        },
        {
          default: () => [
            h(
              FBreadcrumbItem,
              {},
              { default: () => h(FBreadcrumbButton, { href: '#packed-home' }, () => 'Home') },
            ),
            h(FBreadcrumbDivider),
            h(
              FBreadcrumbItem,
              {},
              { default: () => h(FBreadcrumbButton, { current: true }, () => 'Current') },
            ),
          ],
        },
      ),
      h(
        FList,
        {
          navigationMode: listNavigationMode,
          selectionMode: listSelectionMode,
          modelValue: selectedListItems.value,
          'onUpdate:modelValue': value => (selectedListItems.value = value),
          'aria-label': 'Packed list',
        },
        {
          default: () => [
            h(FListItem, { value: 'packed-one' }, () => 'Packed selected item'),
            h(
              FListItem,
              { value: 'packed-two', disabledSelection: true },
              () => 'Packed disabled item',
            ),
          ],
        },
      ),
      h(
        FField,
        { label: 'Packed companion', hint: 'Choose packed options.', required: true },
        {
          default: () =>
            h(
              FListbox,
              {
                modelValue: selectedOptions.value,
                'onUpdate:modelValue': value => (selectedOptions.value = value),
                multiselect: true,
              },
              {
                default: () => [
                  h(
                    FOptionGroup,
                    { label: 'Packed animals' },
                    {
                      default: () => [
                        h(FOption, { value: 'packed-cat' }, () => 'Packed Cat'),
                        h(FOption, { value: 'packed-dog', text: 'Packed Dog' }, () =>
                          h('strong', null, 'Packed Dog'),
                        ),
                      ],
                    },
                  ),
                ],
              },
            ),
        },
      ),
      h(FAvatar, {
        name: 'Packed Person',
        color: avatarColor,
        size: avatarSize,
        presence: { status: presenceStatus },
      }),
      h(
        FAvatarGroup,
        { layout: avatarGroupLayout, size: avatarSize, 'aria-label': 'Packed team' },
        {
          default: () => [
            h(FAvatarGroupItem, { name: 'Packed Ada' }),
            h(FAvatarGroupItem, { name: 'Packed Grace' }),
            h(
              FAvatarGroupPopover,
              {
                modelValue: avatarOverflowOpen.value,
                'onUpdate:modelValue': value => (avatarOverflowOpen.value = value),
                count: 1,
              },
              { default: () => h(FAvatarGroupItem, { name: 'Packed Margaret' }) },
            ),
          ],
        },
      ),
      h(
        FPersona,
        {
          name: 'Packed Persona',
          size: personaSize,
          textPosition: personaTextPosition,
          avatar: { color: avatarColor, shape: 'square' },
          presence: { status: presenceStatus },
        },
        {
          secondaryText: () => 'Packed role',
          tertiaryText: () => 'Packed location',
        },
      ),
      h(
        FCard,
        {
          appearance: cardAppearance,
          focusMode: cardFocusMode,
          orientation: cardOrientation,
          size: cardSize,
          defaultSelected: true,
          name: 'packed-card',
          value: 'report',
        },
        {
          default: () => [
            h(
              FCardPreview,
              {},
              { default: () => h('img', { src: 'preview.png', alt: 'Packed card preview' }) },
            ),
            h(FCardHeader, {}, { header: () => h('h2', { id: 'packed-card-title' }, 'Packed card') }),
            h(FCardFooter, {}, { default: () => h(FButton, {}, () => 'Open packed card') }),
          ],
        },
      ),
      h(
        FSearchBox,
        {
          defaultValue: 'Packed query',
          appearance: searchAppearance,
          size: searchSize,
          name: 'packed-query',
          'aria-label': 'Packed search',
          'onUpdate:modelValue': value => void value,
          onSearch: (_event, data) => void data.value,
        },
        {
          'content-before': () => h('span', null, 'Search:'),
          'content-after': () => h('span', null, 'Filter'),
          dismiss: () => h('span', { 'aria-hidden': 'true' }, '×'),
        },
      ),
      h(
        FField,
        { label: 'Packed field search', hint: 'Search the packed consumer.' },
        { default: () => h(FSearchBox, { placeholder: 'Search package' }) },
      ),
      h(FLink, { href: '#docs', inline: true }, () => 'Read documentation'),
      h(FDivider, { appearance: dividerAppearance }, () => 'Review'),
      h(FDivider, { vertical: true, 'aria-label': 'Column boundary' }),
      h(FImage, {
        src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
        alt: 'Packed consumer image',
        fit: imageFit,
        shape: imageShape,
        bordered: true,
        width: 64,
        height: 48,
      }),
      h(
        FToggleButton,
        {
          appearance: toggleAppearance,
          iconPosition: toggleIconPosition,
          shape: toggleShape,
          size: toggleSize,
          defaultChecked: true,
        },
        () => 'Packed toggle action',
      ),
      h(
        FToggleButton,
        { 'aria-label': 'Packed icon toggle' },
        { icon: () => h('svg', { viewBox: '0 0 20 20' }) },
      ),
      h(
        FCompoundButton,
        {
          appearance: compoundAppearance,
          iconPosition: compoundIconPosition,
          shape: compoundShape,
          size: compoundSize,
          secondaryContent: 'Packed secondary content',
        },
        {
          default: () => 'Packed compound action',
          icon: () => h('svg', { viewBox: '0 0 40 40' }),
        },
      ),
      h(
        FCompoundButton,
        {
          as: 'a',
          href: '#packed-compound',
          secondaryContent: 'Packed compound destination',
        },
        () => 'Packed compound link',
      ),
      h(FButton, { appearance }, () => 'Save'),
    ]),
})
  .use(FluentVue)
  .mount('#app');
`,
  );
  await writeFile(
    resolve(consumer, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          strict: true,
          skipLibCheck: true,
          noEmit: true,
        },
        include: ['src/**/*.ts'],
      },
      null,
      2,
    ),
  );

  execFileSync(
    resolve(dependencyRoot, 'node_modules/.bin/vue-tsc'),
    ['--noEmit', '-p', 'tsconfig.json'],
    {
      cwd: consumer,
      stdio: 'inherit',
    },
  );
  execFileSync(resolve(dependencyRoot, 'node_modules/.bin/vite'), ['build'], {
    cwd: consumer,
    stdio: 'inherit',
  });

  console.log('Packed consumer typecheck and production build passed.');
} finally {
  await rm(consumer, { recursive: true, force: true });
}
