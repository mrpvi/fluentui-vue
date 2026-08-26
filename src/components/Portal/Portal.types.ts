export interface PortalProps {
  /** Renders children into the target instead of the component position. */
  mountNode?: string | HTMLElement;
  /** Keeps the portal in the normal document flow when true. */
  disabled?: boolean;
}

export interface PortalSlots {
  default?: () => unknown;
}
