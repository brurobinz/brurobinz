// routes/Comment.js
import express from 'express';
import Comment from '../models/Comment.js';
import userModel from '../models/userModel.js';
const router = express.Router();

// GET: Lấy bình luận theo userId
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query; 
    // Lấy userId từ query
    const query = userId ? { userId } : {};
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const comments = await Comment.find(query)
      .populate('userId', 'name') // Lấy thuộc tính 'name' từ User
      .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo
    res.json(comments); // Trả về danh sách bình luận
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// POST: Thêm bình luận mới
router.post('/', async (req, res) => {
  try {
    const { userId, comment } = req.body;

    // Kiểm tra các tham số đầu vào
    if (!userId || !comment) {
      return res.status(400).json({ message: 'userId and comment are required' });
    }

    // Tạo đối tượng comment mới
    const newComment = new Comment({
      userId,
      comment,
    });

    // Lưu bình luận vào cơ sở dữ liệu
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error in POST /api/comments:', error);  // Log chi tiết lỗi
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

export default router;