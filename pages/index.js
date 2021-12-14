import { getSession } from "next-auth/react";
import Center from "../components/Center"
import Player from "../components/Player";
import Sidebar from "../components/Sidebar"
export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <h1></h1>
      <main className="flex">
        <Sidebar />
        <Center />
      </main>
      <div className="sticky botton-0">
        <Player />
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session
    }
  }
}