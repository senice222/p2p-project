import { Typography } from '../../shared/ui/Typography'
import styles from '../../styles/Amount.module.scss'
import Input from '../../shared/ui/input/Input'
import { useState } from 'react'
import { useStepStore } from '../steps/models/store'
import Button from '../../shared/ui/button/Button'
import Rub from '../../shared/icons/Rub'

const Amount = () => {
  const [value, setValue] = useState('')
  const { setStep } = useStepStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className={styles.searchContainer}>
      <Typography variant="h1" color="#fff" fontSize="26px" fontWeight="500">
        Сумма пополнения
      </Typography>
      <div style={{marginTop: "8px"}}>
        <Typography variant="h1" color="#7C7F84" fontSize="16px" fontWeight="450">
          Введите сумму пополнения
        </Typography>
      </div>
      <div className={styles.inputContainer}>
        <Input
          className={styles.input}
          value={value}
          onChange={handleChange}
          placeholder="100"
          iconComponent={<Rub />}
          typeOfIcon="rub"
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={() => setStep(2)}>Подтвердить</Button>
      </div>
    </div>
  )
}

export default Amount
