import CenteredContainer from '../../layouts/centered-container'
import Search from '../search/Search'
import { useStepStore } from './models/store'
import Amount from '../amount/Amount'

const MainContentStep = () => {
  const { step } = useStepStore()

  const steps = {
    0: <Search />,
    1: <Amount />,
  }
  const currentStep = steps[step as keyof typeof steps]

  return (
    <CenteredContainer>
      {currentStep}
    </CenteredContainer>
  )
}

export default MainContentStep
