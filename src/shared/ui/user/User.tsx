import styles from '../../../styles/User.module.scss'
import Link from '../../icons/Link';

interface UserProps {
  user: {
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
  } | null;
  isPending?: boolean;
}

const User = ({ user, isPending }: UserProps) => {

  const username = user?.username;
  const avatarUrl = user?.links.avatar;
  const permalink = user?.links.permalink;

  return (
    !isPending && (
      <a href={permalink} target="_blank" rel="noopener noreferrer" className={styles.user}>
        <div>
          {
            avatarUrl && (
              <div className={styles.avatar}>
                <img src={avatarUrl} alt={username} />
              </div>
            )
          }
          <div className={styles.content}>
            <span className={styles.username}>
              {username || 'Не найдено'}
            </span>
            {username && <span className={styles.link}>lolz.live/{username}</span>}
          </div>
        </div>
        {username && <div className={styles.button}>
          <Link />
        </div>}
      </a>
    )
  )
}

export default User
