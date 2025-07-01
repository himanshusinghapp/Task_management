import { validateObject } from './validateObjectId';

const validateObjectInstance = new validateObject();

export function validateObjectIdArray(ids: string[], fieldName = 'IDs') {
  ids.forEach(id => validateObjectInstance.validateObjectId(id, fieldName));
} 