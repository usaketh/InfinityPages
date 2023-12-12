// Import necessary React hooks and components
import { useState, useRef, useCallback } from 'react';
import usePosts from './hooks/usePosts'; // Custom hook for fetching posts
import Post from './Post'; // Component to display individual posts

// Functional component Example1
const Example1 = () => {
    // State variable to track the current page number
    const [pageNum, setPageNum] = useState(1);

    // Fetch posts using a custom hook (usePosts) and manage the state
    const { isLoading, isError, error, results, hasNextPage } = usePosts(pageNum);

    // Ref to track the IntersectionObserver
    const intObserver = useRef();

    // Callback function to observe the last post element for Infinite Scroll
    const lastPostRef = useCallback(post => {
        // If still loading, do nothing
        if (isLoading) return;

        // Disconnect the previous observer if it exists
        if (intObserver.current) intObserver.current.disconnect();

        // Create a new IntersectionObserver
        intObserver.current = new IntersectionObserver(posts => {
            if (posts[0].isIntersecting && hasNextPage) {
                // If the last post is visible and there's a next page, fetch more posts
                console.log('We are near the last post!');
                setPageNum(prev => prev + 1);
            }
        });

        // If the post element exists, observe it
        if (post) intObserver.current.observe(post);
    }, [isLoading, hasNextPage]);

    // Display an error message if an error occurs
    if (isError) return <p className='center'>Error: {error.message}</p>;

    // Map through the results and render Post components
    const content = results.map((post, i) => (
        // Attach a ref to the last post for Infinite Scroll
        results.length === i + 1 ? <Post ref={lastPostRef} key={post.id} post={post} /> : <Post key={post.id} post={post} />
    ));

    // Render the component with infinite scroll behavior
    return (
        <>
            <h1 id="top">&infin; Infinite Query &amp; Scroll<br />&infin; Ex. 1 - React only</h1>
            {content} {/* Render the posts */}
            {isLoading && <p className="center">Loading More Posts...</p>} {/* Display a loading message if more posts are being fetched */}
            <p className="center"><a href="#top">Back to Top</a></p> {/* Link to go back to the top of the page */}
        </>
    );
};

// Export the Example1 component as the default export from this module
export default Example1;
