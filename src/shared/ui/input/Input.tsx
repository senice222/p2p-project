import React, { InputHTMLAttributes } from 'react';
import styles from '../../../styles/Input.module.scss';
import cn from 'classnames';
import Rub from '../../icons/Rub';
import { Search } from '../../icons/Search';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: boolean;
  typeOfIcon?: 'search' | 'rub';
}

const Input: React.FC<InputProps> = ({
  icon = true,
  className,
  typeOfIcon,
  onChange,
  ...props
}) => {
  const isRub = typeOfIcon === 'rub';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  return (
    <div className={styles.inputWrapper}>
      <input
        className={cn(
          styles.input,
          { [styles.withIcon]: icon },
          className
        )}
        onChange={handleChange}
        {...props}
      />
      <div className={`${isRub ? styles.rub : styles.iconContainer}`}>
        {
          isRub ? <Rub /> : <Search />
        }
      </div>
    </div>
  );
};

export default Input;
