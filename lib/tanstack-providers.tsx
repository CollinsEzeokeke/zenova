// app/providers.jsx
'use client'

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function TanstackProviders(props: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: (error) => {
                        console.error('Global Query Error:', { error })
                    },
                    

                }),
                mutationCache: new MutationCache({
                    onError: (error) => {
                        console.error('Global Mutation Error:', { error })
                    },
                    onSuccess(data, variables, context, mutation) {
                        console.log('Global Mutation Success:', { data, variables, context, mutation })
                        queryClient.invalidateQueries()
                        console.log('Global Mutation Success - Cache Invalidated')
                    },
                }),
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 1000 * 1000, // 5 seconds in milliseconds
                        refetchInterval: 30000, // Refetch every 30 seconds



                    },
                },
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            {props.children}
            <ReactQueryDevtools initialIsOpen={true} buttonPosition='bottom-right' position='right' />
        </QueryClientProvider>
    )
}
