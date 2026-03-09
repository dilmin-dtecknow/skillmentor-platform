interface AlertMessageProps {
  type: "success" | "error";
  message: string;
}

const AlertMessage = ({ type, message }: AlertMessageProps) => {
  if (!message) return null;

  const styles =
    type === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${styles}`}
    >
      {message}
    </div>
  );
};

export default AlertMessage;
