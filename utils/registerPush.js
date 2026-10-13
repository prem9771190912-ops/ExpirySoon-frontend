import api from '../config/axiosConfig';


export const registerPush = async () => {


      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push messaging is not supported in this browser.');
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('Notification permission denied');
          return;
        }

        const registration = await navigator.serviceWorker.register(new URL('../sw.js', import.meta.url));
      

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BPnkM3ZKeN2RzywT9V50ztMWJEUzNucltDJ-bG2DFvQv0kU0JBt6s6jmP1JR1pPlfzYL56FryKvnUG5ZbJSkt0E'

        });

        await api.post('/subscribe-services/push-notification', {subscription});
        console.log('Push subscription sent to backend:', subscription);
        

      } catch (err) {
        console.log('Error during push registration:', err);
      }
    };
