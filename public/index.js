const settings = {
  index: 0,
  pauseSocials: false,
  timeBetweenCycles: 7000, // Time in miliseconds
  timeBetweenRestartOfSocial: 30000, // Time in miliseconds
  socials: [
    {
      icon: 'github',
      username: '@DekeTonucci',
      message: 'Checkout my latest code projects:',
    },
    {
      icon: 'twitter',
      username: '@DekeTonucci',
      message: 'Follow me on Twitter:',
    },
    {
      icon: 'twitch',
      username: '@DekeTonucci',
      message: 'Follow me on Twitch:',
    },
    {
      icon: 'youtube',
      username: '@DekeTonucci',
      message: 'Follow me on YouTube:',
    },
  ],
  alerts: [],
};

const testContainer = document.querySelector('.test-display');
const widgetContainer = document.querySelector('.container');

function generateSocial() {
  widgetContainer.innerHTML = ``;
  testContainer.innerHTML = settings.socials[settings.index].icon;

  const template = `
    <div class="notification fadeInOut">
        <i class="fab fa-lg fa-${settings.socials[settings.index].icon} ${
    settings.socials[settings.index].icon
  }-bg"></i>
        <div class="messageContainer ${settings.socials[settings.index].icon}">
            <div class="text message">${
              settings.socials[settings.index].message
            }</div>
            <div class="text username">${
              settings.socials[settings.index].username
            }</div>
        </div>
    </div>
    `;
  widgetContainer.insertAdjacentHTML('afterbegin', template);
  testContainer.innerHTML = settings.socials[settings.index].icon;
}

function generateAlert() {
  widgetContainer.innerHTML = ``;
  testContainer.innerHTML = settings.alerts[0].icon;
  const template = `
    <div class="notification fadeInOut">
        <i class="fas fa-lg fa-${settings.alerts[0].icon} ${settings.alerts[0].icon}-bg"></i>
        <div class="messageContainer ${settings.alerts[0].icon}">
            <div class="text message">${settings.alerts[0].message}</div>
            <div class="text username">${settings.alerts[0].username}</div>
        </div>
    </div>
    `;
  widgetContainer.insertAdjacentHTML('afterbegin', template);
  settings.alerts.shift(); // Remove first alert form que
}

(() => {
  setInterval(() => {
    // console.log(settings.pauseSocials);
    if (settings.alerts.length > 0) {
      generateAlert();
    } else {
      if (
        settings.index === settings.socials.length - 1 &&
        settings.pauseSocials === false
      ) {
        settings.pauseSocials = true;
        generateSocial();
      } else if (
        settings.index === settings.socials.length - 1 &&
        settings.pauseSocials === true
      ) {
        // console.log('Pause socials..');
        testContainer.innerHTML = 'Socials are paused...';
        settings.pauseSocials = true;
        settings.index = 0;
        let tempTime = 0;
        const tempTimer = setInterval(function () {
          tempTime += 1;
          document.querySelector('.test-timer').innerHTML = tempTime;
        }, 1000);
        setTimeout(() => {
          clearInterval(tempTimer);
          settings.pauseSocials = false;
          //   console.log('Restarting socials...');
          document.querySelector('.test-timer').innerHTML = '';
        }, settings.timeBetweenRestartOfSocial);
      } else if (
        settings.index < settings.socials.length - 1 &&
        settings.pauseSocials === false
      ) {
        generateSocial();
        settings.index += 1;
      }
    }
  }, settings.timeBetweenCycles);
})();

// Connect to streamlabs socket
const streamlabs = io(
  `https://sockets.streamlabs.com?token=${STREAMLABS_SOCKET}`,
  {
    transports: ['websocket'],
  }
);

streamlabs.on('event', (eventData) => {
  console.log({ eventData });
  const { type, message } = eventData;
  switch (type) {
    case 'follow':
      settings.alerts.push({
        icon: 'heart',
        username: message[0].name,
        message: `New Follower:`,
      });
      break;
    // case 'subscription':
    //   console.log(`New Subscription: ${message[0].name} `);
    case 'resub':
      settings.alerts.push({
        icon: 'star',
        username: message[0].name,
        message: `New Resub: ${message[0].name} x ${message[0].total_months} with a streak of ${message[0].streak_months} months!`,
      });
      break;
      // case 'streamlabels':
      //   console.log(`Streamlabels Update?: ${Date.now()} `);
      //   break;
      defalt: console.log('Do nothing...');
  }
});
