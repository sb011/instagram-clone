import React from 'react';

const LoadMoreBtn = ({result, page, load, handleLoadMore}) => {
    return (
        <>
            {
                result < 9 * (page - 1)
                ? ' '
                : !load && <button className="btn btn-dark mx-auto d-block" onClick={handleLoadMore}>Load More</button>
            }   
            
        </>
    )
};

export default LoadMoreBtn;