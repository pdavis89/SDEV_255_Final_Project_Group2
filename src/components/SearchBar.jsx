export default function SearchBar({ value, onChange }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        className="form-control form-control-lg"
        placeholder="Search by course name or number..."
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Search courses"
      />
    </div>
  );
}
