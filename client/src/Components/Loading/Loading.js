import React from 'react'
import { Skeleton, Stack } from '@chakra-ui/react'

function Loading() {
    return (
        <Stack>
            <Skeleton height="45px" />
            <Skeleton height="45px" />
            <Skeleton height="45px" />
            <Skeleton height="45px" />
            <Skeleton height="45px" />
            <Skeleton height="45px" />
            <Skeleton height="45px" />
            <Skeleton height="45px" />
            <Skeleton height="45px" />
            <Skeleton height="45px" />
        </Stack>
    )
}

export default Loading