import React from 'react'

function page({data}:any) {
    console.log(data)
  return (
    <div>{data.map((repo:any) => (
        <div key={repo.id} className="mb-4 p-4 border rounded">
          <h2 className="text-lg font-semibold">{repo.fullName}</h2>
          <p className="text-sm text-gray-600">{repo.url}</p>
        </div>
      ))}</div>
  )
}

export default page