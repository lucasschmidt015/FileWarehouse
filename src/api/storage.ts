import BackBlazeB2 from 'backblaze-b2';

class Storage {
  b2: BackBlazeB2;

  constructor() {
    this.b2 = new BackBlazeB2({
      applicationKey: process.env.B2_KEY_ID as string,
      applicationKeyId: process.env.B2_APPLICATION_KEY as string,
    });
  }

  do_stuff() {
    console.log("asdasdd");
  }
}

export default Storage;
