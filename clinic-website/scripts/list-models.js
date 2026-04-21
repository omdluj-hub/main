import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_KEY = process.env.GOOGLE_API_KEY;

async function listModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    const response = await axios.get(url);
    const imagenModels = response.data.models.filter(m => m.name.toLowerCase().includes('imagen'));
    console.log('Imagen 관련 모델 목록:');
    console.log(JSON.stringify(imagenModels, null, 2));
  } catch (error) {
    console.error('모델 목록 조회 실패:', error.response?.data || error.message);
  }
}

listModels();
