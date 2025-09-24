module.exports = {
  f1() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1);
        console.log("solved f1");
      }, 100);
    })
  }, 
  f2() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(2);
        console.log("solved f2");
      }, 200);
    })
  }, 
  f3() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(3);
        console.log("solved f3");
      }, 300);
    })
  },
  critical1() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(3);
        console.log("critical 1!");
      }, 300);
    })
  },
  critical2() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(3);
        console.log("critical 2!");
      }, 300);
    })
  },
  critical3() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(3);
        console.log("critical 3!");
      }, 300);
    })
  },
  print(message) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(3);
        console.log(message);
      }, 300);
    })
  }
}