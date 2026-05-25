 export const pick = <O extends Record<string, unknown>, K extends keyof O>(
    object: O,
    keys: K[]
  ) => {
    const result :Partial<O> = {} ;
  
    for (const key of keys) {
      if (object && Object.hasOwnProperty.call(object, key)) {
        result[key] = object[key];
      }
    }
  
    return result;
  };