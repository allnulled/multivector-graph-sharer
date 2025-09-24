Promise.all([
  (() => {
    (() => console.log('Sync 1'))();
    (() => console.log('Sync 2'))();
    return Promise.resolve();
  })(), (async () => {
    console.log('Async 1');
    return 'done 1';
  })(), (async () => {
    console.log('Async 2');
    return 'done 2';
  })(), (async () => {
    await (async () => {
      console.log('Serie 1');
      return 'done 3';
    })();
    await (async () => {
      console.log('Serie 2');
      return 'done 4';
    })()
  })()
])
