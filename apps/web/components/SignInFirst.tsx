
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "./ui/button"

export default function SignInFirst() {
  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">Access Restricted</CardTitle>
        <CardDescription>
          You need to be logged in to access the dashboard. Please click the button below to Sign in.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button
          onClick={() => signIn()}
          className="px-4 py-2"
        >
          Sign in
        </Button>
      </CardContent>
    </Card>
  )
}