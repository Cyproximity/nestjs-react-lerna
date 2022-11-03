import { userStore } from "../stores";

function Profile() {
  const { user } = userStore();
  return (
    <>
      <h1>User details</h1>
      <main>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </main>
    </>
  );
}
export default Profile;
