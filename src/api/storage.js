import storage from 'mobiletto';

class Storage {
  constructor() {
    this.b2 = storage('b2',
      process.env.B2_KEY_ID,
      process.env.B2_KEY_NAME,
      { bucket: 'filewarehouse'});
  }

  do_stuff() {
    console.log("asdasdd");
  }
}

export default Storage;
