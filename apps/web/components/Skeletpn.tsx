import React from 'react'

const Skeleton = ({ classname }: { classname: string }) => {
    return (
        <div className={`w-full py-2 `}>
            <div className="space-y-2 transition-colors duration-300">
                <div className={`bg-gray-700 rounded ${classname} animate-pulse `}></div>
            </div>
        </div>
    )
}

export default Skeleton
