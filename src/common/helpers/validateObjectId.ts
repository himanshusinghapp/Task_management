import { Types } from 'mongoose';
import { Exceptions } from '../exception/customException';

export function validateObjectId(id: string, fieldName = 'ID') {
  if (!Types.ObjectId.isValid(id)) {
    throw Exceptions.BadRequest(`Invalid ${fieldName}`);
  }
} 