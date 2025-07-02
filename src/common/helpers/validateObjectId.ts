import { Types } from 'mongoose';
import { Exceptions } from '../exception';
import { USER_MESSAGES } from '../constants';


export class ValidateObject{
   async validateObjectId(id: string, fieldName = 'ID') {
    if (!Types.ObjectId.isValid(id)) {
      throw Exceptions.BadRequest(`Invalid ${fieldName}`);
    }
  } 
    objectId = (value: string, helpers: any) => {
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid', { message: USER_MESSAGES.INVALID_OBJECT_ID });
    }
    return value;
  };
}

