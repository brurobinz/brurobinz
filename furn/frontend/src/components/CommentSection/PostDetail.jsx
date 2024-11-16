// components/PostDetail.js
import { useParams } from 'react-router-dom';
import CommentSection from './CommentSection';
import './CommentSection.css'

const PostDetail = ({ userId }) => {
  const { postId } = useParams();
  console.log(postId);
  return (
    <div>
      <h2>Post Detail</h2>
      {/* Nội dung chi tiết bài viết */}
      <CommentSection postId={postId} userId={userId} />
    </div>
  );
};

export default PostDetail;
