import { uploadFile } from "../service/storage.service.js";
import musicModel from "../models/music.model.js";

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
    return res.status(200).json({ message: "Music uploaded successfully", music });
  } catch (error) {
    console.error("Error uploading files:", error);
    return res.status(500).json({ message: "Error uploading files" });
  }
}
