import { useEffect, useState } from 'react';
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
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sdev-255-final-project-group2.onrender.com';
  const initialProfessorId = initialValues?.professor?.id || initialValues?.professor?._id || initialValues?.professor || '';
  const [form, setForm] = useState(
    initialValues ? {
      ...initialValues,
      professor: initialProfessorId,
    } : {
      name: '',
      courseNumber: '',
      subject: '',
      credits: 3,
      description: '',
      crn: '',
      professor: '',
    }
  );
  const [professors, setProfessors] = useState([]);
  const [professorsLoading, setProfessorsLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadProfessors() {
      const token = localStorage.getItem('authToken');

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/professors`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load professors.');
        }

        if (!ignore) {
          const loadedProfessors = data.professors || [];
          setProfessors(loadedProfessors);

          if (loadedProfessors.length > 0) {
            setForm(prev => (
              prev.professor ? prev : { ...prev, professor: loadedProfessors[0].id }
            ));
          }
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
        }
      } finally {
        if (!ignore) {
          setProfessorsLoading(false);
        }
      }
    }

    loadProfessors();

    return () => {
      ignore = true;
    };
  }, [API_BASE_URL]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Required-field validation
    if (!form.name.trim()) return setError('Course name is required.');
    if (!form.courseNumber.trim()) return setError('Course number is required.');
    if (!form.subject.trim()) return setError('Subject area is required.');
    if (!form.description.trim()) return setError('Description is required.');
    if (!form.crn.trim()) return setError('CRN is required.');
    if (!form.professor) return setError('Professor is required.');

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
        professor: form.professor,
      });
    } catch (submitError) {
      setError(submitError.message || 'Unable to save course.');
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

      <div className="mb-3">
        <label htmlFor="professor" className="form-label">Professor</label>
        <select
          id="professor"
          name="professor"
          className="form-control"
          value={form.professor}
          onChange={handleChange}
          disabled={professorsLoading}
        >
          <option value="">
            {professorsLoading ? 'Loading professors...' : 'Select a professor'}
          </option>
          {professors.map(professor => (
            <option key={professor.id} value={professor.id}>
              {professor.name || professor.email}
            </option>
          ))}
        </select>
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
            CRN
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
