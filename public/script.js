document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('connectivityForm');
    const urlInputsContainer = document.getElementById('urlInputs');
    const addUrlButton = document.getElementById('addUrlButton');
    const resultsContainer = document.getElementById('results');
    const chartCanvas = document.getElementById('chartCanvas');

    addUrlButton.addEventListener('click', () =>{ 
      const newUrlInput = document.createElement('input');
      newUrlInput.type = 'text';
      newUrlInput.className = 'urlInput';
      newUrlInput.name = 'urls[]';
      urlInputsContainer.append(newUrlInput);
    });
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formValues = new FormData(form);
      const urls = formValues.getAll('urls[]');
  
      resultsContainer.innerHTML = 'Checking Connectivity....';
  
      try {
        const response = await fetch('/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ urls }),
        });
  
        if (response.ok) {
          const {results} = await response.json();
          if(Array.isArray(results)){
          resultsContainer.innerHTML = results.join('<br>');
          updateChart(results);
          }else {
                throw new Error('Invalid response from server');
          }
        }else{
          throw new Error('Failed to check connectivity.');
        }
      } catch (error) {
        console.error(error);
        resultsContainer.innerHTML = 'An error occurred while checking connectivity.';
      }
    });
    function showNotification(message){
      if('Notification' in screen && Notification.permission==='granted'){
        new Notification('Connectivity Status',{body:message});

      }
    }
    function requestNotificationPermission(){
      if('Notification' in screen && Notification.permission==='granted'){
        Notification.requestPermission();
    }
  }
  requestNotificationPermission();
  function updateChart(results) {
    const labels = results.map((_, index) => `Timestamp ${index + 1}`);
    const data = results.map((result) => result === 'Reachable' ? 1 : 0);
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Connectivity Status',
          data: data,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.1,
        }],
      },
    });
  }
});

