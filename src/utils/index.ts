import * as _ from 'lodash';

export function transformResult<T>(values: T): T {
  if (_.isArray(values)) {
    return values.map((item) => {
      if (
        (_.isObject(item) && item.hasOwnProperty('_id')) ||
        item.hasOwnProperty('__v')
      ) {
        const cloneItem = _.omit(item, ['_id', '__v']);
        for (const subItem in cloneItem) {
          cloneItem[subItem] = transformResult(cloneItem[subItem]);
        }

        return {
          id: item['_id'],
          ...cloneItem,
        };
      }
    }) as T;
  }
  if (
    (_.isObject(values) && values.hasOwnProperty('_id')) ||
    values.hasOwnProperty('__v')
  ) {
    const cloneValues = _.omit(values as object, ['_id', '__v']);
    return {
      id: values['_id'],
      ...cloneValues,
    } as T;
  }
  return values;
}
