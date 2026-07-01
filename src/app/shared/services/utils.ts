export class Utils {

  static convertToUppercase(arr: Array<{ [key: string]: any }>): Array<{ [key: string]: any }> {
    return arr.map(obj => {
      const newObj: { [key: string]: any } = {};
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          newObj[key] = obj[key].toUpperCase();
        } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          newObj[key] = Utils.convertToUppercase([obj[key]])[0];
        } else {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    });
  }
}
