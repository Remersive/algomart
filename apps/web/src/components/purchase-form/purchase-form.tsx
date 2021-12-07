import { CreditCardIcon, LibraryIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import { Translate } from 'next-translate'
import useTranslation from 'next-translate/useTranslation'

import css from './purchase-form.module.css'

import Breadcrumbs from '@/components/breadcrumbs'
import Cards from '@/components/cards'
import CardForm from '@/components/purchase-form/cards/card-form'
import BankAccountForm from '@/components/purchase-form/wires/bank-account-form'
import { PaymentContextProps } from '@/contexts/payment-context'
import { Environment } from '@/environment'
import { isGreaterThanOrEqual } from '@/utils/format-currency'
import { MAX_BID_FOR_CARD_PAYMENT } from '@/utils/purchase-validation'
import { urls } from '@/utils/urls'

export default function PurchaseForm(paymentProps: PaymentContextProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { currentBid, method, release, setMethod, setStatus, status } =
    paymentProps

  if (!release) {
    router.push(urls.releases)
  }

  const doesRequireWirePayment =
    Environment.isWireEnabled &&
    ((currentBid &&
      isGreaterThanOrEqual(currentBid, MAX_BID_FOR_CARD_PAYMENT)) ||
      (release?.price &&
        isGreaterThanOrEqual(release.price, MAX_BID_FOR_CARD_PAYMENT)))

  const getCardList = (t: Translate) => [
    {
      handleClick: () => setMethod('card'),
      helpText: t('forms:fields.paymentMethods.options.card.helpText'),
      icon: <CreditCardIcon className={css.icon} />,
      method: 'card',
      title: t('forms:fields.paymentMethods.options.card.label'),
      isDisabled: !!doesRequireWirePayment,
    },
    {
      handleClick: () => setMethod('wire'),
      helpText: t('forms:fields.paymentMethods.options.wire.helpText'),
      icon: <LibraryIcon className={css.icon} />,
      method: 'wire',
      title: t('forms:fields.paymentMethods.options.wire.label'),
      isDisabled: !Environment.isWireEnabled,
    },
  ]

  const getPaymentNavItems = (t: Translate) => [
    {
      label: t('common:nav.payment.Payment Methods'),
      isActive: false,
      isDisabled: false,
      handleClick: () => {
        setStatus('form')
        setMethod(null)
      },
    },
    {
      label: t('common:nav.payment.Payment Information'),
      isActive: status === 'form',
      isDisabled: !method,
      handleClick: () => setStatus('form'),
    },
    {
      label: t('common:nav.payment.Summary'),
      isActive: status === 'summary',
      isDisabled: status !== 'summary',
      handleClick: () => setStatus('summary'),
    },
  ]

  return (
    <section className={css.root}>
      {/* Select method */}
      {method ? (
        <Breadcrumbs breadcrumbs={getPaymentNavItems(t)} />
      ) : (
        <Cards
          header={t('forms:fields.paymentMethods.helpText')}
          cards={getCardList(t)}
        />
      )}
      {/* Credit cards */}
      {method === 'card' && <CardForm {...paymentProps} />}
      {/* Wire payments */}
      {method === 'wire' && <BankAccountForm {...paymentProps} />}
    </section>
  )
}