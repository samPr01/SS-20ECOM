import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'products-' + uniqueSuffix + '.csv');
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// CSV Upload endpoint
router.post('/upload-csv', upload.single('csvFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No CSV file uploaded'
    });
  }

  const results = [];
  const errors = [];
  let inserted = 0;
  let updated = 0;

  try {
    // Parse CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        // Validate required fields
        if (!data.Title || !data.Description || !data.Price || !data.ImageURL || !data.SKU) {
          errors.push({
            row: results.length + 1,
            error: 'Missing required fields (Title, Description, Price, ImageURL, SKU)',
            data: data
          });
          return;
        }

        // Validate price
        const price = parseFloat(data.Price);
        if (isNaN(price) || price < 0) {
          errors.push({
            row: results.length + 1,
            error: 'Invalid price',
            data: data
          });
          return;
        }

        results.push({
          title: data.Title.trim(),
          description: data.Description.trim(),
          price: price,
          image: data.ImageURL.trim(),
          sku: data.SKU.trim().toUpperCase(),
          category: data.Category ? data.Category.trim() : 'general',
          stock: data.Stock ? parseInt(data.Stock) || 0 : 0
        });
      })
      .on('end', async () => {
        try {
          // Process products in batches
          const batchSize = 50;
          for (let i = 0; i < results.length; i += batchSize) {
            const batch = results.slice(i, i + batchSize);
            
            for (const productData of batch) {
              try {
                // Use findOneAndUpdate with upsert for atomic operations
                const existingProduct = await Product.findOne({ sku: productData.sku });
                
                if (existingProduct) {
                  // Update existing product
                  await Product.findOneAndUpdate(
                    { sku: productData.sku },
                    productData,
                    { 
                      new: true, 
                      runValidators: true 
                    }
                  );
                  updated++;
                } else {
                  // Insert new product
                  await Product.create(productData);
                  inserted++;
                }
              } catch (error) {
                errors.push({
                  sku: productData.sku,
                  error: error.message,
                  data: productData
                });
              }
            }
          }

          // Clean up uploaded file
          fs.unlinkSync(req.file.path);

          res.json({
            success: true,
            message: 'CSV upload completed',
            summary: {
              inserted,
              updated,
              errors: errors.length,
              total: results.length
            },
            errors: errors.length > 0 ? errors : undefined
          });

        } catch (error) {
          // Clean up uploaded file on error
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }

          res.status(500).json({
            success: false,
            message: 'Error processing CSV file',
            error: error.message
          });
        }
      })
      .on('error', (error) => {
        // Clean up uploaded file on error
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
          success: false,
          message: 'Error reading CSV file',
          error: error.message
        });
      });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get upload statistics
router.get('/upload-stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const categories = await Product.distinct('category');

    res.json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        categories: categories.length,
        categoryList: categories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

export default router;
