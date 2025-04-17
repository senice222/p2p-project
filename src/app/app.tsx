import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '../fonts.css'
import BackgroundLayout from '../layouts/background-layout'
import MainContentStep from '../widgets/steps/MainContentStep'
import { useEffect } from 'react'
// import { useInitData } from '@vkruglikov/react-telegram-web-app'

function App() {
  const queryClient = new QueryClient()

  useEffect(() => {
    if (window?.Telegram?.WebApp?.ready) {
      window.Telegram.WebApp.ready();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BackgroundLayout>
        <MainContentStep />
      </BackgroundLayout>
    </QueryClientProvider>
  )
}

export default App
