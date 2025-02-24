import { Pagination } from "react-bootstrap";

import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

const Paginacion = ({ pages, page, ruta = '', keyword = '', isAdmin = false }) => {
    const navigate = useNavigate()
    const pageHandler = (num) => {
        if (isAdmin && ruta === 'order') {
            navigate(`/admin/orderslist/page/${num}`);
        }

        else if (isAdmin && ruta === 'products') {
            navigate(`/admin/products/page/${num}/${isAdmin}`);
        }

        else {
            navigate(keyword ?
                `/search/${keyword}/page/${num}`
                : `/page/${num}`
            );
        }
    }
    return (

        <Pagination className="my-2">
            {[...Array(pages)].map((_, i) => (
                <Pagination.Item onClick={() => pageHandler(i + 1)} key={i + 1} active={i + 1 === Number(page)} >{i+1} </Pagination.Item>
            ))}
        </Pagination>

    )
}

export default Paginacion
