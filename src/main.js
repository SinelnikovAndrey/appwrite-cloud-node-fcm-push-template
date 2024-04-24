import { throwIfMissing, sendPushNotification } from './utils.js';

export default async ({ req, res, log, error }) => {
  throwIfMissing(process.env, [
    'FCM_PROJECT_ID',
    'FCM_PRIVATE_KEY',
    'FCM_CLIENT_EMAIL',
    'FCM_DATABASE_URL',
  ]);

  try {
    throwIfMissing(req.body, ['deviceToken', 'message']);
    throwIfMissing(req.body.message, ['title', 'body']);
  } catch (err) {
    return res.json({ ok: false, error: err.message }, 400);
  }

  log(`Sending message to device: ${req.body.deviceToken}`);

  try {
    const response = await sendPushNotification({
      notification: {
        title: req.body.message.title,
        body: req.body.message.body
      },
      data: {
        desc: req.body.message.body,
        time: Date.now().toString(),
      },
      token: req.body.deviceToken,
    });

      
    log(`Successfully sent message: ${response}`);
    console.log("here is the request")
  console.log(req);
  console.log(res);

    return res.json({ ok: true, messageId: response });
  } catch (e) {
    error(e);
    log("there was an error");
    log(e);
    console.log(e)
    return res.json({ ok: false, error: `failed due to ${e}`}, 500);
  }
};
