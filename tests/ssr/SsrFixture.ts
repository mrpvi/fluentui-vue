import { defineComponent, h } from 'vue';
import {
  FAccordion,
  FAccordionHeader,
  FAccordionItem,
  FAccordionPanel,
  FBadge,
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
  FPresenceBadge,
  FProgressBar,
  FRating,
  FRatingDisplay,
  FRadio,
  FRadioGroup,
  FSkeleton,
  FSkeletonItem,
  FSlider,
  FSelect,
  FSearchBox,
  FSpinner,
  FSpinButton,
  FSwitch,
  FText,
  FTextarea,
  FToggleButton,
} from '../../src';

export const SsrFixture = defineComponent({
  name: 'SsrFixture',
  setup() {
    return () =>
      h('main', { class: 'fui-theme-light' }, [
        h(FText, { as: 'h1', size: 700 }, () => 'SSR fixture'),
        h(FLabel, { for: 'standalone-input' }, () => 'Standalone input'),
        h(FInput, { id: 'standalone-input', defaultValue: 'Initial value' }),
        h(
          FField,
          {
            label: 'Email address',
            hint: 'Use a work address.',
            required: true,
          },
          { default: () => h(FInput, { type: 'email' }) },
        ),
        h(
          FField,
          { label: 'Biography' },
          { default: () => h(FTextarea, { defaultValue: 'Vue-native components' }) },
        ),
        h(FCheckbox, { defaultChecked: true, label: 'Accept terms' }),
        h(
          FToggleButton,
          {
            class: 'ssr-toggle-button',
            appearance: 'primary',
            defaultChecked: true,
            isAccessible: true,
          },
          {
            default: () => 'Server pinned action',
            icon: () => h('svg', { viewBox: '0 0 20 20' }),
          },
        ),
        h(
          FCompoundButton,
          {
            class: 'ssr-compound-button',
            appearance: 'primary',
            secondaryContent: 'Server secondary content',
          },
          {
            default: () => 'Server compound action',
            icon: () => h('svg', { viewBox: '0 0 40 40' }),
          },
        ),
        h(
          FCompoundButton,
          {
            as: 'a',
            class: 'ssr-compound-link',
            href: '#compound-details',
            secondaryContent: 'Server compound destination',
          },
          () => 'Server compound link',
        ),
        h(FDivider, { 'aria-label': 'Contentless boundary' }),
        h(FDivider, { appearance: 'brand' }, () => 'Server section'),
        h(FDivider, { vertical: true }, () => 'Vertical section'),
        h(FImage, {
          src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
          alt: 'SSR image',
          fit: 'cover',
          shape: 'rounded',
          width: 64,
          height: 48,
        }),
        h(FBadge, { appearance: 'tint', color: 'success', shape: 'rounded' }, () => 'Server badge'),
        h(FCounterBadge, {
          count: 120,
          overflowCount: 99,
          role: 'img',
          'aria-label': 'Server notifications',
        }),
        h(FPresenceBadge, { status: 'away', outOfOffice: true, size: 'large' }),
        h(FSpinner, { label: 'Server loading', labelPosition: 'before', size: 'large' }),
        h(FSpinner, {
          class: 'ssr-delayed-spinner',
          delay: 1000,
          label: 'Delayed server loading',
        }),
        h(FProgressBar, {
          class: 'ssr-determinate-progress',
          value: 36,
          max: 100,
          thickness: 'large',
          'aria-label': 'Server progress',
        }),
        h(
          FSkeleton,
          {
            class: 'ssr-skeleton',
            animation: 'pulse',
            appearance: 'translucent',
            size: 24,
            shape: 'circle',
            'aria-label': 'Server skeleton',
          },
          { default: () => h(FSkeletonItem, { class: 'ssr-skeleton-item', as: 'span' }) },
        ),
        h(
          FSkeleton,
          {
            class: 'ssr-skeleton-status',
            as: 'span',
            role: 'status',
            'aria-busy': false,
            width: 180,
            'aria-label': 'Server skeleton status',
          },
          { default: () => h(FSkeletonItem) },
        ),
        h(FProgressBar, {
          class: 'ssr-indeterminate-progress',
          'aria-label': 'Server indeterminate progress',
        }),
        h(
          FField,
          {
            label: 'Server field progress',
            hint: 'Rendered with Field context.',
            validationState: 'warning',
            validationMessage: 'Server progress warning',
          },
          { default: () => h(FProgressBar, { class: 'ssr-field-progress', value: 0.75 }) },
        ),
        h(FSlider, {
          class: 'ssr-slider',
          'aria-label': 'Server volume',
          defaultValue: 0.3,
          min: -0.5,
          max: 0.5,
          step: 0.1,
        }),
        h(
          FField,
          {
            label: 'Server slider field',
            hint: 'Server slider hint',
            validationMessage: 'Server slider invalid',
            size: 'small',
          },
          { default: () => h(FSlider, { class: 'ssr-field-slider', vertical: true }) },
        ),
        h(FSpinButton, {
          class: 'ssr-spin-button',
          defaultValue: 2,
          min: 0,
          max: 10,
          step: 2,
          'aria-label': 'Server quantity',
        }),
        h(FSpinButton, {
          class: 'ssr-formatted-spin-button',
          modelValue: 3,
          displayValue: '$3.00',
          'aria-label': 'Server price',
        }),
        h(
          FField,
          {
            label: 'Server field quantity',
            hint: 'Rendered with SpinButton Field context.',
            required: true,
          },
          { default: () => h(FSpinButton, { class: 'ssr-field-spin-button', defaultValue: 1 }) },
        ),
        h(FSwitch, {
          class: 'ssr-switch',
          defaultChecked: true,
          label: 'Server switch',
          labelPosition: 'before',
          name: 'server-switch',
          value: 'enabled',
        }),
        h(
          FField,
          { label: 'Server field switch', hint: 'Server switch hint', required: true },
          { default: () => h(FSwitch, { class: 'ssr-field-switch' }) },
        ),
        h(
          FRadioGroup,
          {
            class: 'ssr-radio-group',
            defaultValue: 'email',
            'aria-label': 'Server contact method',
          },
          {
            default: () => [
              h(FRadio, { value: 'email', label: 'Server email' }),
              h(FRadio, { value: 'chat', label: 'Server chat' }),
            ],
          },
        ),
        h(
          FCard,
          {
            class: 'ssr-card',
            defaultSelected: true,
            name: 'server-card',
            value: 'report',
          },
          {
            default: () => [
              h(
                FCardPreview,
                {},
                { default: () => h('img', { src: 'preview.png', alt: 'Server card preview' }) },
              ),
              h(
                FCardHeader,
                {},
                {
                  header: () => h('h2', { id: 'server-card-title' }, 'Server card'),
                  description: () => 'Hydration fixture',
                },
              ),
              h(FCardFooter, {}, { default: () => h(FButton, {}, () => 'Open server card') }),
            ],
          },
        ),
        h(
          FCard,
          { as: 'article', class: 'ssr-article-card', 'aria-label': 'Server article' },
          () => 'Article card',
        ),
        h(
          FAccordion,
          { class: 'ssr-accordion', defaultOpenItems: 'overview' },
          {
            default: () => [
              h(
                FAccordionItem,
                { value: 'overview' },
                {
                  default: () => [
                    h(FAccordionHeader, { as: 'h2' }, () => 'Server accordion'),
                    h(FAccordionPanel, {}, () => 'Server accordion panel'),
                  ],
                },
              ),
            ],
          },
        ),
        h(
          FField,
          { label: 'Server companion', hint: 'Choose one animal.', required: true },
          {
            default: () =>
              h(
                FSelect,
                { defaultValue: 'dog', name: 'companion' },
                {
                  default: () => [
                    h('option', { value: '' }, 'Choose a companion'),
                    h('optgroup', { label: 'Animals' }, [
                      h('option', { value: 'cat' }, 'Cat'),
                      h('option', { value: 'dog' }, 'Dog'),
                    ]),
                  ],
                },
              ),
          },
        ),
        h(FSearchBox, {
          class: 'ssr-search-box',
          defaultValue: 'Server query',
          name: 'query',
          'aria-label': 'Server search',
        }),
        h(
          FField,
          {
            label: 'Server field search',
            hint: 'Rendered with SearchBox Field context.',
            size: 'large',
          },
          {
            default: () =>
              h(FSearchBox, {
                class: 'ssr-field-search-box',
                placeholder: 'Search server content',
              }),
          },
        ),
        h(FRating, {
          class: 'ssr-rating',
          defaultValue: 2.5,
          step: 0.5,
          name: 'ssr-rating',
          'aria-label': 'Server rating',
        }),
        h(
          FField,
          { label: 'Server field rating', hint: 'Choose a server rating.', required: true },
          {
            default: () =>
              h(FRating, { class: 'ssr-field-rating', defaultValue: 4, name: 'ssr-field-rating' }),
          },
        ),
        h(FRating, {
          class: 'ssr-readonly-rating',
          defaultValue: 3,
          readOnly: true,
          'aria-label': 'Server read-only rating',
        }),
        h(FRating, {
          class: 'ssr-disabled-rating',
          defaultValue: 2,
          disabled: true,
          'aria-label': 'Server disabled rating',
        }),
        h(FRatingDisplay, {
          class: 'ssr-rating-display',
          value: 4.5,
          count: 1160,
          'aria-label': 'Server rating display',
        }),
        h(FRatingDisplay, {
          class: 'ssr-compact-rating-display',
          value: 3.8,
          count: 86,
          compact: true,
          color: 'marigold',
          'aria-label': 'Server compact rating display',
        }),
        h(FLink, { href: '#details' }, () => 'View details'),
        h(FButton, { appearance: 'primary' }, () => 'Continue'),
      ]);
  },
});
