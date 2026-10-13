self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || 'Default Title';
  const options = {
    body: data.body || 'Default body text',
    icon: '/assets/notification-icon.jpeg', 
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
