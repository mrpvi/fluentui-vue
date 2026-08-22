import { computed, inject, toValue, type MaybeRefOrGetter } from 'vue';
import { fieldContextKey, type FieldContextValue } from '../components/Field/fieldContext';

export interface FieldControlPropsOptions {
  supportsLabelFor?: boolean;
  supportsRequired?: boolean;
  supportsSize?: boolean;
}

export type FieldCompatibleControlProps = Record<string, unknown> & {
  id?: string;
  size?: string;
  required?: boolean;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-required'?: boolean | 'true' | 'false';
};

function mergeIdRefs(...values: unknown[]): string | undefined {
  const ids = values
    .flatMap((value) => (typeof value === 'string' ? value.split(/\s+/) : []))
    .filter(Boolean);
  const uniqueIds = [...new Set(ids)];

  return uniqueIds.length > 0 ? uniqueIds.join(' ') : undefined;
}

export function getFieldControlProps(
  context: FieldContextValue | undefined,
  controlProps: FieldCompatibleControlProps,
  options: FieldControlPropsOptions = {},
): FieldCompatibleControlProps {
  if (!context) {
    return controlProps;
  }

  const merged: FieldCompatibleControlProps = { ...controlProps };
  const controlId = merged.id ?? context.generatedControlId;
  const labelFor = context.labelFor.value;
  const labelId = context.labelId.value;

  merged.id = controlId;

  if (
    labelId &&
    (!options.supportsLabelFor || labelFor !== controlId) &&
    merged['aria-labelledby'] == null
  ) {
    merged['aria-labelledby'] = labelId;
  }

  const describedBy = mergeIdRefs(
    context.validationMessageId.value,
    context.hintId.value,
    merged['aria-describedby'],
  );

  if (describedBy) {
    merged['aria-describedby'] = describedBy;
  }

  if (context.validationState.value === 'error' && merged['aria-invalid'] == null) {
    merged['aria-invalid'] = true;
  }

  if (context.required.value) {
    if (options.supportsRequired) {
      merged.required ??= true;
    } else {
      merged['aria-required'] ??= true;
    }
  }

  if (options.supportsSize) {
    merged.size ??= context.size.value;
  }

  return merged;
}

export function useFieldControlProps(
  controlProps: MaybeRefOrGetter<FieldCompatibleControlProps>,
  options?: FieldControlPropsOptions,
) {
  const context = inject(fieldContextKey, undefined);

  return computed(() => getFieldControlProps(context, toValue(controlProps), options));
}
