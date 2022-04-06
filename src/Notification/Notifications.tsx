import React, {
  Fragment,
  FC,
  ReactNode,
  useState,
  useCallback,
  useMemo
} from 'react';
import { Notification } from './Notification';
import {
  NotificationOptions,
  NotificationsContext
} from './NotificationsContext';
import { AnimatePresence, motion } from 'framer-motion';
import css from './Notifications.module.css';

export interface NotificationsProps {
  limit?: number;
  timeout?: number;
  showClose?: boolean;
  preventFlooding?: boolean;
  children?: ReactNode;
}

// Hacky way to track unique versions of a notification
let nextId = 0;

export const Notifications: FC<NotificationsProps> = ({
  children,
  limit,
  timeout,
  showClose,
  preventFlooding
}) => {
  const [notifications, setNotifications] = useState<any[]>([]);

  const clearNotification = useCallback(
    (id: number) => setNotifications(notifications.filter(n => n.id !== id)),
    [notifications]
  );

  const clearAllNotifications = useCallback(() => setNotifications([]), []);

  const notify = useCallback(
    (title: string, options: NotificationOptions = {}) => {
      // If we are flooded with the same message over and over,
      // dont add more of the same type. Mainly used for error use cases.
      if (preventFlooding) {
        const has = notifications.find(n => n.title === title);

        if (has) {
          return false;
        }
      }

      const id = nextId++;

      const obj = {
        title,
        id,
        variant: 'default',
        timeout,
        showClose,
        ...options
      };

      const sorted = [obj, ...notifications];

      // Clear old notifications if we hit limit
      if (sorted.length >= limit) {
        sorted.pop();
      }

      // Update the container instance
      setNotifications(sorted);

      return id;
    },
    [limit, notifications, preventFlooding, showClose, timeout]
  );

  const notifyError = useCallback(
    (title: string, options: NotificationOptions = {}) =>
      notify(title, { ...options, variant: 'error' }),
    [notify]
  );

  const notifyWarning = useCallback(
    (title: string, options: NotificationOptions = {}) =>
      notify(title, { ...options, variant: 'warning' }),
    [notify]
  );

  const notifySuccess = useCallback(
    (title: string, options: NotificationOptions = {}) =>
      notify(title, { ...options, variant: 'success' }),
    [notify]
  );

  const values = useMemo(
    () => ({
      notify,
      notifyError,
      notifyWarning,
      notifySuccess,
      clearNotification,
      clearAllNotifications
    }),
    [
      clearNotification,
      clearAllNotifications,
      notify,
      notifyError,
      notifySuccess,
      notifyWarning
    ]
  );

  return (
    <Fragment>
      <NotificationsContext.Provider value={values}>
        {children}
      </NotificationsContext.Provider>
      <div className={css.container}>
        <div className={css.positions}>
          <AnimatePresence>
            {!!notifications.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {notifications.map(n => (
                  <Notification {...n} key={n.id} onClose={clearNotification} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Fragment>
  );
};

Notifications.defaultProps = {
  limit: 10,
  timeout: 4000,
  showClose: true,
  preventFlooding: true
};
