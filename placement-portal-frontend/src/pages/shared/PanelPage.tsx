import './PanelPage.css'

interface PanelPageProps {
  title: string
  description: string
  points?: string[]
}

const PanelPage = ({ title, description, points = [] }: PanelPageProps) => {
  return (
    <section className="panel-page">
      <div className="panel-header">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      {points.length > 0 && (
        <div className="panel-card">
          <h2>Planned Actions</h2>
          <ul>
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default PanelPage
