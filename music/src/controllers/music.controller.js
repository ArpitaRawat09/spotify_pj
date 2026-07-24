import { uploadFile, getPresignedUrl } from "../service/storage.service.js";
import musicModel from "../models/music.model.js";
import playlistModel from "../models/playlist.model.js";

export async function uploadMusic(req, res) {
  const musicFile = req.files["music"][0];
  const coverImageFile = req.files["coverImage"][0];

  try {
    const musicKey = await uploadFile(musicFile);
    const coverImageKey = await uploadFile(coverImageFile);

    const music = {
      title: req.body.title,
      artist: req.user.fullName.firstName + " " + req.user.fullName.lastName,
      artistId: req.user.id,
      musicKey: musicKey,
      coverImageKey: coverImageKey,
    };
    return res
      .status(200)
      .json({ message: "Music uploaded successfully", music });
  } catch (error) {
    console.error("Error uploading files:", error);
    return res.status(500).json({ message: "Error uploading files" });
  }
}

export async function getAllMusics(req, res) {
  const { skip = 0, limit = 10 } = req.query;

  try {
    const musicDocs = await musicModel.find().skip(skip).limit(limit).lean();

    const musics = [];
    for (let music of musicDocs) {
      music.musicUrl = await getPresignedUrl(music.musicKey);
      music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
      musics.push(music);
    }

    return res
      .status(200)
      .json({ message: "All music fetched successfully", musics });
  } catch (error) {
    console.error("Error fetching all music:", error);
    return res.status(500).json({ message: "Error fetching all music" });
  }
}

export async function getMusicById(req, res) {
  const { id } = req.params;
  try {
    const musicDoc = await musicModel.findById(id).lean();
    if (!musicDoc) {
      return res.status(404).json({ message: "Music not found" });
    }
    musicDoc.musicUrl = await getPresignedUrl(musicDoc.musicKey);
    musicDoc.coverImageUrl = await getPresignedUrl(musicDoc.coverImageKey);
    return res
      .status(200)
      .json({ message: "Music fetched successfully", music: musicDoc });
  } catch (error) {
    console.error("Error fetching music:", error);
    return res.status(500).json({ message: "Error fetching music" });
  }
}

export async function getArtistMusics(req, res) {
  try {
    const musicDocs = await musicModel.find({ artistId: req.user.id }).lean();

    const musics = [];

    for (let music of musicDocs) {
      music.musicUrl = await getPresignedUrl(music.musicKey);
      music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
      musics.push(music);
    }

    return res
      .status(200)
      .json({ message: "Artist music fetched successfully", musics });
  } catch (error) {
    console.error("Error fetching artist music:", error);
    return res.status(500).json({ message: "Error fetching artist music" });
  }
}

export async function createPlaylist(req, res) {
  const { title, musics } = req.body;

  try {
    const playlist = await playlistModel.create({
      title: title,
      artist: req.user.fullName.firstName + " " + req.user.fullName.lastName,
      artistId: req.user.id,
      musics: musics,
    });

    return res
      .status(200)
      .json({ message: "Playlist created successfully", playlist });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return res.status(500).json({ message: "Error creating playlist" });
  }
}

export async function getPlaylists(req, res) {
  try {
    const playlists = await playlistModel.find({ artistId: req.user.id });
    return res
      .status(200)
      .json({ message: "Playlists fetched successfully", playlists });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return res.status(500).json({ message: "Error fetching playlists" });
  }
}

export async function getPlaylistById(req, res) {
  const { id } = req.params;
  try {
    const playlistDocs = await playlistModel.findById(id).lean();
    if (!playlistDocs) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    const musics = [];
    for (let musicId of playlistDocs.musics) {
      const music = await musicModel.findById(musicId).lean();
      if (music) {
        music.musicUrl = await getPresignedUrl(music.musicKey);
        music.coverImageUrl = await getPresignedUrl(music.coverImageKey);
        musics.push(music);
      }
    }
    playlistDocs.musics = musics;
    return res.status(200).json({
      message: "Playlist fetched successfully",
      playlist: playlistDocs,
    });
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return res.status(500).json({ message: "Error fetching playlist" });
  }
}
