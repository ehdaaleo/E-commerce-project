import express from 'express';
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js';
import { auth, authorize } from '../middleware/auth.middleware.js';
import Category from '../models/category.model.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategory);

router.post('/', auth, authorize(Category), createCategory);
router.put('/:id', auth, authorize(Category), updateCategory);
router.delete('/:id', auth, authorize(Category), deleteCategory);

export default router;
