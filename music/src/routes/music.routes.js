import express from "express";
import multer from "multer";
import * as musicController from "../controllers/music.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

// api/music/upload
router.post(
  "/upload",
  authMiddleware.authArtistMiddleware,
  upload.fields([
    { name: "music", maxCount: 1 },
    { name: "musicFile", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
    { name: "coverImg", maxCount: 1 },
  ]),
  musicController.uploadMusic,
);

// api/music
router.get(
  "/",
  authMiddleware.authUserMiddleware,
  musicController.getAllMusics,
);

// api/music/get-details/:id
router.get(
  "/get-details/:id",
  authMiddleware.authUserMiddleware,
  musicController.getMusicById,
);

// api/music/artist-musics
router.get(
  "/artist-musics",
  authMiddleware.authArtistMiddleware,
  musicController.getArtistMusics,
);

// api/music/playlist
router.post(
  "/playlist",
  authMiddleware.authArtistMiddleware,
  musicController.createPlaylist,
);

router.get(
  "/playlist/artist",
  authMiddleware.authArtistMiddleware,
  musicController.getArtistPlaylists,
);

// api/music/playlist
router.get(
  "/playlist",
  authMiddleware.authUserMiddleware,
  musicController.getPlaylists,
);

// api/music/playlist/:id
router.get(
  "/playlist/:id",
  authMiddleware.authUserMiddleware,
  musicController.getPlaylistById,
);

export default router;
