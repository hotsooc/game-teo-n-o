const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/user_choices', async (req, res) => {
  try {
    const response = await axios.get(
      'https://raw.githubusercontent.com/hotsooc/discord---bot---data/main/user_choices.json',
      {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Lỗi proxy:', error.message);
    res.status(500).json({ error: 'Không thể lấy dữ liệu từ GitHub' });
  }
});

app.listen(3001, () => console.log('Proxy server đang chạy trên port 3001'));