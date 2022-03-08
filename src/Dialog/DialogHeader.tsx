import React, { FC } from 'react';
import classNames from 'classnames';
import css from './Dialog.module.css';

export interface DialogHeaderProps {
  children?: any;
  className?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export const DialogHeader: FC<Partial<DialogHeaderProps>> = ({
  children,
  className,
  showCloseButton,
  onClose,
}) => (
  <header className={classNames(css.header, className)}>
    <h1 className={css.headerText}>{children}</h1>
    {showCloseButton && (
      <button type="button" className={css.closeButton} onClick={onClose}>
        ✕
      </button>
    )}
  </header>
);
