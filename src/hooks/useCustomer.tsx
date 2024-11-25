
import { QueryObserver, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getCustomers } from '@/services/customer';
import { CustomerType } from '@/pages/master/customer/components/type'; 
const key = 'customer'

// export const useEditUser = () => {
//     const queryClient = useQueryClient();

//     return useMutation(editUser, {
//         onSuccess: (customer_updated: Customer) => {

//             queryClient.setQueryData([key],
//                 (prevUsers: Customer[] | undefined) => {
//                     if (prevUsers) {
//                         prevUsers.map(customer => {
//                             if (customer.id === customer_updated.id) {
//                                 customer.code = customer_updated.code
//                             }
//                             return customer
//                         })
//                     }
//                     return prevUsers
//                 }
//             )
//         }
//     })
// }

// export const useCreateUser = () => {
//     const queryClient = useQueryClient();

//     return useMutation(createUser, {
//         onSuccess: (user: Customer) => {

//             queryClient.setQueryData([key],
//                 (prevUsers: Customer[] | undefined) => prevUsers ? [user, ...prevUsers] : [user]
//             )
//         }
//     })
// }

// export const useDeleteUser = () => {

//     const queryClient = useQueryClient();

//     return useMutation(deleteUser, {
//         onSuccess: (id) => {
//             queryClient.setQueryData([key],
//                 (prevUsers: Customer[] | undefined) => prevUsers ? prevUsers.filter(user => user.id !== id) : prevUsers
//             )
//         }
//     });
// }

export const useGetUsers = () => {
    return useQuery({ queryKey: [key], queryFn: getCustomers })
     
}

export const useGetUsersObserver = () => {

    const get_users = useGetUsers()

    const queryClient = useQueryClient()

    const [users, setUsers] = useState<CustomerType[]>(() => {
        // get data from cache
        const data = queryClient.getQueryData<CustomerType[]>([key])
        return data ?? []
    })

    useEffect(() => {
        const observer = new QueryObserver<CustomerType[]>(queryClient, { queryKey: [key] })

        const unsubscribe = observer.subscribe(result => {
            if (result.data) setUsers(result.data)
        })

        return () => { unsubscribe() }
    }, [])

    return {
        ...get_users,
        data: users,
    }
}