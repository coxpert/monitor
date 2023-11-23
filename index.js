require('dotenv').config()
const schedule = require('node-schedule'); 
const shell = require('shelljs');
const { IncomingWebhook } = require('@slack/webhook')

const webHookUrl = process.env.SLACK_WEBHOOK ?? 'https://hooks.slack.com/services/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'
const environment = process.env.APP_ENV ?? 'development'
const serverUrl = process.env.APP_SERVER ?? 'https://forge.laravel.com/servers/719367'

const webhookClient = new IncomingWebhook(webHookUrl);

const job = schedule.scheduleJob('*/5 * * * * *', async () => {
    const response = await shell.exec('systemctl is-active nginx')
    const status = response.stdout.trim();
    if(status !== 'active') {
        await shell.exec('systemctl start nginx')
        
        const message = {
            channel: '#server-alerts',
            text: `<${serverUrl}|Server is restarted>`,
            username: environment,
            icon_emoji: ':makeitrain:',
            unfurl_links: true,
            unfurl_media: false,
            link_names: true,
        };

        try {
            await webhookClient.send(message);
        } catch (err) {
            console.log(err)
        }
    }
});