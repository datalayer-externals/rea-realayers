import React, { FC, ReactElement } from 'react';
import { TooltipProps, Tooltip } from '../Tooltip';
import FocusTrap from 'focus-trap-react';
import classNames from 'classnames';
import { useId } from 'rdk';
import css from './Popover.module.css';

export interface PopoverProps extends Partial<TooltipProps> {
  disablePadding?: boolean;
  popoverStyle?: any;
  popoverClassName?: string;
}

export const Popover: FC<PopoverProps> = ({
  closeOnEscape = true,
  closeOnBodyClick = true,
  trigger = 'click',
  leaveDelay = 200,
  children,
  content,
  className,
  disablePadding,
  popoverStyle,
  popoverClassName,
  ...rest
}) => {
  const id = useId();

  return (
    <Tooltip
      {...rest}
      trigger={trigger}
      pointerEvents="initial"
      leaveDelay={leaveDelay}
      className={classNames(css.popover, {
        [css.disablePadding]: disablePadding,
      })}
      content={() => {
        const isContentFunction = typeof content === 'function';
        const children = isContentFunction ? content() : content;
        if (!children) {
          return null;
        }

        return (
          <FocusTrap
            focusTrapOptions={{
              escapeDeactivates: true,
              clickOutsideDeactivates: true,
              fallbackFocus: `#${id}`,
            }}
          >
            <div
              id={id}
              tab-index="-1"
              stlye={popoverStyle}
              className={popoverClassName}
            >
              {children}
            </div>
          </FocusTrap>
        );
      }}
    >
      {children}
    </Tooltip>
  );
};
