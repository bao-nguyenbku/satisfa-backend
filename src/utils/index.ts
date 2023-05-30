import * as _ from 'lodash';
import * as dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

export function transformResult(values: any) {
  if (_.isArray(values)) {
    return values.map((item) => {
      if (_.isPlainObject(item) && _.has(item, '_id')) {
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
    });
  }
  if (_.isPlainObject(values) && _.has(values, '_id')) {
    const cloneValues = _.omit(values as any, ['_id', '__v']);
    for (const subItem in cloneValues) {
      cloneValues[subItem] = transformResult(cloneValues[subItem]);
    }

    return {
      id: values['_id'],
      ...cloneValues,
    };
  }
  return values;
}

export function generateOrderId(): string {
  const id = `${dayjs().hour()}${dayjs().minute()}${dayjs().second()}${dayjs().millisecond()}`;
  return id;
}

export const generateId = (): string => {
  return uuidv4();
};

export function countFrequencyOfReviewStar<T>(
  arr: Array<T>,
  countValue: any,
  key: keyof T,
): number {
  return arr.filter((item) => item[key] === countValue).length;
}
