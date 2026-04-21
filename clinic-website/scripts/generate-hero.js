import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { GOOGLE_API_KEY } = process.env;

async function generateImage() {
  // 줄자 대신 한약 파우치를 든 한국인 다이어트 성공 모델 프롬프트
  const prompt = "A high-quality, photorealistic image of a beautiful joyful young Korean woman with a slim and toned figure, standing in a modern bright emerald-toned diet clinic. She is holding a small herbal medicine pouch (oriental medicine diet drink pouch) and smiling warmly. The image emphasizes her successful weight loss and healthy body. Soft natural sunlight, K-beauty style, 8k resolution, cinematic lighting, professional commercial photography, realistic skin texture, realistic body proportions";
  
  console.log('Google Imagen 4 API를 통해 한약 파우치를 든 한국인 다이어트 모델 생성 중...');

  // 최신 Imagen 4 모델 엔드포인트
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.post(
      url,
      {
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "4:3",
          outputMimeType: "image/png"
        }
      }
    );

    if (response.data.predictions && response.data.predictions[0]) {
        const base64Image = response.data.predictions[0].bytesBase64Encoded;
        const buffer = Buffer.from(base64Image, 'base64');
        
        const outputDir = path.join(__dirname, '../public/images');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
        
        const outputPath = path.join(outputDir, 'hero-gen.png');
        fs.writeFileSync(outputPath, buffer);
        
        console.log(`\n성공! Imagen 4로 이미지가 생성되었습니다: ${outputPath}`);
    } else {
        console.error('API 응답에 이미지가 없습니다:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('이미지 생성 실패:', error.response?.data || error.message);
  }
}

generateImage();
