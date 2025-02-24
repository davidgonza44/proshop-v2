import React from 'react'
import { useState } from 'react'
const RatingStars = ({ rating, setRating }) => {

    return (
        <div className='star-rating'>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}

                    className={star <= (rating || rating) ? 'on' : 'off pending'}
                    onMouseEnter={() => setRating(star)}
                    onClick={() => setRating(star)}

                >
                    <span className='h2'>★</span>
                </span>
            ))}
        </div>
    )
}

export default RatingStars