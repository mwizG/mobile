// src/components/ServiceSearch.js
import React, { useState, useEffect } from 'react';
import { apiGet } from '../utils/Api';

function ServiceSearch() {
  const [caregivers, setCaregivers] = useState([]);
  const [searchParams, setSearchParams] = useState({
    location: '',
    serviceType: '',
  });

  useEffect(() => {
    const fetchCaregivers = async () => {
      const data = await apiGet('/caregivers/search/', searchParams);
      setCaregivers(data);
    };
    fetchCaregivers();
  }, [searchParams]);

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Trigger the useEffect to fetch caregivers
  };

  return (
    <div className="search-container">
      <h2>Search for Caregivers</h2>
      <form onSubmit={handleSearchSubmit}>
        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={searchParams.location}
            onChange={handleSearchChange}
          />
        </div>
        <div>
          <label>Service Type</label>
          <input
            type="text"
            name="serviceType"
            value={searchParams.serviceType}
            onChange={handleSearchChange}
          />
        </div>
        <button type="submit">Search</button>
      </form>

      <div className="caregiver-list">
        {caregivers.map((caregiver) => (
          <div key={caregiver.id} className="caregiver-item">
            <h3>{caregiver.name}</h3>
            <p>Location: {caregiver.location}</p>
            <p>Service: {caregiver.serviceType}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceSearch;
