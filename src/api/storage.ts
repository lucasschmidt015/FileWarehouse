import BackBlazeB2 from 'backblaze-b2';

class Storage {
  b2: BackBlazeB2;

  constructor() {
    this.b2 = new BackBlazeB2({
      applicationKey: process.env.B2_KEY_ID as string,
      applicationKeyId: process.env.B2_APP_KEY as string,
    });
  }

  async uploadFile(filePath: string) {
    this.b2.uploadFile({
    });
  }

  async getFile(id: string) {
  }

  async removeFile(id: string) {
  }
}

const storage = new Storage();
export default storage;
