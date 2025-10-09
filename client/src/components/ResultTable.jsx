export default function ResultTable({ sequence }) {
  // Handle both possible data shapes
  const data = Array.isArray(sequence) ? sequence : sequence?.sequence || [];

  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">
        No boarding sequence available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto mt-6 max-w-3xl mx-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="py-3 px-6 text-left">Seq</th>
            <th className="py-3 px-6 text-left">Booking ID</th>
            <th className="py-3 px-6 text-left">Seats</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => {
            // Ensure seats is always an array for display
            const seatsArray = Array.isArray(item.seats)
              ? item.seats
              : item.seat
              ? [item.seat]
              : [];

            return (
              <tr key={item.booking_id + "-" + idx} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{item.seq}</td>
                <td className="py-3 px-6">{item.booking_id}</td>
                <td className="py-3 px-6">{seatsArray.join(", ")}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
