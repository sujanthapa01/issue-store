import FeedClient from "@/components/feedClient"

export default function FeedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Find Repositories to Contribute</h1>
      <FeedClient />
    </div>
  )
}
