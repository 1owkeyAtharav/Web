// Run: npm install express music-metadata
const express = require('express');
const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/songs', async (req, res) => {
    const songsDir = path.join(__dirname, 'public', 'songs');
    const files = fs.readdirSync(songsDir).filter(f => f.endsWith('.mp3'));

    const playlist = [];

    for (const file of files) {
        const filePath = path.join(songsDir, file);
        let metadata = { common: { title: '', artist: '' } };
        try {
            metadata = await mm.parseFile(filePath);
        } catch (err) {
            console.log(`Error reading metadata for ${file}:`, err.message);
        }

        const name = path.parse(file).name;

        playlist.push({
            title: metadata.common.title || name,
            artist: metadata.common.artist || "Unknown Artist",
            src: `songs/${file}`,
            cover: fs.existsSync(path.join(__dirname, 'public', 'images', `${name}.jpg`)) 
                ? `images/${name}.jpg`
                : 'https://via.placeholder.com/150'  // default cover
        });
    }

    res.json(playlist);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
