function JobList({ fetchAll = false }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
      const fetchJobs = async () => {
          try {
              const token = localStorage.getItem('token');
              const endpoint = fetchAll 
                  ? 'http://127.0.0.1:8000/api/jobs/all-jobs/'  // Fetch all jobs
                  : 'http://127.0.0.1:8000/api/jobs/open-jobs/'; // Fetch only open jobs

              const response = await axios.get(endpoint, {
                  headers: {
                      Authorization: `Token ${token}`
                  }
              });

              console.log("API Response:", response.data);
              setJobs(response.data);
              setLoading(false);
          } catch (error) {
              console.error("Error fetching jobs:", error);
              setError(true);
              setLoading(false);
          }
      };
      fetchJobs();
  }, [fetchAll]);

  if (loading) {
      return <p>Loading jobs...</p>;
  }

  return (
      <div className="job-list-container">
          <h2>{fetchAll ? "All Jobs" : "Available Jobs"}</h2>
          {error || jobs.length === 0 ? (
              <p>No jobs found.</p> 
          ) : (
              <ul>
                  {jobs.map((job) => (
                      <li key={job.id} className="job-item">
                          <Link to={`/jobs/${job.id}`} className="job-link">
                              <h3>{job.title}</h3>
                              <p><strong>Description:</strong> {job.description}</p>
                              <p><strong>Location:</strong> {job.location}</p>
                              <p><strong>Pay Rate:</strong> K{job.pay_rate}</p>
                              <p><strong>Status:</strong> {job.status}</p>
                          </Link>
                      </li>
                  ))}
              </ul>
          )}
      </div>
  );
}

export default JobList;
