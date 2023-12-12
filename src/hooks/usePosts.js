// Import necessary hooks and functions from React and the API module
import { useState, useEffect } from 'react';
import { getPostsPage } from '../api/axios';

// Define the custom React hook 'usePosts' for fetching paginated posts
const usePosts = (pageNum = 1) => {
    // State variables for managing the fetched data, loading, errors, and pagination
    const [results, setResults] = useState([]); // Array to store fetched posts
    const [isLoading, setIsLoading] = useState(false); // Flag to track data loading status
    const [isError, setIsError] = useState(false); // Flag to indicate if an error occurred
    const [error, setError] = useState({}); // Object to store details about the error
    const [hasNextPage, setHasNextPage] = useState(false); // Flag indicating the presence of a next page

    // UseEffect hook to handle side effects, such as data fetching
    useEffect(() => {
        // Set loading and error states to default values before making the API request
        setIsLoading(true);
        setIsError(false);
        setError({});

        // Create an AbortController to allow aborting the API request if needed
        const controller = new AbortController();
        const { signal } = controller;

        // Call the getPostsPage function with the current pageNum and the abort signal
        getPostsPage(pageNum, { signal })
            .then(data => {
                // If the request is successful, update the state variables
                setResults(prev => [...prev, ...data]); // Append new data to existing results
                setHasNextPage(Boolean(data.length)); // Determine if there is a next page
                setIsLoading(false); // Set loading to false as data fetching is complete
            })
            .catch(e => {
                // If an error occurs, update the error state
                setIsLoading(false); // Set loading to false as data fetching is complete
                // Check if the error is due to an aborted request before updating the state
                if (signal.aborted) return;
                setIsError(true);
                setError({ message: e.message });
            });

        // Cleanup function: Abort the API request if the component unmounts or pageNum changes
        return () => controller.abort();
    }, [pageNum]);

    // Return an object containing information about the state of data fetching
    return { isLoading, isError, error, results, hasNextPage };
};

// Export the usePosts hook as the default export from this module
export default usePosts;
