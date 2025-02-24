import React from 'react'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'

const Rating = ({ product , option }) => {

    return (
        <>
            {[1, 2, 3, 4, 5].map((star, index) => {
                return (
                    <span key={index}>
                        {product.rating >= star ?
                            <FaStar style={{ color: '#ffd700' }} /> :
                            product.rating > star - 1 ?
                                <FaStarHalfAlt style={{ color: '#ffd700' }} /> :
                                <FaRegStar style={{ color: '#ffd700' }} />}
                    </span>

                )
            })}
            {
            option ?
            <span
            className='rating-text'>
                {product.numReviews}     reviews
            </span> : ''
            }
        </>
    )
}

export default Rating