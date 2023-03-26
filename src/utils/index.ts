import * as _ from 'lodash';
import * as dayjs from 'dayjs';

export function transformResult<T>(values: T): T {
  if (_.isArray(values)) {
    return values.map((item) => {
      if (
        (_.isPlainObject(item) && item?.hasOwnProperty('_id')) ||
        item?.hasOwnProperty('__v')
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
      return item;
    }) as T;
  }
  if (
    (_.isPlainObject(values) && values?.hasOwnProperty('_id')) ||
    values?.hasOwnProperty('__v')
  ) {
    const cloneValues = _.omit(values as any, ['_id', '__v']);
    for (const subItem in cloneValues) {
      cloneValues[subItem] = transformResult(cloneValues[subItem]);
    }
    return {
      id: values['_id'],
      ...cloneValues,
    } as T;
  }
  return values;
}

export function generateOrderId(): string {
  const id = `${dayjs().hour()}${dayjs().minute()}${dayjs().second()}${dayjs().millisecond()}`;
  return id;
}
