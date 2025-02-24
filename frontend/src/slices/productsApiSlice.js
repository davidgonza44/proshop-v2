import { use } from "react";
import { PRODUCTS_URL, UPLOADS_URL } from "../constants";
import apiSlice from "./apiSlice";

const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ( {keyword, pageNumber}) => ({
                url: PRODUCTS_URL,
                params: {  keyword, pageNumber,    } // Agrega los parámetros de la solicitud
            }),
            keepUnusedDataFor: 5, // Mantiene los datos en caché durante 5 segundos
            providesTags: ['Product'], // Agrega una etiqueta para invalidar la caché
        }),
            getSingleProduct: builder.query({
                query: (id) => ({
                url : `${PRODUCTS_URL}/${id}`, // Endpoint para un producto específico
                providesTags: ['Product']
                })
            }),
            getTopProducts: builder.query({
                query: ()=> ({
                    url: `${PRODUCTS_URL}/top`
                }),
                providesTags: ['Product']
                }),

            createProduct: builder.mutation({
                query: (data) => ({
                    url: `${PRODUCTS_URL}`,
                    method: 'POST',
                    body: data
                }),
                invalidatesTags: ['Product'],
            }),
            deleteProduct: builder.mutation({
                query: (productId) => ({
                    url: `${PRODUCTS_URL}/${productId}`,
                    method: 'DELETE'
                })
            }),
            updateProduct: builder.mutation({
                query: (data) => ({
                    url: `${PRODUCTS_URL}/${data._id}`,
                    method: 'PUT',
                    body: data
                }),
                invalidatesTags: ['Product']
            }),

            uploadProductImage: builder.mutation({
                query: (data) => ({
                    url: `${UPLOADS_URL}`,
                    method: 'POST',
                    body: data
                })
            }),
            createProductReview: builder.mutation({
                query: (data) => ({
                    url: `${PRODUCTS_URL}/product/${data.productId}/reviews`,
                    method: 'POST',
                    body: data
                }),
                invalidatesTags: ['Product']
            }),


    })
})


export const {
    useGetProductsQuery,
    useGetSingleProductQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useCreateProductReviewMutation,
    useGetTopProductsQuery
} = productsApiSlice;
export default productsApiSlice;
