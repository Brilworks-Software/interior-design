export async function postToSlack(text) {
  const url = import.meta.env.VITE_SLACK_URL;
  const token = import.meta.env.VITE_SLACK_TOKEN;
  const channel = import.meta.env.VITE_SLACK_CHANNEL_ID;

  if (!url || !token || !channel) {
    if (import.meta.env.DEV) {
      console.warn('[Slack] Missing env vars; set VITE_SLACK_URL, VITE_SLACK_TOKEN, VITE_SLACK_CHANNEL_ID');
    }
    return;
  }

  try {
    // Using a CORS proxy since Slack's chat.postMessage does not support browser CORS natively
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ channel, text }),
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => '');
      throw new Error(
        `Slack request failed (${response.status}): ${responseText || response.statusText}`
      );
    }
  } catch (error) {
    console.warn('[Slack] Failed to post message:', error);
  }
}

export function formatUserLoginSlackMessage(params) {
  const { name, number, ip, ipInfo } = params;
  
  const city = ipInfo?.city || '';
  const region = ipInfo?.region || '';
  const countryName = ipInfo?.country_name || '';
  const org = ipInfo?.org || '';
  const timezone = ipInfo?.timezone || '';

  const lines = [
    `*New Interior Design User Started!*`,
    `Name: ${name || 'unknown'}`,
    `Number: ${number || 'unknown'}`,
  ];
  
  if (ip) lines.push(`\nIP: ${ip}`);
  if (city) lines.push(`City: ${city}`);
  if (region) lines.push(`Region: ${region}`);
  if (countryName) lines.push(`Country: ${countryName}`);
  if (timezone) lines.push(`Timezone: ${timezone}`);
  if (org) lines.push(`Org: ${org}`);

  return lines.join('\n');
}
