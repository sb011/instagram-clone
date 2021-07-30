import React from 'react';
import { useSelector } from 'react-redux';

const Carousel = ({ images, id }) => {
    const isActive = index => {
        if (index === 0)
            return "active";
    };

    const { theme } = useSelector(state => state);

    return (
        <div id={`image${id}`} className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {
                    images.map((img, index) => (
                        <button
                            key={index}
                            type="button"
                            data-bs-target={`#image${id}`}
                            data-bs-slide-to={index}
                            className={isActive(index)}
                        >
                        </button>
                    ))
                }
            </div>
            <div className="carousel-inner">
                {
                    images.map((img, index) => (
                        <div key={index} className={`carousel-item ${isActive(index)}`}>
                            {
                                img.url.match(/video/i)
                                    ? <video controls src={img.url} className="d-block w-100" alt={img.url} style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />
                                    : <img src={img.url} className="d-block w-100" alt={img.url} style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />
                            }
                        </div>
                    ))
                }
            </div>
            {
                images.length > 1 &&
                <>
                    <button className="carousel-control-prev" type="button" data-bs-target={`#image${id}`} data-bs-slide="prev" style={{ width: '5%' }}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target={`#image${id}`} data-bs-slide="next" style={{ width: '5%' }}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </>
            }
        </div>
    )
};

export default Carousel;