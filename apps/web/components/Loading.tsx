
const PageLoading = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-20">
        <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground mt-4">Please wait while we load the content.</p>
      </div>
    )
  }

export const ButtonLoading = () => {
    return (
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

export const SmallPageLoading = () =>{
    return (
      <div className="flex flex-col items-center justify-center h-full mt-20">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )

}

export default PageLoading;