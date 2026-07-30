import "./Home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [musics, setMusics] = useState([
    {
      id: 1,
      title: "Midnight Pulse",
      artist: "The Echoes",
      coverImageUrl:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
      musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      id: 2,
      title: "Velvet Echo",
      artist: "Synthwave Collective",
      coverImageUrl:
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
      musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      id: 3,
      title: "City Lights Live",
      artist: "Alt Rockers",
      coverImageUrl:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
      musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
  ]);

  const [playlists, setPlaylists] = useState([
    {
      id: 1,
      title: "Late Night Drive",
      artist: "The Echoes",
      trackCount: 12,
      firstTrack: {
        musicUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
    },
    {
      id: 2,
      title: "Studio Moodboard",
      artist: "Synthwave Collective",
      trackCount: 8,
      firstTrack: {
        musicUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
    },
    {
      id: 3,
      title: "Fan Favorites",
      artist: "Alt Rockers",
      trackCount: 15,
      firstTrack: {
        musicUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
    },
  ]);

  useEffect(() => {
    // Fetch musics
    axios
      .get("http://localhost:3002/api/music", { withCredentials: true })
      .then((res) => {
        setMusics(
          res.data.musics.map((music) => ({
            id: music._id,
            title: music.title,
            artist: music.artist,
            coverImageUrl: music.coverImageUrl,
            musicUrl: music.musicUrl,
          })),
        );
      })
      .catch((err) => {
        console.error("Error fetching musics:", err);
      });

    // Fetch playlists
    axios
      .get("http://localhost:3002/api/music/playlist", {
        withCredentials: true,
      })
      .then((res) => {
        setPlaylists(
          res.data.playlists.map((playlist) => ({
            id: playlist._id,
            title: playlist.title,
            count: playlist.musics.length,
          })),
        );
      })
      .catch((err) => {
        console.error("Error fetching playlists:", err);
      });
  }, []);

  return (
    <section className="home page">
      <header className="home__hero">
        <div>
          <span className="home__eyebrow">Discover</span>
          <h1>Playlists and trending music</h1>
          <p>
            Explore the latest tracks and curated playlists available in your
            account.
          </p>
        </div>

        <div className="home__stats">
          <div className="home__stat-card">
            <span>Total tracks</span>
            <strong>{musics.length}</strong>
          </div>
          <div className="home__stat-card">
            <span>Total playlists</span>
            <strong>{playlists.length}</strong>
          </div>
        </div>
      </header>

      <section className="home__section">
        <div className="home__section-header">
          <h2>Musics</h2>
        </div>

        {musics.length === 0 ? (
          <p className="home__empty">No music available yet.</p>
        ) : (
          <div className="home__music-grid">
            {musics.map((music) => (
              <article
                className="home__music-card"
                key={music.id}
                onClick={() => navigate(`/music/${music.id}`)}
              >
                <div className="home__image-wrap">
                  {music.coverImageUrl ? (
                    <img
                      src={music.coverImageUrl}
                      alt={`${music.title} cover`}
                    />
                  ) : (
                    <div className="home__fallback-image">No cover</div>
                  )}
                </div>
                <h3>{music.title}</h3>
                <p>{music.artist}</p>
                {music.musicUrl && (
                  <audio controls preload="metadata" src={music.musicUrl}>
                    Your browser does not support the audio element.
                  </audio>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="home__section">
        <div className="home__section-header">
          <h2>Playlists</h2>
        </div>

        {playlists.length === 0 ? (
          <p className="home__empty">No playlists available yet.</p>
        ) : (
          <div className="home__playlist-grid">
            {playlists.map((playlist) => (
              <article className="home__playlist-card" key={playlist.id}>
                {/* <div className="home__image-wrap">
                  {playlist.firstTrack?.coverImageUrl ? (
                    <img
                      src={playlist.firstTrack.coverImageUrl}
                      alt={`${playlist.title} cover`}
                    />
                  ) : (
                    <div className="home__fallback-image">No cover</div>
                  )}
                </div> */}

                <h3>{playlist.title}</h3>
                <p>{playlist.artist}</p>
                <small>{playlist.trackCount} track(s)</small>

                {playlist.firstTrack?.musicUrl && (
                  <a
                    href={playlist.firstTrack.musicUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open first track
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
