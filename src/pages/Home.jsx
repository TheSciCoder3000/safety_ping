import BottomNav from '../components/BottomNav'
import PostContainer from '../components/PostContainer'
import NewsFeed from '../components/NewsFeed';
import "../assets/css/CreatePost.css";
const Home = () => {
    return (
        <div>
            <PostContainer />
            <div>
                <NewsFeed />
            </div>
            <div><BottomNav /></div>
        </div>
    )
}

export default Home
