import cron from 'node-cron';
import { User,Task } from '@models';
import { EmailUtil } from '@utils/email';

cron.schedule('0 * * * *', async () => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const tasks = await Task.find({
    dueDate: {
      $gte: new Date(tomorrow.setMinutes(0, 0, 0)),
      $lt: new Date(tomorrow.setHours(23, 59, 59, 999))
    }
  }).populate({ path: 'assignedTo', model: User });

  for (const task of tasks) {
    const user = task.assignedTo as unknown as typeof User;
    if ((user as any)?.email) {
      await EmailUtil.sendEmail({
        to: (user as any).email,
        subject: `Task Due Tomorrow: ${task.title}`,
        text: `Your task "${task.title}" is due on ${(task.dueDate ? task.dueDate.toDateString() : 'an unknown date')}. Please make sure it's completed on time.`,
      });
    }
  }
});
