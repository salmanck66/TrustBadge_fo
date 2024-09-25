document.addEventListener('DOMContentLoaded', () => {
    fetch('https://truestbadgebackend.vercel.app/api/get-selected-badges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeId: 'theh2o2' }),
    })
    .then(response => response.json())
    .then(data => {
      const badgeContainer = document.querySelector('.trust-badges');
      badgeContainer.innerHTML = data.selectedBadges.map(badge => 
        `<img src="${badge.imageUrl}" alt="Trust Badge" width="50" height="50" class="trust-badge-icon">`
      ).join('');
    })
    .catch(error => console.error('Error loading badges:', error));
  });
  