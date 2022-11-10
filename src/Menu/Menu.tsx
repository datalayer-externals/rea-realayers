import React, { FC, forwardRef, Ref, useMemo } from 'react';
import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import { ConnectedOverlay, OverlayEvent, Placement, useId } from 'rdk';
import { Modifiers } from 'popper.js';
import { motion } from 'framer-motion';
import css from './Menu.module.css';

export interface MenuProps {
  /**
   * Whether to append the menu to the body or not.
   */
  appendToBody?: boolean;

  /**
   * Autofocus the menu on open or not.
   */
  autofocus?: boolean;

  /**
   * The menu contents.
   */
  children: any;

  /**
   * CSS class applied to menu element.
   */
  className?: string;

  /**
   * Close the menu on click or not.
   */
  closeOnBodyClick: boolean;

  /**
   * Close the menu on escape.
   */
  closeOnEscape: boolean;

  /**
   * Popper placement type.
   */
  placement: Placement;

  /**
   * Reference element for the menu position.
   */
  reference?: any;

  /**
   * CSS Properties for the menu.
   */
  style?: React.CSSProperties;

  /**
   * Whether to show the menu or not.
   */
  open: boolean;

  /**
   * Max height of the menu.
   */
  maxHeight: string;

  /**
   * Popper.js Position modifiers.
   */
  modifiers?: Modifiers;

  /**
   * Whether the menu should be the same width as the reference element
   */
  autoWidth?: boolean;

  /**
   * Min width of the menu.
   */
  minWidth?: number;

  /**
   * Max width of the menu.
   */
  maxWidth?: number;

  /**
   * Menu was closed.
   */
  onClose: (event: OverlayEvent) => void;

  /**
   * Mouse enter event.
   */
  onMouseEnter: (event) => void;

  /**
   * Mouse leave event.
   */
  onMouseLeave: (event) => void;
}

export const Menu: FC<Partial<MenuProps & { ref?: Ref<HTMLDivElement> }>> =
  forwardRef(
    (
      {
        reference,
        children,
        style,
        className,
        placement,
        closeOnEscape,
        open,
        appendToBody,
        closeOnBodyClick,
        maxHeight,
        autofocus,
        modifiers,
        autoWidth,
        minWidth,
        maxWidth,
        onClose,
        onMouseEnter,
        onMouseLeave
      },
      ref: Ref<HTMLDivElement>
    ) => {
      const id = useId();

      const internalModifiers = useMemo(() => {
        if (autoWidth) {
          const sameWidth = {
            enabled: true,
            order: 840,
            fn: data => {
              const { width, left, right } = data.offsets.reference;
              const passedOffset = modifiers?.offset?.offset;
              let passedXOffset = 0;
              let menuWidth = width;

              if (maxWidth && menuWidth > maxWidth) {
                menuWidth = maxWidth;
              } else if (minWidth && menuWidth < minWidth) {
                menuWidth = minWidth;
              }

              if (passedOffset) {
                if (typeof passedOffset === 'number') {
                  passedXOffset = passedOffset;
                } else {
                  const [skidding] = passedOffset.split(',');
                  passedXOffset = parseInt(skidding.trim(), 10);
                }
              }

              data.styles.width = menuWidth;
              data.offsets.popper.width = menuWidth;
              data.offsets.popper.left = left + passedXOffset;
              data.offsets.popper.right = right + passedXOffset;

              return data;
            }
          };

          return modifiers ? { ...modifiers, sameWidth } : { sameWidth };
        }

        return modifiers;
      }, [modifiers, autoWidth, minWidth, maxWidth]);

      return (
        <ConnectedOverlay
          open={open}
          closeOnBodyClick={closeOnBodyClick}
          appendToBody={appendToBody}
          reference={reference}
          placement={placement}
          modifiers={internalModifiers}
          closeOnEscape={closeOnEscape}
          content={() => (
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={classNames(css.container, className)}
              style={style}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              {autofocus && (
                <FocusTrap
                  focusTrapOptions={{
                    escapeDeactivates: true,
                    clickOutsideDeactivates: true,
                    fallbackFocus: `#${id}`
                  }}
                >
                  <div
                    id={id}
                    className={css.inner}
                    tabIndex={-1}
                    style={{ maxHeight }}
                  >
                    {children}
                  </div>
                </FocusTrap>
              )}
              {!autofocus && <div className={css.inner}>{children}</div>}
            </motion.div>
          )}
          onClose={onClose}
        />
      );
    }
  );

Menu.defaultProps = {
  placement: 'bottom-start',
  closeOnEscape: true,
  open: false,
  appendToBody: true,
  closeOnBodyClick: true,
  maxHeight: 'max-height: calc(100vh - 48px)',
  autofocus: true
};
