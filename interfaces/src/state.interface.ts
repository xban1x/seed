export abstract class State {
  constructor(initial?: any) {
    if (initial === undefined) {
      return;
    }
    const keys = Object.keys(initial);
    for (const key of keys) {
      const val = initial[key];
      if (val instanceof Array) {
        (this as any)[key] = [...val];
      } else if (val instanceof Object) {
        (this as any)[key] = { ...val };
      } else {
        (this as any)[key] = val;
      }
    }
  }
}
