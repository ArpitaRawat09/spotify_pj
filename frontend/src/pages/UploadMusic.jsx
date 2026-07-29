import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UploadMusic.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UploadMusic() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    musicFile: null,
    coverImage: null,
  });
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
  const [musicPreviewUrl, setMusicPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!formData.coverImage) {
      setCoverPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(formData.coverImage);
    setCoverPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [formData.coverImage]);

  useEffect(() => {
    if (!formData.musicFile) {
      setMusicPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(formData.musicFile);
    setMusicPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [formData.musicFile]);

  function handleChange(event) {
    const { name, type, files, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "file" ? (files?.[0] ?? null) : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.musicFile || !formData.coverImage) {
      setError("Please select both a music file and a cover image.");
      return;
    }

    // Named `data`, NOT `formData` — avoids shadowing the component's
    // `formData` state, which was the original bug.
    const data = new FormData();
    data.append("title", formData.title);
    data.append("music", formData.musicFile);
    data.append("coverImage", formData.coverImage);

    setIsSubmitting(true);

    axios
      .post("http://localhost:3002/api/music/upload", data, {
        withCredentials: true,
      })
      .then((res) => {
        navigate("/artist/dashboard");
      })
      .catch((err) => {
        console.error(err);
        setError(
          err.response?.data?.message || "Upload failed. Please try again."
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <section className="upload-music page">
      <div className="upload-music__hero">
        <div className="upload-music__copy">
          <span className="upload-music__eyebrow">Artist upload</span>
          <h1>Upload a new track</h1>
          <p>
            Add a music file, a cover image, and a title to publish your next
            release from one clean, responsive form.
          </p>
        </div>

        <div className="upload-music__hint-card">
          <h2>Before you upload</h2>
          <ul>
            <li>Use high-quality audio for the best playback experience.</li>
            <li>Choose a square cover image for cleaner presentation.</li>
            <li>Keep your title short and searchable.</li>
          </ul>
        </div>
      </div>

      <form className="upload-music__form" onSubmit={handleSubmit}>
        {error && (
          <p className="upload-music__error" role="alert">
            {error}
          </p>
        )}

        <div className="upload-music__grid">
          <label className="upload-music__field upload-music__field--full">
            <span>Title</span>
            <input
              type="text"
              name="title"
              placeholder="Enter track title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label className="upload-music__field">
            <span>Music file</span>
            <input
              type="file"
              name="musicFile"
              accept="audio/*"
              onChange={handleChange}
              required
            />
            {formData.musicFile && (
              <small className="upload-music__file-name">
                Selected: {formData.musicFile.name}
              </small>
            )}
          </label>

          <label className="upload-music__field">
            <span>Cover image</span>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={handleChange}
              required
            />
            {formData.coverImage && (
              <small className="upload-music__file-name">
                Selected: {formData.coverImage.name}
              </small>
            )}
          </label>
        </div>

        {(coverPreviewUrl || musicPreviewUrl) && (
          <div className="upload-music__preview-grid">
            <article className="upload-music__preview-card">
              <h3>Cover preview</h3>
              {coverPreviewUrl ? (
                <img
                  className="upload-music__cover-preview"
                  src={coverPreviewUrl}
                  alt="Cover preview"
                />
              ) : (
                <p className="upload-music__preview-empty">
                  Choose an image to preview.
                </p>
              )}
            </article>

            <article className="upload-music__preview-card">
              <h3>Music preview</h3>
              {musicPreviewUrl ? (
                <audio
                  className="upload-music__audio-preview"
                  controls
                  preload="metadata"
                  src={musicPreviewUrl}
                >
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <p className="upload-music__preview-empty">
                  Choose an audio file to preview.
                </p>
              )}
            </article>
          </div>
        )}

        <div className="upload-music__actions">
          <Link className="upload-music__secondary" to="/artist/dashboard">
            Back to dashboard
          </Link>
          <button
            className="upload-music__primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Upload music"}
          </button>
        </div>
      </form>
    </section>
  );
}