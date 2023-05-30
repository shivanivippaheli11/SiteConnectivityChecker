const axios = require('axios');

async function checkConnectivity(urls) {
  const results = [];

  const promises = urls.map(url => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          results.push(`${url} - Reachable`);
        } else {
          results.push(`${url} - Not Reachable`);
        }
        resolve();
      } catch (error) {
        results.push(`${url} - Not Reachable`);
        resolve();
      }
    });
  });

  await Promise.all(promises);

  return results;
}
function showNotification(message){
    if('Notification' in screen && Notification.permission==='granted'){
        new Notification('Connectivity Status',{body:message});

    }
}

module.exports = checkConnectivity;
