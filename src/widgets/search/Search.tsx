import { InfoIcon } from '../../shared/icons/InfoIcon'
import { Typography } from '../../shared/ui/Typography'
import styles from '../../styles/Search.module.scss'
import Input from '../../shared/ui/input/Input'
import { Skeleton } from '../../shared/ui/Skeleton/Skeleton'
import { useState } from 'react'
import Button from '../../shared/ui/button/Button'
import { useModalSearchStore } from './model/store'
import User from '../../shared/ui/user/User'
import { useStepStore } from '../steps/models/store'

const Search = () => {
  const [value, setValue] = useState('')
  const { setStep } = useStepStore()
  const { openModal } = useModalSearchStore()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className={styles.searchContainer}>
      <Typography variant="h1" color="#fff" fontSize="26px" fontWeight="500">
        Добро пожаловать!
      </Typography>
      <div className={styles.infoContainer}>
        <Typography variant="h1" color="#7C7F84" fontSize="16px" fontWeight="400">
          Введите свой никнейм на форуме
        </Typography>
        <div style={{ cursor: 'pointer' }} onClick={() => openModal('paymentInstructions')}>
          <InfoIcon />
        </div>
      </div>
      <div className={styles.inputContainer}>
        <Input
          className={styles.input}
          value={value}
          onChange={handleChange}
          placeholder="Никнейм"
          iconComponent={<Search />}
          typeOfIcon="search"
        />
      </div>
      {value && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <div className={styles.skeletonContainer}>
            {/* <Skeleton /> */}
            <User username="John Doe" avatarUrl="https://via.placeholder.com/150" href="https://lolz.live/mifka" />
          </div>
          <Button onClick={() => setStep(1)}>Подтвердить</Button>
        </div>
      )}
    </div>
  )
}

export default Search
