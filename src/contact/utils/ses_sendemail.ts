import * as AWS from 'aws-sdk';
import { sendEmailDto } from '../dto/contact.dto';

export const sendEmailBySES = async (data: sendEmailDto) => {
  const params = {
    Destination: {
      /* required */
      // CcAddresses: [
      //   'EMAIL_ADDRESS',
      //   /* more items */
      // ],
      ToAddresses: [
        data.email,
        /* more items */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: `
<html lang="en"> 
<body> 
    <div> 
        <p><strong>Name: </strong>${data.name}</p> 
        <p><strong>Email: </strong>${data.email}</p> 
        <p><strong>Phone number: </strong>${data.phone}</p> 
        <p><strong>Subject: </strong>${data.message}</p> 
        <p><strong>Address: </strong>${data.address}</p> 
        <p><strong>ZIP: </strong>${data.zipcode}</p> 
        <p><strong>Message: </strong>${data.message}</p> 
    </div> 
</body> 
</html>
          `,
        },
        // Text: {
        //   Charset: 'UTF-8',
        //   Data: message,
        // },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: data.subject,
      },
    },
    Source: 'arconinteriorctg@gmail.com' /* required */,
    ReplyToAddresses: [
      'arconinteriorctg@gmail.com',
      /* more items */
    ],
  };

  // Create the promise and SES service object
  const sendEmailPromise = new AWS.SES({ apiVersion: '2010-12-01' })
    .sendEmail(params)
    .promise();

  sendEmailPromise
    .then(function (data) {
      console.log(data.MessageId);
    })
    .catch(function (err) {
      console.error(err, err.stack);
    });
};
