import { useMemo, useState } from 'react'
import './App.css'

const HOME = {
  address: '1102 – 520 Como Lake Avenue',
  city: 'Coquitlam, BC V3J 0E8',
  building: 'Crown at Burquitlam',
  purchasePrice: 695_000,
  mortgage: 475_000,
  monthlyPayment: 2_160,
  strata: 500,
  insurance: 1_004.28,
  firstPayment: new Date(2026, 1, 1),
  moveDate: 'January 29, 2026',
  image: 'https://static.youlive.ca/_static/building/5874/logo/logo-Q9Kk.jpg',
}

const COSTS = [
  { label: 'Deposit', value: 25_000, date: 'Dec 29, 2025' },
  { label: 'Down payment + notary', value: 209_597.47, date: 'Jan 26, 2026' },
  { label: 'Property Transfer Tax', value: 11_900, date: 'Jan 26, 2026' },
  { label: 'RBC fee', value: 300, date: 'Jan 29, 2026' },
  { label: 'Home inspection', value: 441, date: 'Dec 17, 2025' },
  { label: 'Annual insurance', value: 1_004.28, date: 'Jan 24, 2026' },
  { label: 'U-Haul move', value: 252, date: 'Jan 29, 2026*' },
]

const cad = new Intl.NumberFormat('en-CA', {
  style: 'currency', currency: 'CAD', maximumFractionDigits: 0,
})

const preciseCad = new Intl.NumberFormat('en-CA', {
  style: 'currency', currency: 'CAD', minimumFractionDigits: 2,
})

function monthsInclusive(from: Date, to: Date) {
  return Math.max(0, (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth() + 1)
}

function App() {
  const [termYears, setTermYears] = useState(30)
  const [monthlyPayment, setMonthlyPayment] = useState(HOME.monthlyPayment)
  const [showAllCosts, setShowAllCosts] = useState(false)

  const stats = useMemo(() => {
    const totalMonths = termYears * 12
    const paidMonths = Math.min(monthsInclusive(HOME.firstPayment, new Date()), totalMonths)
    const mortgagePaid = paidMonths * monthlyPayment
    const remainingMonths = Math.max(totalMonths - paidMonths, 0)
    const remainingScheduled = remainingMonths * monthlyPayment
    const purchaseCosts = COSTS.reduce((sum, cost) => sum + cost.value, 0)
    return {
      paidMonths,
      mortgagePaid,
      remainingMonths,
      remainingScheduled,
      purchaseCosts,
      totalPaid: purchaseCosts + mortgagePaid,
      progress: totalMonths ? (paidMonths / totalMonths) * 100 : 0,
    }
  }, [termYears, monthlyPayment])

  const equity = HOME.purchasePrice - HOME.mortgage
  const costs = showAllCosts ? COSTS : COSTS.slice(0, 4)

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">M</div>
        <div>
          <p className="eyebrow">OUR HOME · LIVE DASHBOARD</p>
          <h1>Mortgage Journey</h1>
        </div>
        <span className="status"><i /> Updated today</span>
      </header>

      <section className="home-hero card">
        <img src={HOME.image} alt="Crown condominium at 520 Como Lake Avenue" />
        <div className="hero-overlay" />
        <div className="home-copy">
          <span className="home-chip">HOME SINCE {HOME.moveDate.toUpperCase()}</span>
          <h2>{HOME.address}</h2>
          <p>{HOME.city}</p>
          <div className="facts">
            <span><b>2</b> bedrooms</span>
            <span><b>2</b> bathrooms</span>
            <span><b>895</b> sq ft</span>
            <span><b>2017</b> built</span>
          </div>
        </div>
        <a className="photo-credit" href="https://en.youlive.ca/coquitlam-building/5874-crown" target="_blank" rel="noreferrer">Photo: YouLive ↗</a>
      </section>

      <section className="summary-grid">
        <article className="card key-number paid">
          <p className="eyebrow">CONFIRMED CASH PAID</p>
          <strong>{cad.format(stats.totalPaid)}</strong>
          <span>Closing, move and {stats.paidMonths} mortgage payments</span>
        </article>
        <article className="card key-number remaining">
          <p className="eyebrow">SCHEDULED PAYMENTS LEFT</p>
          <strong>{cad.format(stats.remainingScheduled)}</strong>
          <span>{stats.remainingMonths} × {cad.format(monthlyPayment)} · estimate</span>
        </article>
        <article className="card key-number principal">
          <p className="eyebrow">ORIGINAL MORTGAGE</p>
          <strong>{cad.format(HOME.mortgage)}</strong>
          <span>RBC · exact balance requires a statement</span>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="card timeline-card">
          <div className="section-heading">
            <div><p className="eyebrow">THE JOURNEY</p><h2>What we have paid</h2></div>
            <span className="total-badge">{preciseCad.format(stats.purchaseCosts)}</span>
          </div>
          <div className="cost-list">
            {costs.map((cost) => (
              <div className="cost-row" key={cost.label}>
                <i />
                <div><strong>{cost.label}</strong><span>{cost.date}</span></div>
                <b>{preciseCad.format(cost.value)}</b>
              </div>
            ))}
          </div>
          <button className="text-button" type="button" onClick={() => setShowAllCosts(!showAllCosts)}>
            {showAllCosts ? 'Show less' : `Show all ${COSTS.length} costs`}
          </button>
        </article>

        <article className="card payoff-card">
          <div className="section-heading">
            <div><p className="eyebrow">PAYOFF TRACKER</p><h2>Mortgage timeline</h2></div>
            <span className="month-count">{stats.paidMonths} payments made</span>
          </div>

          <div className="price-split">
            <div><span>Purchase price</span><strong>{cad.format(HOME.purchasePrice)}</strong></div>
            <div><span>Cash equity</span><strong>{cad.format(equity)}</strong></div>
            <div><span>Financed</span><strong>{cad.format(HOME.mortgage)}</strong></div>
          </div>

          <div className="progress-block">
            <div><span>Schedule elapsed</span><strong>{stats.progress.toFixed(1)}%</strong></div>
            <div className="progress"><i style={{ width: `${stats.progress}%` }} /></div>
            <small>Started February 2026 · {termYears}-year planning assumption</small>
          </div>

          <div className="assumptions">
            <label>
              <span>Monthly payment</span>
              <div><b>$</b><input type="number" value={monthlyPayment} min="0" step="10" onChange={(e) => setMonthlyPayment(Number(e.target.value))} /></div>
            </label>
            <label>
              <span>Amortization assumption</span>
              <div><input type="number" value={termYears} min="1" max="40" onChange={(e) => setTermYears(Number(e.target.value))} /><b>years</b></div>
            </label>
          </div>

          <div className="notice"><b>Why this is an estimate</b><span>The RBC interest rate, exact amortization and current principal balance were not found in Google Sheets. Update the controls when you have the mortgage agreement.</span></div>
        </article>
      </section>

      <section className="card monthly-card">
        <div><p className="eyebrow">MONTHLY HOME COST</p><h2>{cad.format(monthlyPayment + HOME.strata + HOME.insurance / 12)}<span>/month</span></h2></div>
        <div className="monthly-item"><i className="blue" /><span>Mortgage</span><strong>{cad.format(monthlyPayment)}</strong></div>
        <div className="monthly-item"><i className="gold" /><span>Strata</span><strong>{cad.format(HOME.strata)}</strong></div>
        <div className="monthly-item"><i className="green" /><span>Insurance</span><strong>{cad.format(HOME.insurance / 12)}</strong></div>
      </section>

      <footer>Built from your Google Sheets records. *Move date is the best-supported inference from the U-Haul and RBC entries.</footer>
    </main>
  )
}

export default App
