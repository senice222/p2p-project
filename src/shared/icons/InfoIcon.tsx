
export const InfoIcon = ({ onClick }: { onClick?: () => void }) => {
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        d="M11.2444 19.25C15.8007 19.25 19.4944 15.5563 19.4944 11C19.4944 6.44365 15.8007 2.75 11.2444 2.75C6.68804 2.75 2.99438 6.44365 2.99438 11C2.99438 15.5563 6.68804 19.25 11.2444 19.25Z"
        stroke="#7C7F84"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2444 14.6667V11"
        stroke="#7C7F84"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2444 7.33334H11.2536"
        stroke="#7C7F84"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

  )
}