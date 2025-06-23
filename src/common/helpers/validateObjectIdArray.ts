import { validateObjectId } from './validateObjectId';

export function validateObjectIdArray(ids: string[], fieldName = 'IDs') {
  ids.forEach(id => validateObjectId(id, fieldName));
} 