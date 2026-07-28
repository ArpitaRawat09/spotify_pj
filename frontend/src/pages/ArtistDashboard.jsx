import './ArtistDashboard.css'

const musicItems = [
  {
    title: 'Midnight Pulse',
    meta: 'Single · Indie Pop',
    status: 'Published',
    plays: '128K plays',
    duration: '3:24',
  },
  {
    title: 'Velvet Echo',
    meta: 'EP · Electronic',
    status: 'Draft',
    plays: '15K plays',
    duration: '4:05',
  },
  {
    title: 'City Lights Live',
    meta: 'Live Session · Alt Rock',
    status: 'Published',
    plays: '92K plays',
    duration: '5:12',
  },
]

const playlists = [
  {
    name: 'Late Night Drive',
    description: 'High-energy tracks built for long rides and neon roads.',
    tracks: '24 tracks',
    reach: '18.2K saves',
  },
  {
    name: 'Studio Moodboard',
    description: 'A personal mix of references, demos, and inspiration.',
    tracks: '12 tracks',
    reach: '6.4K saves',
  },
  {
    name: 'Fan Favorites',
    description: 'Most played songs collected in one clean release hub.',
    tracks: '31 tracks',
    reach: '42.8K saves',
  },
]

export default function ArtistDashboard() {
  return (
    <div className="artist-dashboard page">
      <header className="artist-dashboard__hero">
        <div>
          <span className="artist-dashboard__eyebrow">Artist dashboard</span>
          <h1>Manage music and playlists in one place.</h1>
          <p>
            Track your latest releases, monitor fan engagement, and keep your
            playlists organized from a single responsive dashboard.
          </p>
        </div>

        <div className="artist-dashboard__stats">
          <div className="artist-dashboard__stat-card">
            <span>Monthly listeners</span>
            <strong>248.4K</strong>
          </div>
          <div className="artist-dashboard__stat-card">
            <span>Published songs</span>
            <strong>18</strong>
          </div>
          <div className="artist-dashboard__stat-card">
            <span>Active playlists</span>
            <strong>9</strong>
          </div>
        </div>
      </header>

      <section className="artist-dashboard__section">
        <div className="artist-dashboard__section-header">
          <div>
            <span className="artist-dashboard__section-label">Music</span>
            <h2>Latest tracks</h2>
          </div>
          <button className="artist-dashboard__action" type="button">
            Upload new track
          </button>
        </div>

        <div className="artist-dashboard__grid">
          {musicItems.map((item) => (
            <article className="artist-dashboard__card" key={item.title}>
              <div className="artist-dashboard__card-top">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.meta}</p>
                </div>
                <span className="artist-dashboard__badge">{item.status}</span>
              </div>

              <div className="artist-dashboard__card-meta">
                <span>{item.plays}</span>
                <span>{item.duration}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="artist-dashboard__section">
        <div className="artist-dashboard__section-header">
          <div>
            <span className="artist-dashboard__section-label">Playlists</span>
            <h2>Curated collections</h2>
          </div>
          <button className="artist-dashboard__action" type="button">
            Create playlist
          </button>
        </div>

        <div className="artist-dashboard__playlist-grid">
          {playlists.map((playlist) => (
            <article className="artist-dashboard__playlist-card" key={playlist.name}>
              <h3>{playlist.name}</h3>
              <p>{playlist.description}</p>
              <div className="artist-dashboard__playlist-meta">
                <span>{playlist.tracks}</span>
                <span>{playlist.reach}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
