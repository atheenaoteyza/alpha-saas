import PartyPopper from "@/assets/PartyPopper";

export default function WorkDoneToast({ completedTime, setIsToast }) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-1">
      <div
        className="flex flex-col text-center justify-center align-center max-h-[90vh] w-[70vw] sm:w-[450px] overflow-y-auto
             p-4 hover:border border-gray-600 rounded-2xl 
             bg-[rgba(20,20,20,0.9)] hover:bg-[rgba(20,20,20,1)]"
      >
        <h1 className="flex justify-center font-bold text-xl text-center">
          <PartyPopper size="7rem" />
        </h1>
        <h2 className="text-center text-2xl text-green-500">
          Flow Focus Complete!
        </h2>
        <h2 className="text-white text-4xl font-mono mb-4 flex justify-center">
          {completedTime}
        </h2>
        <p>
          Great job staying focused! You just moved one step closer to your
          goal.
        </p>
        <button
          onClick={() => setIsToast(false)}
          className="bg-blue-500 p-3 m-1 cursor-pointer"
        >
          Continue focus flow
        </button>
      </div>
    </div>
  );
}
