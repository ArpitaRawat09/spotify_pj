import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import './MusicDetail.css'

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00'
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')

  return `${minutes}:${remainingSeconds}`
}

export default function MusicDetail() {
  const { id } = useParams()
  const audioRef = useRef(null)
  const [music, setMusic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    let active = true

    setLoading(true)
    setError('')
    setMusic(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)

    axios
      .get(`http://localhost:3002/api/music/get-details/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (!active) {
          return
        }

        setMusic(res.data.music)
      })
      .catch((fetchError) => {
        if (!active) {
          return
        }

        const message =
          fetchError.response?.data?.message ?? 'Unable to load this track.'
        setError(message)
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [id])

  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    audioRef.current.volume = volume / 100
  }, [volume])

  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    audioRef.current.playbackRate = speed
  }, [speed])

  const coverStyle = useMemo(() => {
    if (!music?.coverImageUrl) {
      return undefined
    }

    return {
      backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.55)), url(${music.coverImageUrl})`,
    }
  }, [music?.coverImageUrl])

  const togglePlay = async () => {
    if (!audioRef.current) {
      return
    }

    if (isPlaying) {
      audioRef.current.pause()
      return
    }

    try {
      await audioRef.current.play()
      setIsPlaying(true)
    } catch (playError) {
      console.error('Unable to start playback:', playError)
    }
  }

  const handleSeek = (event) => {
    const nextTime = Number(event.target.value)
    setCurrentTime(nextTime)

    if (audioRef.current) {
      audioRef.current.currentTime = nextTime
    }
  }

  const handleVolume = (event) => {
    setVolume(Number(event.target.value))
  }

  const handleSpeed = (event) => {
    setSpeed(Number(event.target.value))
  }

  return (
    <section className="music-detail page">
      <audio
        ref={audioRef}
        src={music?.musicUrl}
        preload="metadata"
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration || 0)
          setCurrentTime(event.currentTarget.currentTime || 0)
          event.currentTarget.volume = volume / 100
          event.currentTarget.playbackRate = speed
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="music-detail__topbar">
        <Link to="/" className="music-detail__back-link">
          Back to library
        </Link>
        <span className="music-detail__eyebrow">Music player</span>
      </div>

      {loading ? (
        <div className="music-detail__state">Loading track details...</div>
      ) : error ? (
        <div className="music-detail__state music-detail__state--error">
          {error}
        </div>
      ) : music ? (
        <div className="music-detail__layout">
          <div className="music-detail__artwork-panel">
            <div className="music-detail__artwork" style={coverStyle}>
              {!music.coverImageUrl && (
                <div className="music-detail__artwork-fallback">No cover</div>
              )}
            </div>
          </div>

          <div className="music-detail__content">
            <div className="music-detail__header">
              <span className="music-detail__label">Now playing</span>
              <h1>{music.title}</h1>
              <p>
                {music.artist}
                {music.createdAt ? ` · Released ${new Date(music.createdAt).toLocaleDateString()}` : ''}
              </p>
            </div>

            <div className="music-detail__controls-card">
              <div className="music-detail__transport">
                <button
                  className="music-detail__play-button"
                  type="button"
                  onClick={togglePlay}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>

                <div className="music-detail__timer">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <label className="music-detail__range-group">
                <span>Seek</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={Math.min(currentTime, duration || 0)}
                  onChange={handleSeek}
                  disabled={!duration}
                />
              </label>

              <div className="music-detail__sliders">
                <label className="music-detail__range-group">
                  <span>Volume {volume}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={volume}
                    onChange={handleVolume}
                  />
                </label>

                <label className="music-detail__range-group">
                  <span>Speed {speed.toFixed(1)}x</span>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speed}
                    onChange={handleSpeed}
                  />
                </label>
              </div>
            </div>

            <div className="music-detail__meta-grid">
              <div className="music-detail__meta-card">
                <span>Track ID</span>
                <strong>{music._id}</strong>
              </div>
              <div className="music-detail__meta-card">
                <span>Playback</span>
                <strong>{isPlaying ? 'Playing' : 'Paused'}</strong>
              </div>
              <div className="music-detail__meta-card">
                <span>Volume</span>
                <strong>{volume}%</strong>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}