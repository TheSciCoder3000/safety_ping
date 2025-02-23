import { useState, useEffect } from "react";
import { getPostData } from "../api/firestore";
import "../assets/css/NewsFeed.css";

const NewsFeed = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postData = await getPostData();
                setPosts(postData);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>


            <div className="scrollable">
            <h1 className="news-t">News Report</h1>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div className="square" key={post.id}>
                        <h2 className="news-h">{post.title}</h2>
                        <p className="news-p">{post.timestamp?.toDate().toString()}</p>
                        <p className="news-p">{post.description}</p>
                        <p className="news-p">{post.report}</p>
                        <p className="news-p">{post.location?.lat},{post.location?.lat}</p>
                        <p className="news-p">{post.category}</p>
                    </div>
                ))
            ) : (
                <p>No posts available</p>
            )}
            </div>
        </div>
    );
}

export default NewsFeed;