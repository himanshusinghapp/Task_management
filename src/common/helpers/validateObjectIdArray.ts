import { ValidateObject } from './validateObjectId';

const validateObjectInstance = new ValidateObject();

export function validateObjectIdArray(ids: string[], fieldName = 'IDs') {
  ids.forEach(id => validateObjectInstance.validateObjectId(id, fieldName));
} 