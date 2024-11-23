import fs from 'fs'
import path from 'path'
import axios from 'axios'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

interface UnsplashImage {
  id: string
  urls: {
    regular: string
  }
  alt_description: string
}

const productCategories = [
  { name: 'Bandages and Dressings', query: 'medical bandage', count: 5 },
  { name: 'Surgical Supplies', query: 'surgical medical supplies', count: 5 },
  { name: 'Medical Instruments', query: 'medical instruments', count: 5 },
  { name: 'Diagnostic Equipment', query: 'medical diagnostic equipment', count: 5 },
  { name: 'Personal Protective Equipment', query: 'medical ppe', count: 5 },
  { name: 'Medications', query: 'medicine bottle', count: 5 },
  { name: 'Laboratory Supplies', query: 'laboratory medical', count: 5 },
  { name: 'Patient Care', query: 'patient care supplies', count: 5 }
]

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
console.log('Environment variables:', process.env)
console.log('UNSPLASH_ACCESS_KEY:', UNSPLASH_ACCESS_KEY)

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const IMAGES_DIR = path.join(PUBLIC_DIR, 'product-images')

async function downloadImage(url: string, filepath: string): Promise<void> {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath)
    response.data.pipe(writer)
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

async function fetchImages() {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error('Please set UNSPLASH_ACCESS_KEY environment variable')
    process.exit(1)
  }

  // Create directories if they don't exist
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR)
  }
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR)
  }

  // Create a mapping file for categories and their images
  const imageMapping: Record<string, string[]> = {}

  for (const category of productCategories) {
    console.log(`Fetching images for ${category.name}...`)
    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(category.query)}&per_page=${category.count}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    )

    const images: UnsplashImage[] = response.data.results
    imageMapping[category.name] = []

    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      const filename = `${category.name.toLowerCase().replace(/\s+/g, '-')}-${i + 1}.jpg`
      const filepath = path.join(IMAGES_DIR, filename)

      await downloadImage(image.urls.regular, filepath)
      imageMapping[category.name].push(`/product-images/${filename}`)
      
      // Wait a bit to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  // Save the mapping file
  fs.writeFileSync(
    path.join(IMAGES_DIR, 'image-mapping.json'),
    JSON.stringify(imageMapping, null, 2)
  )

  console.log('All images downloaded successfully!')
}

fetchImages().catch(console.error)
