import React, { useState, useEffect, useContext } from 'react';
import forumService from '../../services/forumService';
import { useAuth } from '../../context/AuthContext';
import { FaReply, FaTrash, FaLock, FaUnlock, FaUserCircle } from 'react-icons/fa';

const Forum = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [replyContent, setReplyContent] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await forumService.getAllPosts();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        try {
            await forumService.createPost(newPostContent, user.id);
            setNewPostContent('');
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error.response?.data || error.message);
            alert('Failed to create post: ' + (error.response?.data?.message || 'Server error'));
        }
    };

    const handleCreateReply = async (parentPostId) => {
        const content = replyContent[parentPostId];
        if (!content || !content.trim()) return;

        try {
            await forumService.createPost(content, user.id, parentPostId);
            setReplyContent({ ...replyContent, [parentPostId]: '' });
            fetchPosts();
        } catch (error) {
            console.error('Error creating reply:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await forumService.deletePost(postId);
                fetchPosts();
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    const handleToggleLock = async (postId, currentLockStatus) => {
        try {
            await forumService.lockPost(postId, !currentLockStatus);
            fetchPosts();
        } catch (error) {
            console.error('Error toggling lock:', error);
        }
    };

    const getRoleLabel = (roleName) => {
        if (roleName === 'ROLE_INSTRUCTOR') {
            return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-2">✔ Instructor Reply</span>;
        }
        if (roleName === 'ROLE_ADMIN') {
            return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-2">Admin</span>;
        }
        return null;
    };

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN' || localStorage.getItem('userRole') === 'ADMIN';

    const PostItem = ({ post, isReply = false }) => (
        <div className={`mb-4 p-4 rounded-xl shadow-sm border ${isReply ? 'ml-8 bg-gray-50' : 'bg-white border-blue-50'}`}>
            <div className="flex items-start gap-3">
                <FaUserCircle className="text-gray-400 text-3xl mt-1" />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="font-bold text-gray-800">{post.authorName}</span>
                            {getRoleLabel(post.authorRole)}
                            <span className="text-xs text-gray-400 ml-3">
                                {new Date(post.createdAt).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {isAdmin && (
                                <>
                                    {!isReply && (
                                        <button
                                            onClick={() => handleToggleLock(post.id, post.locked)}
                                            className="text-gray-500 hover:text-blue-600 p-1"
                                            title={post.locked ? "Unlock" : "Lock"}
                                        >
                                            {post.locked ? <FaUnlock /> : <FaLock />}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="text-gray-500 hover:text-red-600 p-1"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <p className="mt-2 text-gray-700 whitespace-pre-wrap">{post.content}</p>

                    {!isReply && !post.locked && (
                        <div className="mt-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Write a reply..."
                                    className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={replyContent[post.id] || ''}
                                    onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })}
                                />
                                <button
                                    onClick={() => handleCreateReply(post.id)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    )}

                    {post.locked && !isReply && (
                        <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <FaLock /> This thread is locked.
                        </div>
                    )}

                    {post.replies && post.replies.length > 0 && (
                        <div className="mt-4">
                            {post.replies.map(reply => (
                                <PostItem key={reply.id} post={reply} isReply={true} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-extrabold text-blue-900 mb-8">Community Forum</h1>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-50 mb-8">
                <form onSubmit={handleCreatePost}>
                    <textarea
                        className="w-full border rounded-xl p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        placeholder="Write something to start a discussion..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transform active:scale-95 transition-all"
                        >
                            Post Discussion
                        </button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading discussions...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
                            <p className="text-gray-500">No discussions yet. Be the first to post!</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <PostItem key={post.id} post={post} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Forum;
