import CenteredContainer from '../../layouts/centered-container'
import Search from '../search/Search'
import { useStepStore } from './models/store'
import Amount from '../amount/Amount'
import PaymentType from '../payment-type/PaymentType'
import ChooseBank from '../choose-bank/ChooseBank'
import Invoice from '../invoice/Invoice'
import Check from '../check/Check'
import Finish from '../Finish/Finish'
import { useEffect } from 'react'
import { socketManager } from '../../shared/providers/socket-provider'
import { useOrderStore } from '../../shared/store/orderStore'

const MainContentStep = () => {
  const { step, setStep } = useStepStore()
  const { orderData } = useOrderStore()

  useEffect(() => {
    if (orderData?.payment_id) {
      socketManager.getSocket();
    }

    if (!orderData) {
      setStep(0);
      return;
    }

    // if (orderData.status === PAYMENT_STATUSES.CREATED) {
    //   setStep(4); // Страница инвойса
    // } else if (orderData.status === PAYMENT_STATUSES.WAIT_DOCUMENT) {
    //   setStep(5); // Страница чека
    // } else if (orderData.status === PAYMENT_STATUSES.WAIT_CONFIRM) {
    //   setStep(6); // Страница финиша с ожиданием подтверждения
    // } else if (orderData.status >= PAYMENT_STATUSES.CONFIRMED) {
    //   setStep(6); // Страница финиша
    // }
  }, [orderData, setStep]);

  const steps = {
    0: <Search />,
    1: <Amount />,
    2: <PaymentType />,
    3: <ChooseBank />,
    4: <Invoice />,
    5: <Check />,
    6: <Finish />
  }
  const currentStep = steps[step as keyof typeof steps]

  return (
    <CenteredContainer>
      {currentStep}
    </CenteredContainer>
  )
}

export default MainContentStep
