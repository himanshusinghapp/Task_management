import { Activity } from '../models/activity.model';
import { logMessage } from './logger';
import { LOGGER_MESSAGES } from '../common/constants/logger.constant';

export const logActivity = async (
  userId: string,
  action: string,
  targetId: string,
  targetType: string,
  message: string,
  meta: object = {}
) => {
  try {
    await Activity.create({
      user: userId,
      action,
      targetId,
      targetType,
      message,
      meta,
    });

    logMessage('info', LOGGER_MESSAGES.AUDIT_LOG_CREATED, { userId, action, targetId });
  } catch (err: any) {
    logMessage('error', LOGGER_MESSAGES.AUDIT_LOG_FAILED, { error: err.message });
  }
};
