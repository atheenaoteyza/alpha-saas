import { getAuth } from "@clerk/nextjs/server";

export async function getServerSideProps(context) {
  const { userId } = getAuth(context.req);
  console.log("SSR User ID:", userId);
  return {
    props: {
      userId: userId || null,
    },
  };
}

export default function Page({ userId }) {
  return <div>User ID: {userId ?? "Not logged in"}</div>;
}
