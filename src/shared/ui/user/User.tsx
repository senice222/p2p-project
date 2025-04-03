import styles from '../../../styles/User.module.scss'
import Link from '../../icons/Link';

interface UserProps {
  username: string;
  avatarUrl: string;
  href?: string;
}

const User = ({ username, avatarUrl, href = '#' }: UserProps) => {
  return (
    <a href={href} className={styles.user}>
      <div>
        <div className={styles.avatar}>
          <img src={avatarUrl} alt={username} />
        </div>
        <div className={styles.content}>
          <span className={styles.username}>{username}</span>
          <span className={styles.link}>lolz.live/mifka</span>
        </div>
      </div>
      <div className={styles.button}>
        <Link />
      </div>
    </a>
  )
}

export default User