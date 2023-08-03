const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static').path;
const app = express();
const port = 8000;

ffmpeg.setFfmpegPath(ffmpegPath);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/videoInfo', async (req, res) => {
  const videoURL = req.query.url;
  try {
    const info = await ytdl.getInfo(videoURL);
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video info' });
  }
});

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;
    try {
      const info = await ytdl.getInfo(videoURL);
      const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
      const audioFormat = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });
  
      res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
      ytdl(videoURL, { format: audioFormat }).pipe(res);
    } catch (err) {
      res.status(500).send('Error occurred during download');
    }
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
