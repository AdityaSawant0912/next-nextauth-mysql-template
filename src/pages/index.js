import { useSession } from "next-auth/react"
import { LoginButton, RegisterButton, LogoutButton } from "@/components/buttons.component";
export default function Home() {
  const { data: session, status } = useSession()
  console.log(status, session);

  const registerHandler = async () => {
    
    console.log('This will not register the John Doe. If you want to register John Doe, you need to uncomment the code in index.js of pages folder');
    
    // let result = await fetch("http://localhost:3000/api/user"
    //   , {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ firstName: 'John', lastName: 'Doe', email: 'johndoe@gmail.com', password: 'johndoe' }),
    //   })
    // console.log(await result.json());
  }

  return (
    <>
      Home
      <br />
      <button onClick={() => registerHandler()} >Register as John Doe</button>
      <br />
      <LoginButton />
      <br />
      {/* Create /register page to use this */}
      <RegisterButton /> 
      <br />
      <LogoutButton />
    </>
  )
}
