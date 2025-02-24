import { USERS_URL } from "../constants"
import apiSlice from "./apiSlice"

const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login : builder.mutation({
            query: (credentials) => ({
                url: `${USERS_URL}/auth`,
                method : 'POST',
                body : credentials
            })
        }),
        logout : builder.mutation({
            query: () => ({
                url : `${USERS_URL}/logout`,
                method : 'POST'
            })
        }),

        register : builder.mutation({
            query: (data) =>({
                url : `${USERS_URL}/register`,
                method : 'POST',
                body : data
            })
        }),
        profile : builder.mutation({
            query: (data) => ({
                url : `${USERS_URL}/profile`,
                method : 'PUT',
                body : data
            })
        }),
        getUsers : builder.query({
            query: () => ({
                url : `${USERS_URL}/admin/users`
            }),
            providesTags: ['User']
        }),
        deleteUser : builder.mutation({
            query: (id)=>({
                url : `${USERS_URL}/admin/user/${id}`,
                method : 'DELETE'
            }),
            invalidatesTags: ['User']
        }),
        editUser : builder.mutation({
            query: (userUpdated)=> ({
                url: `${USERS_URL}/admin/user/${userUpdated.id}`,
                method: 'PUT',
                body: userUpdated
            }),
            invalidatesTags: ['User']
        }),
        getUserDetails : builder.query({
            query : (id)=> ({
                url: `${USERS_URL}/admin/user/${id}`,
            }),
            providesTags: ['User']
        })
    })
})

export const {
useLoginMutation,
useLogoutMutation,
useRegisterMutation,
useProfileMutation,
useGetUsersQuery,
useDeleteUserMutation,
useEditUserMutation,
useGetUserDetailsQuery
} = usersApiSlice
export default usersApiSlice