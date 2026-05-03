// filters the course list by search text
export default function SearchBar({ value, onChange }) {
  return (
    <div className="mb-4">
      <input
        type="search"
        className="form-control course-search"
        placeholder="Search courses by name or number..."
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Search courses"
      />
    </div>
  );
}
