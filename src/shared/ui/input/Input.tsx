import React, { InputHTMLAttributes } from 'react';
import styles from '../../../styles/Input.module.scss';
import cn from 'classnames';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: boolean;
  iconComponent?: React.ReactNode;
  typeOfIcon?: 'search' | 'rub';
}

const Input: React.FC<InputProps> = ({
  icon = true,
  className,
  iconComponent,
  typeOfIcon,
  ...props
}) => {
  const isRub = typeOfIcon === 'rub';
  return (
    <div className={styles.inputWrapper}>
      <input
        className={cn(
          styles.input,
          { [styles.withIcon]: icon },
          className
        )}
        {...props}
      />
      <div className={`${isRub ? styles.rub : styles.iconContainer}`}>
        {(icon && iconComponent) && iconComponent}
      </div>
    </div>
  );
};

export default Input;
