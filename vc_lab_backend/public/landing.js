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
        fetchData('/contact-us-data', '#contact-us-table tbody', '#contact-us-no-data', startDate, endDate);
        fetchData('/training-data', '#training-program-table tbody', '#training-program-no-data', startDate, endDate);
        fetchData('/internship-data', '#internship-registration-table tbody', '#internship-registration-no-data', startDate, endDate);
        fetchData('/join-us-data', '#join-us-table tbody', '#join-us-no-data', startDate, endDate);
    }

    function fetchData(url, tableBodySelector, noDataSelector, startDate, endDate) {
        fetch(`${url}?start_date=${startDate}&end_date=${endDate}`)
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector(tableBodySelector);
                tableBody.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(row => {
                        tableBody.innerHTML += `
                            <tr>
                                <td>${row.name}</td>
                                <td>${row.email}</td>
                                <td>${row.phone_number || ''}</td>
                                <td>${row.college || row.program_of_interest || row.specialization || ''}</td>
                                <td>${row.resume || row.paymentdrivelink || row.resumedrivelink || ''}</td>
                                <td>${row.additional_info || row.comments || row.linkedinprofilelink || row.scopusprofilelink || ''}</td>
                                <td>${row.created_at}</td>
                            </tr>
                        `;
                    });
                    document.querySelector(noDataSelector).style.display = 'none';
                } else {
                    document.querySelector(noDataSelector).style.display = 'block';
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Initial fetch with no date filtering
    fetchEntries('', '');
});
