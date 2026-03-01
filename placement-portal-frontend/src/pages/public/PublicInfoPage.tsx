import './PublicInfoPage.css'

interface PublicInfoPageProps {
  title: string
  intro: string
  highlights: string[]
}

const PublicInfoPage = ({ title, intro, highlights }: PublicInfoPageProps) => {
  return (
    <div className="public-info-root">
      <div className="public-info-card">
        <h1>{title}</h1>
        <p>{intro}</p>
        <ul>
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PublicInfoPage
