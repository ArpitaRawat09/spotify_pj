import "./ArtistDashboard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function ArtistDashboard() {
    const navigate = useNavigate();
  const [musicItems, setMusicItems] = useState([]);

  const [music, setMusic] = useState([
    {
      id: 1,
      title: "Midnight Pulse",
      artist: "The Echoes",
      coverImg:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      meta: "Single · Indie Pop",
      status: "Published",
      plays: "42.1K plays",
      duration: "3:12",
    },
    {
      id: 2,
      title: "Velvet Echo",
      artist: "The Echoes",
      coverImg:
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
      meta: "EP · Electronic",
      status: "Published",
      plays: "18.7K plays",
      duration: "4:05",
    },
    {
      id: 3,
      title: "City Lights Live",
      artist: "The Echoes",
      coverImg:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
      meta: "Live Session · Alt Rock",
      status: "Draft",
      plays: "—",
      duration: "5:48",
    },
  ]);

  const resolveCoverImage = (item) =>
    item?.coverImg || item?.coverImageUrl || item?.coverImage || "";

  const [playlists, setPlaylists] = useState([
    {
      title: "Late Night Drive",
      artist: "The Echoes",
      music: {
        title: "Midnight Pulse",
        artist: "The Echoes",
        coverImg:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
        musicUrl: "/music/midnight-pulse.mp3",
      },
    },
    {
      title: "Studio Moodboard",
      artist: "Synthwave Collective",
      music: {
        title: "Velvet Echo",
        artist: "Synthwave Collective",
        coverImg:
          "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
        musicUrl: "/music/velvet-echo.mp3",
      },
    },
    {
      title: "Fan Favorites",
      artist: "The Alt Rockers",
      music: {
        title: "City Lights Live",
        artist: "The Alt Rockers",
        coverImg:
          "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
        musicUrl: "/music/city-lights-live.mp3",
      },
    },
  ]);

  useEffect(() => {
    // Fetch music items from the backend API
    axios
      .get("http://localhost:3002/api/music/artist-musics", {
        withCredentials: true, // Include credentials for authentication
      })
      .then((res) => {
        setMusicItems(
          res.data.musics.map((music) => ({
            id: music._id,
            title: music.title,
            artist: music.artist,
            coverImg: music.coverImageUrl || music.coverImage,
            meta: `${music.type} · ${music.genre}`,
            status: music.status,
            plays: `${music.plays} plays`,
            duration: music.duration,
          })),
        );
      });

    // Fetch playlists from the backend API
    axios
      .get("http://localhost:3002/api/music/playlist/artist", {
        withCredentials: true, // Include credentials for authentication
      })
      .then((res) => {
        setPlaylists(
          res.data.playlists.map((playlist) => ({
            title: playlist.title,
            artist: playlist.artist,
            music: {
              title: playlist.musics[0].title,
              artist: playlist.musics[0].artist,
              coverImg:
                playlist.musics[0].coverImageUrl || playlist.musics[0].coverImage,
              musicUrl: playlist.musics[0].musicUrl,
            },
          })),
        );
      });
  }, []);

  const musicMap = Object.fromEntries(music.map((item) => [item.id, item]));

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
          <button className="artist-dashboard__action" type="button" onClick={() => navigate("/artist/dashboard/upload-music")}>
            Upload new track
          </button>
        </div>

        <div className="artist-dashboard__grid">
          {musicItems.map((item) => (
            <article className="artist-dashboard__card" key={item.id}>
              <div className="artist-dashboard__music-cover-wrap">
                {resolveCoverImage(item) ? (
                  <img
                    className="artist-dashboard__music-cover"
                    src={resolveCoverImage(item)}
                    alt={`${item.title} cover art`}
                  />
                ) : (
                  <div className="artist-dashboard__cover-fallback">
                    No cover
                  </div>
                )}
              </div>

              <div className="artist-dashboard__card-top">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.artist}</p>
                </div>
                {item.status && <span className="artist-dashboard__badge">{item.status}</span>}
              </div>

              {item.meta && <p className="artist-dashboard__card-subtext">{item.meta}</p>}

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
            <article
              className="artist-dashboard__playlist-card"
              key={playlist.title}
            >
              <div className="artist-dashboard__playlist-cover-wrap">
                {resolveCoverImage(playlist.music) ? (
                  <img
                    className="artist-dashboard__playlist-cover"
                    src={resolveCoverImage(playlist.music)}
                    alt={`${playlist.music.title} cover art`}
                  />
                ) : (
                  <div className="artist-dashboard__cover-fallback">
                    No cover
                  </div>
                )}
              </div>

              <div className="artist-dashboard__playlist-content">
                <div className="artist-dashboard__card-top">
                  <div>
                    <span className="artist-dashboard__playlist-label">Playlist collection</span>
                    <h3>{playlist.title}</h3>
                    <p>{playlist.artist}</p>
                  </div>
                </div>

                <div className="artist-dashboard__playlist-track-card">
                  <div>
                    <span className="artist-dashboard__playlist-kicker">Featured track</span>
                    <h4>{playlist.music.title}</h4>
                    <p>{playlist.music.artist}</p>
                  </div>

                  <div className="artist-dashboard__playlist-meta">
                    <span>{playlist.music.musicUrl ? "Playable" : "Unavailable"}</span>
                  </div>
                </div>
              </div>

              {playlist.music.musicUrl && (
                <a
                  className="artist-dashboard__playlist-link"
                  href={playlist.music.musicUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open music
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
