import { useMemo, useState } from 'react'
import './App.css'

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const fields = [
  ['homePrice', 'Home price', '$', 50000, 3000000, 10000],
  ['downPayment', 'Down payment', '$', 0, 2500000, 5000],
  ['interestRate', 'Interest rate', '%', 0.1, 15, 0.05],
  ['loanTerm', 'Loan term', 'years', 5, 40, 5],
  ['propertyTax', 'Property tax', '% / year', 0, 5, 0.1],
  ['insurance', 'Home insurance', '$ / year', 0, 20000, 100],
]

function App() {
  const [values, setValues] = useState({
    homePrice: 650000,
    downPayment: 130000,
    interestRate: 6.25,
    loanTerm: 30,
    propertyTax: 1.1,
    insurance: 1800,
  })

  const result = useMemo(() => {
    const principal = Math.max(values.homePrice - values.downPayment, 0)
    const months = values.loanTerm * 12
    const rate = values.interestRate / 100 / 12
    const principalInterest = rate === 0
      ? principal / months
      : principal * (rate * (1 + rate) ** months) / ((1 + rate) ** months - 1)
    const taxes = values.homePrice * (values.propertyTax / 100) / 12
    const insurance = values.insurance / 12
    const total = principalInterest + taxes + insurance
    const totalInterest = principalInterest * months - principal
    return { principal, principalInterest, taxes, insurance, total, totalInterest }
  }, [values])

  const update = (key, value) => {
    setValues((current) => ({ ...current, [key]: Number(value) }))
  }

  const downPercent = values.homePrice
    ? Math.round((values.downPayment / values.homePrice) * 100)
    : 0
  const paymentPercent = result.total
    ? Math.round((result.principalInterest / result.total) * 100)
    : 0

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">M</div>
        <div>
          <p className="eyebrow">HOME FINANCE</p>
          <h1>Mortgage Dashboard</h1>
        </div>
        <span className="status"><i /> Live estimate</span>
      </header>

      <section className="dashboard-grid">
        <aside className="card controls-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR SCENARIO</p>
              <h2>Loan details</h2>
            </div>
            <button type="button" className="reset" onClick={() => setValues({
              homePrice: 650000, downPayment: 130000, interestRate: 6.25,
              loanTerm: 30, propertyTax: 1.1, insurance: 1800,
            })}>Reset</button>
          </div>

          <div className="form-grid">
            {fields.map(([key, label, suffix, min, max, step]) => (
              <label key={key}>
                <span>{label}</span>
                <div className="input-wrap">
                  {suffix === '$' && <b>$</b>}
                  <input
                    type="number"
                    value={values[key]}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(event) => update(key, event.target.value)}
                  />
                  {suffix !== '$' && <em>{suffix}</em>}
                </div>
              </label>
            ))}
          </div>

          <div className="down-payment">
            <div><span>Down payment ratio</span><strong>{downPercent}%</strong></div>
            <div className="progress"><i style={{ width: `${Math.min(downPercent, 100)}%` }} /></div>
          </div>
        </aside>

        <section className="results">
          <article className="card payment-card">
            <div>
              <p className="eyebrow">ESTIMATED PAYMENT</p>
              <div className="payment-value">{money.format(result.total)}<span>/mo</span></div>
              <p className="muted">Principal, interest, estimated tax and insurance</p>
            </div>
            <div className="donut" style={{ '--slice': `${paymentPercent * 3.6}deg` }}>
              <div><strong>{paymentPercent}%</strong><span>P&amp;I</span></div>
            </div>
          </article>

          <div className="metric-grid">
            <article className="card metric"><span>Loan amount</span><strong>{money.format(result.principal)}</strong><small>After down payment</small></article>
            <article className="card metric"><span>Total interest</span><strong>{money.format(result.totalInterest)}</strong><small>Over {values.loanTerm} years</small></article>
            <article className="card metric"><span>Paid at closing</span><strong>{money.format(values.downPayment)}</strong><small>{downPercent}% of home price</small></article>
          </div>

          <article className="card breakdown-card">
            <div className="section-heading">
              <div><p className="eyebrow">MONTHLY BREAKDOWN</p><h2>Where your payment goes</h2></div>
            </div>
            <div className="breakdown-row"><span><i className="blue" />Principal &amp; interest</span><strong>{money.format(result.principalInterest)}</strong></div>
            <div className="breakdown-row"><span><i className="gold" />Property tax</span><strong>{money.format(result.taxes)}</strong></div>
            <div className="breakdown-row"><span><i className="green" />Home insurance</span><strong>{money.format(result.insurance)}</strong></div>
            <div className="stacked-bar">
              <i className="blue" style={{ flex: result.principalInterest }} />
              <i className="gold" style={{ flex: result.taxes }} />
              <i className="green" style={{ flex: result.insurance }} />
            </div>
          </article>
        </section>
      </section>

      <footer>For planning purposes only. Actual loan terms and costs may vary.</footer>
    </main>
  )
}

export default App
