const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.static("./public"));

const downloadTemplate = async (videoUrl, res) => {
  try {
    const info = await ytdl.getBasicInfo(videoUrl);
    const title = info.videoDetails.title.replace(/[\/\?<>\\:\*\|"]/g, '_');
    const outputFileName = `${title}.mp3`;

    const options = {
      highWaterMark: 5 * 1024 * 1024,
      quality: "highestaudio",
      filter: "audioonly",
    };

    // const response = {
    //   title,
    //   blob: ytdl(videoUrl, options),
    // }

    // res.setHeader("Content-Disposition", `attachment; filename="${outputFileName}"`);
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(outputFileName)}"`);
    res.setHeader("Content-Type", "audio/mpeg");
    

    ytdl(videoUrl, options).pipe(res);
    // ytdl(videoUrl, options);

    // res.json({ title });

    // stream.pipe(res);
    
    console.log("Download complete!");
    console.log("Video Title:", title);

  } catch (error) {
    console.error("Error:", error);
    // res.status(500).send("Internal Server Error");
  }
};

const downloadMusic = async (videoUrl, res) => {
  if (videoUrl.includes("playlist?list")) {
    console.log("This is a playlist");
    try {
      const playlistID = await ytpl.getPlaylistID(videoUrl);
      const playlist = await ytpl(playlistID);

      const downloadPromises = playlist.items.map(item => downloadTemplate(item.shortUrl, res));
      await Promise.all(downloadPromises);

      res.end();
    } catch (error) {
      console.error("Error:", error);
      // res.status(500).send("Internal Server Error");
    }
  } else {
    console.log("This is a single video");
    downloadTemplate(videoUrl, res);
  }
};


app.get("/musicInfo/query", (req, res) => {
  
  const requestDateTime = new Date().toISOString();
  console.log(`Request received at: ${requestDateTime}`);

  const clientIP = req.ip;
  console.log(`Client IP: ${clientIP}`);
  
  // const { title } = req.query;

  const { url } = req.query;
  downloadMusic(url, res);
});

app.all("*", (req, res) => {
  // res.status(404).send("404 Not Found");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});
