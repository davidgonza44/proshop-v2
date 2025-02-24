import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const baseQuery = fetchBaseQuery({
    baseUrl: '',
})

const apiSlice = createApi(
    {
        baseQuery,
        tagTypes : ['Product', 'Order', 'User'] ,// usado para definir los tipos de datos que se van a obtener de la api
        endpoints : (builder) => ({}),
    }
)

export default apiSlice