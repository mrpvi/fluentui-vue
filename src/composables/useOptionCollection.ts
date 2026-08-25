import { ref } from 'vue';

export interface OptionCollectionItem {
  disabled: boolean;
  element: HTMLElement;
  id: string;
  text: string;
  value: string;
}

export interface OptionCollectionRegistration {
  disabled: () => boolean;
  element: HTMLElement;
  id: () => string;
  text: () => string;
  value: () => string;
}

function compareDocumentOrder(first: HTMLElement, second: HTMLElement) {
  const position = first.compareDocumentPosition(second);

  if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
    return -1;
  }
  if (position & Node.DOCUMENT_POSITION_PRECEDING) {
    return 1;
  }
  return 0;
}

export function useOptionCollection() {
  const registrations = new Map<HTMLElement, OptionCollectionRegistration>();
  const activeOptionId = ref<string>();

  function getOptions(): OptionCollectionItem[] {
    return Array.from(registrations.values())
      .sort((first, second) => compareDocumentOrder(first.element, second.element))
      .map((registration) => ({
        disabled: registration.disabled(),
        element: registration.element,
        id: registration.id(),
        text: registration.text(),
        value: registration.value(),
      }));
  }

  function getOptionById(id: string) {
    return getOptions().find((option) => option.id === id);
  }

  function getOptionsMatchingText(matcher: (text: string) => boolean) {
    return getOptions().filter((option) => matcher(option.text));
  }

  function getOptionsMatchingValue(matcher: (value: string) => boolean) {
    return getOptions().filter((option) => matcher(option.value));
  }

  function setActiveOption(id: string | undefined, scroll = false) {
    if (id !== undefined && !getOptionById(id)) {
      return;
    }

    activeOptionId.value = id;

    if (scroll && id !== undefined) {
      getOptionById(id)?.element.scrollIntoView?.({ block: 'nearest' });
    }
  }

  function moveActiveOption(action: 'first' | 'last' | 'next' | 'previous', scroll = true) {
    const options = getOptions();
    if (options.length === 0) {
      activeOptionId.value = undefined;
      return;
    }

    const currentIndex = options.findIndex((option) => option.id === activeOptionId.value);
    const nextIndex =
      action === 'first'
        ? 0
        : action === 'last'
          ? options.length - 1
          : currentIndex < 0
            ? 0
            : action === 'next'
              ? Math.min(currentIndex + 1, options.length - 1)
              : Math.max(currentIndex - 1, 0);

    setActiveOption(options[nextIndex]?.id, scroll);
  }

  function registerOption(registration: OptionCollectionRegistration) {
    registrations.set(registration.element, registration);

    return () => {
      if (activeOptionId.value === registration.id()) {
        activeOptionId.value = undefined;
      }
      registrations.delete(registration.element);
    };
  }

  return {
    activeOptionId,
    getOptionById,
    getOptions,
    getOptionsMatchingText,
    getOptionsMatchingValue,
    moveActiveOption,
    registerOption,
    setActiveOption,
  };
}
