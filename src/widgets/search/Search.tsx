import { InfoIcon } from '../../shared/icons/InfoIcon'
import { Typography } from '../../shared/ui/Typography'
import styles from '../../styles/Search.module.scss'
import Input from '../../shared/ui/input/Input'
import { Skeleton } from '../../shared/ui/Skeleton/Skeleton'
import { useState, useEffect } from 'react'
import Button from '../../shared/ui/button/Button'
import { useModalSearchStore } from './model/store'
import User from '../../shared/ui/user/User'
import { useStepStore } from '../steps/models/store'
import { useSearchLztUser } from '../../shared/api/search'
import { useOrderStore } from '../../shared/store/orderStore'

interface LolzUser {
  username: string;
  username_html?: string;
  user_id: number;
  user_message_count: number;
  user_is_verified: boolean;
  user_is_banned?: number;
  links: {
    permalink: string;
    avatar: string;
  }
}

interface LolzApiResponse {
  users?: LolzUser[];
  system_info?: Record<string, unknown>;
  nickname?: string;
  id?: number;
}

const Search = () => {
  const [value, setValue] = useState('')
  const [debouncedValue, setDebouncedValue] = useState('')
  const [searchResult, setSearchResult] = useState<LolzUser | null>(null)
  const { setStep } = useStepStore()
  const { openModal } = useModalSearchStore()
  const { setUser } = useOrderStore()
  const { mutate: searchLztUser, isPending } = useSearchLztUser()
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    setIsTyping(true)
    const timer = setTimeout(() => {
      setDebouncedValue(value)
      setIsTyping(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [value])

  useEffect(() => {
    if (debouncedValue) {
      searchLztUser(
        { username: debouncedValue },
        {
          onSuccess: (data: LolzApiResponse) => {
            console.log(data)
            if (data.users && Array.isArray(data.users) && data.users.length > 0) {
              setSearchResult(data.users[0])
            } else if (data.nickname || data.id) {
              setSearchResult({
                username: data.nickname || '',
                user_id: data.id || 0,
                user_message_count: 0,
                user_is_verified: true,
                links: {
                  permalink: `https://lolz.live/${data.nickname}`,
                  avatar: `https://lolz.live/avatars/${data.id}`
                }
              })
            } else {
              setSearchResult(null)
            }
          },
          onError: () => {
            setSearchResult(null)
          }
        }
      )
    } else {
      setSearchResult(null)
    }
  }, [debouncedValue, searchLztUser])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleConfirm = () => {
    if (searchResult) {
      setUser(searchResult)
      setStep(1)
    }
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
          typeOfIcon="search"
        />
      </div>
      {value && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <p style={{ marginTop: "24px", marginBottom: "8px", color: "#FFFFFF", fontSize: "16px", fontWeight: 450, fontFamily: "Susse Int Book, sans-serif" }}>Это вы?</p>
          <div className={styles.skeletonContainer}>
            {(isPending || isTyping) ? (
              <Skeleton />
            ) : (
              <User isPending={isPending} user={searchResult ? searchResult : null} />
            )}
          </div>
          {searchResult && <Button onClick={handleConfirm}>Подтвердить</Button>}
        </div>
      )}
    </div>
  )
}

export default Search
