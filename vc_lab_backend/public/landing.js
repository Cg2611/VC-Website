document.addEventListener('DOMContentLoaded', function() {
    const filterButton = document.getElementById('filter-button');

    filterButton.addEventListener('click', () => {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        if (startDate && endDate) {
            fetchEntries(startDate, endDate);
        } else {
            alert('Please select both start and end dates.');
        }
    });

    function fetchEntries(startDate, endDate) {
        fetchContactUsEntries(startDate, endDate);
        fetchTrainingEntries(startDate, endDate);
        fetchInternshipEntries(startDate, endDate);
        fetchJoinUsEntries(startDate, endDate);
        fetchDatasetRequestEntries(startDate, endDate);
    }

    function fetchDatasetRequestEntries(startDate, endDate) {
        fetch(`/dataset-request-data?start_date=${startDate}&end_date=${endDate}`)
            .then(response => {
                console.log('Fetching dataset request data:', response);
                return response.json();
            })
            .then(data => {
                console.log('Dataset request data received:', data);
                const tableBody = document.querySelector('#dataset-request-table tbody');
                tableBody.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(row => {
                        tableBody.innerHTML += `
                            <tr>
                                <td>${row.name || ''}</td>
                                <td>${row.email || ''}</td>
                                <td>${row.project || ''}</td>
                                <td>${row.description || ''}</td>
                                <td>${row.dataset || ''}</td>
                                <td>${row.created_at || ''}</td>
                            </tr>
                        `;
                    });
                    document.querySelector('#dataset-request-no-data').style.display = 'none';
                } else {
                    document.querySelector('#dataset-request-no-data').style.display = 'block';
                }
            })
            .catch(error => console.error('Error fetching dataset request data:', error));
    }

    function fetchContactUsEntries(startDate, endDate) {
        fetch(`/contact-us-data?start_date=${startDate}&end_date=${endDate}`)
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#contact-us-table tbody');
                tableBody.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(row => {
                        tableBody.innerHTML += `
                            <tr>
                                <td>${row.name || ''}</td>
                                <td>${row.email || ''}</td>
                                <td>${row.message || ''}</td>
                                <td>${row.created_at || ''}</td>
                            </tr>
                        `;
                    });
                    document.querySelector('#contact-us-no-data').style.display = 'none';
                } else {
                    document.querySelector('#contact-us-no-data').style.display = 'block';
                }
            })
            .catch(error => console.error('Error fetching contact us data:', error));
    }

    function fetchTrainingEntries(startDate, endDate) {
        fetch(`/training-data?start_date=${startDate}&end_date=${endDate}`)
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#training-program-table tbody');
                tableBody.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(row => {
                        tableBody.innerHTML += `
                            <tr>
                                <td>${row.name || ''}</td>
                                <td>${row.email || ''}</td>
                                <td>${row.phone_number || ''}</td>
                                <td>${row.program_of_interest || ''}</td>
                                <td><a href="${row.paymentdrivelink || '#'}" target="_blank">${row.paymentdrivelink ? 'Link' : ''}</a></td>
                                <td>${row.comments || ''}</td>
                                <td>${row.created_at || ''}</td>
                            </tr>
                        `;
                    });
                    document.querySelector('#training-program-no-data').style.display = 'none';
                } else {
                    document.querySelector('#training-program-no-data').style.display = 'block';
                }
            })
            .catch(error => console.error('Error fetching training data:', error));
    }

    function fetchInternshipEntries(startDate, endDate) {
        fetch(`/internship-data?start_date=${startDate}&end_date=${endDate}`)
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#internship-registration-table tbody');
                tableBody.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(row => {
                        tableBody.innerHTML += `
                            <tr>
                                <td>${row.name || ''}</td>
                                <td>${row.email || ''}</td>
                                <td>${row.phone_number || ''}</td>
                                <td>${row.college || ''}</td>
                                <td><a href="${row.resumedrivelink || '#'}" target="_blank">${row.resumedrivelink ? 'Link' : ''}</a></td>
                                <td>${row.additional_information || ''}</td>
                                <td>${row.created_at || ''}</td>
                            </tr>
                        `;
                    });
                    document.querySelector('#internship-registration-no-data').style.display = 'none';
                } else {
                    document.querySelector('#internship-registration-no-data').style.display = 'block';
                }
            })
            .catch(error => console.error('Error fetching internship data:', error));
    }

    function fetchJoinUsEntries(startDate, endDate) {
        fetch(`/join-us-data?start_date=${startDate}&end_date=${endDate}`)
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#join-us-table tbody');
                tableBody.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(row => {
                        tableBody.innerHTML += `
                            <tr>
                                <td>${row.name || ''}</td>
                                <td>${row.email || ''}</td>
                                <td>${row.phone_number || ''}</td>
                                <td>${row.specialization || ''}</td>
                                <td><a href="${row.resumedrivelink || '#'}" target="_blank">${row.resumedrivelink ? 'Link' : ''}</a></td>
                                <td><a href="${row.linkedinprofilelink || '#'}" target="_blank">${row.linkedinprofilelink ? 'Link' : ''}</a></td>
                                <td><a href="${row.scopusprofilelink || '#'}" target="_blank">${row.scopusprofilelink ? 'Link' : ''}</a></td>
                                <td>${row.created_at || ''}</td>
                            </tr>
                        `;
                    });
                    document.querySelector('#join-us-no-data').style.display = 'none';
                } else {
                    document.querySelector('#join-us-no-data').style.display = 'block';
                }
            })
            .catch(error => console.error('Error fetching join us data:', error));
    }

    // Initial fetch with no date filtering
    fetchEntries('', '');
});
