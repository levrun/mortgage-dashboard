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
  moveDate: '29 января 2026',
  image: 'https://static.youlive.ca/_static/building/5874/logo/logo-Q9Kk.jpg',
}

const COSTS = [
  { label: 'Задаток', value: 25_000, date: '29 дек 2025' },
  { label: 'Первоначальный взнос + нотариус', value: 209_597.47, date: '26 янв 2026' },
  { label: 'Налог на передачу собственности', value: 11_900, date: '26 янв 2026' },
  { label: 'Комиссия RBC', value: 300, date: '29 янв 2026' },
  { label: 'Инспекция дома', value: 441, date: '17 дек 2025' },
  { label: 'Годовая страховка', value: 1_004.28, date: '24 янв 2026' },
  { label: 'Переезд (U-Haul)', value: 252, date: '29 янв 2026*' },
]

const cad = new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'CAD', maximumFractionDigits: 0,
})

const preciseCad = new Intl.NumberFormat('ru-RU', {
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
          <p className="eyebrow">НАШ ДОМ · ОНЛАЙН-ДАШБОРД · V3</p>
          <h1>Ипотечный путь</h1>
        </div>
        <span className="status"><i /> Обновлено сегодня</span>
      </header>

      <section className="home-hero card">
        <img src={HOME.image} alt="Кондоминиум Crown, 520 Como Lake Avenue" />
        <div className="hero-overlay" />
        <div className="home-copy">
          <span className="home-chip">ДОМ С {HOME.moveDate.toUpperCase()}</span>
          <h2>{HOME.address}</h2>
          <p>{HOME.city}</p>
          <div className="facts">
            <span><b>2</b> спальни</span>
            <span><b>2</b> санузла</span>
            <span><b>895</b> кв. футов</span>
            <span><b>2017</b> год постройки</span>
          </div>
        </div>
        <a className="photo-credit" href="https://en.youlive.ca/coquitlam-building/5874-crown" target="_blank" rel="noreferrer">Фото: YouLive ↗</a>
      </section>

      <section className="summary-grid">
        <article className="card key-number paid">
          <p className="eyebrow">ПОДТВЕРЖДЁННЫЕ ВЫПЛАТЫ</p>
          <strong>{cad.format(stats.totalPaid)}</strong>
          <span>Сделка, переезд и ипотечные платежи ({stats.paidMonths})</span>
        </article>
        <article className="card key-number remaining">
          <p className="eyebrow">ОСТАЛОСЬ ПО ГРАФИКУ</p>
          <strong>{cad.format(stats.remainingScheduled)}</strong>
          <span>{stats.remainingMonths} × {cad.format(monthlyPayment)} · оценка</span>
        </article>
        <article className="card key-number principal">
          <p className="eyebrow">ИСХОДНАЯ ИПОТЕКА</p>
          <strong>{cad.format(HOME.mortgage)}</strong>
          <span>RBC · точный остаток — по выписке из банка</span>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="card timeline-card">
          <div className="section-heading">
            <div><p className="eyebrow">ИСТОРИЯ</p><h2>Что мы уже заплатили</h2></div>
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
            {showAllCosts ? 'Свернуть' : `Показать все расходы (${COSTS.length})`}
          </button>
        </article>

        <article className="card payoff-card">
          <div className="section-heading">
            <div><p className="eyebrow">ТРЕКЕР ПОГАШЕНИЯ</p><h2>График ипотеки</h2></div>
            <span className="month-count">внесено платежей: {stats.paidMonths}</span>
          </div>

          <div className="price-split">
            <div><span>Цена покупки</span><strong>{cad.format(HOME.purchasePrice)}</strong></div>
            <div><span>Собственные средства</span><strong>{cad.format(equity)}</strong></div>
            <div><span>В кредит</span><strong>{cad.format(HOME.mortgage)}</strong></div>
          </div>

          <div className="progress-block">
            <div><span>Пройдено по графику</span><strong>{stats.progress.toFixed(1)}%</strong></div>
            <div className="progress"><i style={{ width: `${stats.progress}%` }} /></div>
            <small>Старт: февраль 2026 · расчёт на {termYears} лет</small>
          </div>

          <div className="assumptions">
            <label>
              <span>Ежемесячный платёж</span>
              <div><b>$</b><input type="number" value={monthlyPayment} min="0" step="10" onChange={(e) => setMonthlyPayment(Number(e.target.value))} /></div>
            </label>
            <label>
              <span>Срок амортизации</span>
              <div><input type="number" value={termYears} min="1" max="40" onChange={(e) => setTermYears(Number(e.target.value))} /><b>лет</b></div>
            </label>
          </div>

          <div className="notice"><b>Почему это оценка</b><span>Ставка RBC, точная амортизация и текущий остаток долга не найдены в Google Sheets. Обновите поля, когда на руках будет ипотечный договор.</span></div>
        </article>
      </section>

      <section className="card monthly-card">
        <div><p className="eyebrow">ЕЖЕМЕСЯЧНЫЕ РАСХОДЫ НА ДОМ</p><h2>{cad.format(monthlyPayment + HOME.strata + HOME.insurance / 12)}<span>/мес</span></h2></div>
        <div className="monthly-item"><i className="blue" /><span>Ипотека</span><strong>{cad.format(monthlyPayment)}</strong></div>
        <div className="monthly-item"><i className="gold" /><span>Страта-взнос</span><strong>{cad.format(HOME.strata)}</strong></div>
        <div className="monthly-item"><i className="green" /><span>Страховка</span><strong>{cad.format(HOME.insurance / 12)}</strong></div>
      </section>

      <footer>Собрано из записей в Google Sheets. *Дата переезда — наиболее вероятная оценка по записям U-Haul и RBC.</footer>
    </main>
  )
}

export default App
