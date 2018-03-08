export enum NavigationType {
  NAVIGATE,
  RELOAD,
  HISTORY,
}

const STRING_NAMES = [
  'Navigated',
  'Reloaded',
  'History'
];

export namespace NavigationType {
  export function toString ( type: NavigationType ): string {
    return STRING_NAMES[ type ];
  }
}
