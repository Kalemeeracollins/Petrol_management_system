export default function Alerts() {
  const alerts = [
    { id: 1, message: "Low fuel in Pump 3", severity: "High" },
    { id: 2, message: "Customer complaint logged", severity: "Medium" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">System Alerts</h1>
      <ul className="space-y-3">
        {alerts.map((a) => (
          <li
            key={a.id}
            className={`p-4 rounded-xl shadow-md ${
              a.severity === "High" ? "bg-red-100" : "bg-yellow-100"
            }`}
            aria-live="assertive"
          >
            <strong>{a.message}</strong> — <em>{a.severity}</em>
          </li>
        ))}
      </ul>
    </div>
  )
}
