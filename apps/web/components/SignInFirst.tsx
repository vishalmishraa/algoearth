
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { signIn } from "next-auth/react"
import { Button } from "./ui/button"
import { LockIcon } from "lucide-react"

export default function SignInFirst() {
  return (
    <Card className="w-full max-w-md mx-auto mt-10 shadow-lg">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <LockIcon className="w-12 h-12 text-gray-400" />
        </div>
        <CardTitle className="text-3xl font-bold text-primary">Access Restricted</CardTitle>
        <CardDescription className="text-lg text-gray-600">
          To access the dashboard, please sign in using the button below.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-6">
        <Button
          onClick={() => signIn()}
          className="px-6 py-3 text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Sign In
        </Button>
      </CardContent>
    </Card>
  )
}