import { useState } from 'react';
import { Link } from 'react-router-dom';

// Shared form for both creating and editing a course.
// - `initialValues` pre-fills the form (for edit). If omitted, starts empty.
// - `onSubmit` receives the cleaned-up form data as an object.
// - `submitLabel` lets the parent customize the button text.
// - `cancelTo` is a route path for the Cancel button.
export default function CourseForm({
  initialValues,
  onSubmit,
  submitLabel = 'Save',
  cancelTo = '/',
}) {
  const [form, setForm] = useState(
    initialValues ?? {
      name: '',
      courseNumber: '',
      subject: '',
      credits: 3,
      description: '',
      crn: '',
    }
  );
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Required-field validation
    if (!form.name.trim()) return setError('Course name is required.');
    if (!form.subject.trim()) return setError('Subject area is required.');
    if (!form.description.trim()) return setError('Description is required.');

    const credits = Number(form.credits);
    if (!Number.isFinite(credits) || credits < 1 || credits > 6) {
      return setError('Credits must be a whole number between 1 and 6.');
    }

    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        courseNumber: form.courseNumber.trim(),
        subject: form.subject.trim(),
        credits,
        description: form.description.trim(),
        crn: form.crn.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Course Name</label>
        <input
          id="name"
          name="name"
          type="text"
          className="form-control"
          value={form.name}
          onChange={handleChange}
          autoFocus
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="courseNumber" className="form-label">Course Number</label>
          <input
            id="courseNumber"
            name="courseNumber"
            type="text"
            className="form-control"
            placeholder="e.g. CS101"
            value={form.courseNumber}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="crn" className="form-label">
            CRN <span className="text-muted small">(optional)</span>
          </label>
          <input
            id="crn"
            name="crn"
            type="text"
            className="form-control"
            value={form.crn}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mb-3">
          <label htmlFor="subject" className="form-label">Subject Area</label>
          <input
            id="subject"
            name="subject"
            type="text"
            className="form-control"
            placeholder="e.g. Computer Science"
            value={form.subject}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="credits" className="form-label">Credits</label>
          <input
            id="credits"
            name="credits"
            type="number"
            min="1"
            max="6"
            step="1"
            className="form-control"
            value={form.credits}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          className="form-control"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
        <Link to={cancelTo} className="btn btn-outline-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
