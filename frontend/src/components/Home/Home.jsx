import Navbar from "../Navbar/Navbar";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <hr className="border-gray-400" />
      <div className="flex">
        <div className="bg-red-500 w-3/5">
          <h1>JOIN A MEETING ROOM</h1>
          <input type="text" />
        </div>
        <div className="bg-blue-500 w-2/5">
          <h1>CREATE A MEETING ROOM</h1>
          <button className="bg-white">Create</button>
        </div>
      </div>
    </div>
  );
}
